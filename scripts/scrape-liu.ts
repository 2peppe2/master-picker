/**
 * Regenerates the per-program JSON in data/ from studieinfo.liu.se.
 *
 *   npx tsx scripts/scrape-liu.ts                      # every configured program and year
 *   npx tsx scripts/scrape-liu.ts --programs 6CMED --years 2024
 *   npx tsx scripts/scrape-liu.ts --verify 6CDDD:2024  # diff against committed data
 *   npx tsx scripts/scrape-liu.ts --no-cache           # ignore .cache/liu
 *
 * This script only writes JSON. Seeding the database stays a separate, manual
 * `npm run seed` so the generated data can be reviewed first.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Course, CourseDetails, MasterName } from "../prisma/json_types";
import { buildCourses, type CourseAnomaly } from "./liu/buildCourses";
import { buildMasters, type MasterIconSuggestion } from "./liu/buildMasters";
import { setCacheEnabled, urls } from "./liu/fetch";
import { LocaleCollector, mergeLocales } from "./liu/locales";
import { candidateTerms, fetchCourseDetail } from "./liu/parseCourseDetail";
import { fetchPlanVersions, pickVersion, type PlanVersion } from "./liu/parsePlanVersions";
import { fetchProgramPlan } from "./liu/parseProgramPlan";
import { buildRequirements } from "./liu/parseRequirements";
import {
  ALL_PROGRAMS,
  DEFAULT_YEARS,
  cleanProfileName,
  isLanguageTrack,
  isTechnicalOrientation,
  MASTER_PROFILE_ONLY,
  findProgram,
  stripProfilePrefix,
  type ProgramSpec,
} from "./liu/programs";
import { renderReport } from "./liu/report";
import { validateRequirements } from "./liu/validate";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const REVIEW_DIR = path.join(DATA_DIR, "generated", "review");

interface Args {
  programs: string[];
  years: number[];
  verify: { code: string; year: number } | null;
  cache: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { programs: [], years: [], verify: null, cache: true };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    if (flag === "--no-cache") args.cache = false;
    else if (flag === "--programs") args.programs = argv[++i].split(",").map((p) => p.toUpperCase());
    else if (flag === "--years") args.years = argv[++i].split(",").map(Number);
    else if (flag === "--verify") {
      const [code, year] = argv[++i].split(":");
      args.verify = { code: code.toUpperCase(), year: Number(year) };
    } else throw new Error(`Unknown argument: ${flag}`);
  }
  return args;
}

const writeJson = (file: string, value: unknown) =>
  writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf-8");

interface ScrapeResult {
  program: ProgramSpec;
  year: number;
  planId: number;
  campus: PlanVersion["campus"];
  courses: Course[];
  details: CourseDetails;
  masters: MasterName[];
  requirements: Record<string, unknown>;
  report: string;
  iconSuggestions: MasterIconSuggestion[];
}

async function scrapeProgramYear(
  program: ProgramSpec,
  version: PlanVersion,
  locales: LocaleCollector,
): Promise<ScrapeResult | null> {
  const { year, planId } = version;
  const [english, swedish] = await Promise.all([
    fetchProgramPlan(program.code, planId, "en"),
    fetchProgramPlan(program.code, planId, "sv"),
  ]);
  if (!english || !swedish) return null;

  // 6CIII, 6CIEI and 6CTMA list technical orientations alongside master
  // profiles, and the international programs add their language tracks; only
  // the profiles are masters in this app's sense.
  const dropped: { id: string; name: string }[] = [];
  const kept = new Map<string, string>();
  const keptSwedish = new Map<string, string>();
  const keptSwedishDisplay = new Map<string, string>();

  for (const [id, name] of english.specializations) {
    const swedishName = swedish.specializations.get(id) ?? name;
    if (MASTER_PROFILE_ONLY.has(program.code) && isTechnicalOrientation(swedishName)) {
      dropped.push({ id, name });
      continue;
    }
    if (isLanguageTrack(swedishName)) {
      dropped.push({ id, name });
      continue;
    }
    kept.set(id, cleanProfileName(name));
    // The prose anchor keeps the longer form; see cleanProfileName.
    keptSwedish.set(id, stripProfilePrefix(swedishName));
    keptSwedishDisplay.set(id, cleanProfileName(swedishName));
  }

  const keptIds = new Set(kept.keys());
  const { courses, anomalies } = buildCourses(english.rows, program.id, keptIds);
  const { masters, iconSuggestions } = buildMasters(kept);

  // Swedish names per course, for the sv locale bundle.
  const swedishCourseNames = new Map<string, string>();
  for (const row of swedish.rows) swedishCourseNames.set(row.courseCode, row.name);

  // The two pages share main-field ids, which gives a Swedish -> English map
  // for the field names that appear in the (Swedish) profile rules.
  const fieldTranslations = new Map<string, string>();
  for (const [id, swedishField] of swedish.mainFields) {
    const englishField = english.mainFields.get(id);
    if (englishField) fieldTranslations.set(swedishField.toLowerCase(), englishField);
  }

  const requirements = buildRequirements(
    english.rows,
    swedish.prose,
    english.prose,
    keptSwedish,
    fieldTranslations,
  );

  const details: CourseDetails = {};
  const detailAnomalies: CourseAnomaly[] = [];

  await Promise.all(
    courses.map(async (course) => {
      for (const term of candidateTerms(course.link).slice(0, 4)) {
        const detail = await fetchCourseDetail(course.code, term);
        if (detail) {
          details[course.code] = detail;
          return;
        }
      }
      detailAnomalies.push({
        courseCode: course.code,
        note: "no course page found for any recent term; detailed data is missing",
      });
    }),
  );

  // Collect locale keys.
  locales.program(program.id, program.name, program.swedishName ?? program.name);
  for (const course of courses) {
    locales.course(course.code, course.name, swedishCourseNames.get(course.code) ?? course.name);
    const detail = details[course.code];
    if (!detail) continue;
    for (const field of detail.main_field) locales.mainField(field, field);
    for (const exam of detail.examinations) locales.examination(exam.name, exam.name);
  }
  for (const master of masters) {
    locales.master(master.id, master.name, keptSwedishDisplay.get(master.id) ?? master.name);
  }

  const courseCodes = new Set(courses.map((c) => c.code));
  const danglingCourses: { master: string; codes: string[] }[] = [];
  for (const [master, list] of Object.entries(requirements.requirements)) {
    const missing = new Set<string>();
    for (const requirement of list) {
      if (requirement.type !== "COURSE_SELECTION") continue;
      for (const code of requirement.courses as unknown as string[]) {
        if (!courseCodes.has(code)) missing.add(code);
      }
    }
    if (missing.size > 0) danglingCourses.push({ master, codes: [...missing].sort() });
  }

  const schemaErrors = validateRequirements(requirements.requirements);
  if (schemaErrors.length > 0) {
    throw new Error(
      `${program.id}/${planId} produced requirements that violate data/schemas/master_requirement.schema.json:\n  ${schemaErrors.join("\n  ")}`,
    );
  }

  const mastersWithoutCourses = masters
    .filter((m) => !courses.some((c) => c.mastersPrograms.includes(m.id)))
    .map((m) => m.id);

  const report = renderReport({
    programCode: program.id,
    planId,
    year,
    courseCount: courses.length,
    masterIds: masters.map((m) => m.id),
    droppedSpecializations: dropped,
    requirements,
    anomalies: [...anomalies, ...detailAnomalies],
    iconSuggestions,
    danglingCourses,
    mastersWithoutCourses,
  });

  return {
    program,
    year,
    planId,
    campus: version.campus,
    courses,
    details,
    masters,
    requirements: {
      $schema: "./schemas/master_requirement.schema.json",
      ...requirements.requirements,
    },
    report,
    iconSuggestions,
  };
}

async function writeResult(result: ScrapeResult) {
  const prefix = path.join(DATA_DIR, `${result.program.id}_${result.planId}`);
  await writeJson(`${prefix}_courses.json`, result.courses);
  await writeJson(`${prefix}_detailed_courses.json`, result.details);
  // Record where the profile data came from; the plan syllabus is the page that
  // holds "Profiler", "Examenskrav" and "Särskilda kurskrav".
  const syllabus = urls.programSyllabus(result.program.code, result.planId);
  await writeJson(
    `${prefix}_master_names.json`,
    result.masters.map((master) => ({ ...master, link: syllabus })),
  );
  await writeJson(`${prefix}_master_requirements.json`, result.requirements);

  await mkdir(REVIEW_DIR, { recursive: true });
  await writeFile(
    path.join(REVIEW_DIR, `${result.program.id}_${result.planId}_requirements_review.md`),
    result.report,
    "utf-8",
  );
}

/**
 * The strongest correctness signal available: re-scrape a program-year that is
 * already committed and hand-verified, and diff.
 */
async function verify(id: string, year: number) {
  const program = findProgram(id);
  const versions = await fetchPlanVersions(program.code);
  const version = pickVersion(versions, program, year);
  if (!version) throw new Error(`No plan for ${id} ${year}`);

  const result = await scrapeProgramYear(program, version, new LocaleCollector());
  if (!result) throw new Error("plan page not found");

  const committed: Course[] = JSON.parse(
    await readFile(path.join(DATA_DIR, `${program.id}_${version.planId}_courses.json`), "utf-8"),
  );

  const scraped = new Map(result.courses.map((c) => [c.code, c]));
  const expected = new Map(committed.map((c) => [c.code, c]));

  const onlyScraped = [...scraped.keys()].filter((c) => !expected.has(c));
  const onlyCommitted = [...expected.keys()].filter((c) => !scraped.has(c));
  const differing: string[] = [];

  // The committed files are not key-ordered consistently, so compare by value.
  const canonical = (value: unknown): string =>
    JSON.stringify(value, (_, v) =>
      v && typeof v === "object" && !Array.isArray(v)
        ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
        : v,
    );

  for (const [code, course] of expected) {
    const got = scraped.get(code);
    if (!got) continue;
    if (canonical(got) !== canonical(course)) differing.push(code);
  }

  console.log(`\nVerify ${program.id} ${year} (plan ${version.planId})`);
  console.log(`  committed: ${committed.length} courses, scraped: ${result.courses.length}`);
  console.log(`  only in scrape:    ${onlyScraped.join(", ") || "-"}`);
  console.log(`  only in committed: ${onlyCommitted.join(", ") || "-"}`);
  console.log(`  differing:         ${differing.length}`);
  for (const code of differing.slice(0, 5)) {
    console.log(`\n  --- ${code}`);
    console.log(`  scraped:   ${JSON.stringify(scraped.get(code))}`);
    console.log(`  committed: ${JSON.stringify(expected.get(code))}`);
  }
}

/**
 * @param seen every plan revision fetched this run, by program id, so campus can
 *   be filled in for years whose course data was already committed.
 */
async function updateProgramIndex(
  results: ScrapeResult[],
  seen: Map<string, Map<number, PlanVersion>>,
) {
  const file = path.join(DATA_DIR, "programs.json");
  const current: {
    id: string;
    name: string;
    shortname: string;
    years: { year: number; id: number; link?: string; campus?: string }[];
  }[] = JSON.parse(await readFile(file, "utf-8"));
  const byId = new Map(current.map((p) => [p.id, p]));
  const codeById = new Map(ALL_PROGRAMS.map((p) => [p.id, p.code]));

  for (const result of results) {
    let entry = byId.get(result.program.id);
    if (!entry) {
      entry = {
        id: result.program.id,
        name: result.program.name,
        shortname: result.program.shortname,
        years: [],
      };
      byId.set(entry.id, entry);
      current.push(entry);
    }
    if (!entry.years.some((y) => y.year === result.year)) {
      entry.years.push({
        year: result.year,
        id: result.planId,
        link: urls.programSyllabus(result.program.code, result.planId),
        campus: result.campus ?? undefined,
      });
    }
    entry.years.sort((a, b) => a.year - b.year);
  }

  // Years that predate a change still lack a link or a campus; both are known
  // from the plan id and this run's version dropdowns, so fill them in rather
  // than leaving the index half-annotated. `codeById` matters for the
  // international variants, whose id is not a studieinfo program code.
  for (const entry of byId.values()) {
    const code = codeById.get(entry.id) ?? entry.id;
    const versions = seen.get(entry.id);
    for (const year of entry.years) {
      year.link ??= urls.programSyllabus(code, year.id);
      year.campus ??= versions?.get(year.year)?.campus ?? undefined;
    }
  }

  await writeJson(file, current);
  // starting_year_programs.json is a duplicate of programs.json that the client
  // imports directly; keep the two in sync.
  await writeJson(path.join(DATA_DIR, "starting_year_programs.json"), current);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  setCacheEnabled(args.cache);

  if (args.verify) {
    await verify(args.verify.code, args.verify.year);
    return;
  }

  const programs =
    args.programs.length > 0 ? args.programs.map(findProgram) : ALL_PROGRAMS;
  const years = args.years.length > 0 ? args.years : DEFAULT_YEARS;

  const locales = new LocaleCollector();
  const results: ScrapeResult[] = [];
  const iconSuggestions: MasterIconSuggestion[] = [];
  // Every revision this run resolved, so updateProgramIndex can annotate years
  // that were skipped because their course data is already committed.
  const seen = new Map<string, Map<number, PlanVersion>>();

  // Anything already in the index keeps its committed, reviewed files; only
  // genuinely new program-years are generated. Pass an explicit --programs
  // /--years pair to regenerate one deliberately.
  const index: { id: string; years: { year: number }[] }[] = JSON.parse(
    await readFile(path.join(DATA_DIR, "programs.json"), "utf-8"),
  );
  const committedYears = new Map(
    index.map((p) => [p.id, new Set(p.years.map((y) => y.year))]),
  );
  const explicit = args.programs.length > 0 && args.years.length > 0;

  for (const program of programs) {
    const versions = await fetchPlanVersions(program.code);
    const existingYears = committedYears.get(program.id) ?? new Set<number>();

    for (const year of years) {
      const version = pickVersion(versions, program, year);
      if (!version) {
        console.log(`  ${program.id} ${year}: no plan published, skipping`);
        continue;
      }
      const forProgram = seen.get(program.id) ?? new Map<number, PlanVersion>();
      forProgram.set(year, version);
      seen.set(program.id, forProgram);

      if (!explicit && existingYears.has(year)) {
        console.log(`  ${program.id} ${year}: already in data/, skipping`);
        continue;
      }

      process.stdout.write(`  ${program.id} ${year} (plan ${version.planId}) ... `);
      const result = await scrapeProgramYear(program, version, locales);
      if (!result) {
        console.log("plan page not found, skipping");
        continue;
      }
      await writeResult(result);
      results.push(result);
      iconSuggestions.push(...result.iconSuggestions);
      console.log(`${result.courses.length} courses, ${result.masters.length} masters`);
    }
  }

  // Still runs when nothing was generated: a run that only skips already
  // committed years is how campus gets backfilled onto them.
  await updateProgramIndex(results, seen);

  if (results.length === 0) {
    console.log("\nNothing generated; program index refreshed.");
    return;
  }

  const added = await mergeLocales(locales, ROOT);

  await mkdir(path.join(DATA_DIR, "generated"), { recursive: true });
  const uniqueSuggestions = [
    ...new Map(iconSuggestions.map((s) => [`${s.masterId}-${s.suggested}`, s])).values(),
  ];
  await writeJson(path.join(DATA_DIR, "generated", "icon_suggestions.json"), uniqueSuggestions);

  console.log(`\nGenerated ${results.length} program-years.`);
  console.log(`Locale keys added: en ${added.en}, sv ${added.sv}`);
  console.log(`Review files: data/generated/review/`);
  console.log("\nNot run: `npm run seed`. Review the report files first.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
