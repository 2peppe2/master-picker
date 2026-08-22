import type { PlanRow } from "./parseProgramPlan";

/**
 * The on-disk requirement shape, i.e. data/schemas/master_requirement.schema.json.
 *
 * This deliberately does not reuse `RequirementUnion` from prisma/json_types.ts:
 * that type describes the shape after the seed has read the rows back out of the
 * database (`courses: { courseCode }[]`, and no CREDITS_TOTAL member), which is
 * why prisma/seed.ts casts through `unknown` when reading these files. The JSON
 * schema is the contract for what we write.
 */
export type RequirementUnion =
  | {
      type:
        | "CREDITS_TOTAL"
        | "CREDITS_MASTER_TOTAL"
        | "CREDITS_PROFILE_TOTAL"
        | "CREDITS_ADVANCED_PROFILE"
        | "CREDITS_ADVANCED_MASTER";
      credits: number;
    }
  | { type: "CREDITS_MAIN_FIELD_TOTAL"; credits: number; fields: string[] }
  | { type: "COURSE_SELECTION"; minCount: number; courses: string[] };

export interface RuleTrace {
  master: string;
  requirement: RequirementUnion | null;
  /** The sentence the requirement was derived from, or "" when structural. */
  source: string;
  /** Set when the emitted requirement is weaker than the real rule. */
  approximation?: string;
}

export interface RequirementsResult {
  requirements: Record<string, RequirementUnion[]>;
  traces: RuleTrace[];
  /** Sentences in the rules section that matched no pattern. */
  unmatched: { master: string; sentence: string }[];
}

const COURSE_CODE = /\b[A-Z]{3,4}[A-Z0-9]\d{2}\b/g;

const SWEDISH_NUMBERS: Record<string, number> = {
  en: 1,
  ett: 1,
  två: 2,
  tva: 2,
  tre: 3,
  fyra: 4,
  fem: 5,
  sex: 6,
};

function toCount(word: string): number | null {
  const lowered = word.toLowerCase();
  if (SWEDISH_NUMBERS[lowered]) return SWEDISH_NUMBERS[lowered];
  const numeric = Number(lowered);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.:])\s+(?=[A-ZÅÄÖ])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

/**
 * Locate the per-profile rules by slicing the prose at each specialisation's
 * Swedish name. Headings vary a lot between programs ("Profiler och regelverk",
 * "Masterprofiler", "Kurskrav för dessa masterprofiler", ...), so anchoring on
 * the profile names themselves is more reliable than on the heading.
 */
/**
 * Headings of the syllabus sections that follow the profile rules. The prose is
 * one flat blob, so without these the last profile's slice swallows the general
 * degree rules and reports them as that profile's own ("minst 90 hp på avancerad
 * nivå" is a program requirement, not a profile requirement).
 */
const SECTION_AFTER_PROFILES = [
  /Undervisnings- och arbetsformer/,
  /Förkunskapskrav/,
  /Tillträdeskrav/,
  /Examenskrav/,
  // The short headings need a boundary: a bare "Regler" also sits inside
  // "Reglerteori", which is a course name in several profile rules.
  /Examination(?![a-zåäö])/,
  /Regler(?![a-zåäö])/,
];

function cutAtNextSection(text: string): string {
  let end = text.length;
  for (const heading of SECTION_AFTER_PROFILES) {
    const index = text.search(heading);
    if (index >= 0 && index < end) end = index;
  }
  return text.slice(0, end).trim();
}

function sliceByProfile(prose: string, profileNames: Map<string, string>): Map<string, string> {
  const hits: { id: string; index: number; length: number }[] = [];

  for (const [id, name] of profileNames) {
    if (!name) continue;
    // Take the last mention: earlier ones are the "these profiles are offered"
    // list, the last is where the rule text sits.
    let index = -1;
    let from = 0;
    for (;;) {
      const next = prose.indexOf(name, from);
      if (next === -1) break;
      index = next;
      from = next + 1;
    }
    if (index >= 0) hits.push({ id, index, length: name.length });
  }

  hits.sort((a, b) => a.index - b.index);

  const slices = new Map<string, string>();
  hits.forEach((hit, i) => {
    const end = i + 1 < hits.length ? hits[i + 1].index : Math.min(prose.length, hit.index + 1200);
    slices.set(hit.id, cutAtNextSection(prose.slice(hit.index + hit.length, end)));
  });
  return slices;
}

function parseProfileProse(
  master: string,
  text: string,
  /** Swedish main-field names, longest first. */
  swedishFields: string[],
  traces: RuleTrace[],
  unmatched: { master: string; sentence: string }[],
): { requirements: RequirementUnion[]; consumed: Set<string>; electiveCount?: number; electiveCredits?: number } {
  const requirements: RequirementUnion[] = [];
  const consumed = new Set<string>();
  let electiveCount: number | undefined;
  let electiveCredits: number | undefined;

  const push = (requirement: RequirementUnion, source: string, approximation?: string) => {
    requirements.push(requirement);
    traces.push({ master, requirement, source, approximation });
  };

  for (const sentence of sentences(text)) {
    let matched = false;

    // "Profilens valbara kurser ... av dessa ska minst 12 hp väljas". Checked
    // first because it also matches the generic "minst N hp" profile-total
    // pattern below, where it would mean something quite different.
    // ska / skall / sko / skoll
    const electiveHp = sentence.match(/av dessa sk[ao]l{0,2}\s+minst\s+(\d+)\s*hp\s+väljas/i);
    if (electiveHp) {
      electiveCredits = Number(electiveHp[1]);
      matched = true;
    }

    // "minst 42 hp varav 30 hp på avancerad nivå"
    const total = sentence.match(/minst\s+(\d+)\s*hp(?!\s*på avancerad)/i);
    const advanced = sentence.match(/varav\s+(\d+)\s*hp\s+på avancerad nivå/i);
    if (!electiveHp && total && /profil|inriktning/i.test(sentence)) {
      push({ type: "CREDITS_PROFILE_TOTAL", credits: Number(total[1]) }, sentence);
      matched = true;
    }
    if (advanced) {
      push({ type: "CREDITS_ADVANCED_PROFILE", credits: Number(advanced[1]) }, sentence);
      matched = true;
    }

    // "Obligatoriska och valbara kurser i profilen, minst 30 hp på avancerad
    // nivå." - the same rule as "varav N hp" but phrased without the "varav".
    // Excludes the main-field variant ("... på avancerad nivå inom
    // huvudområdet X"), which is a different requirement handled below.
    const advancedProfile = sentence.match(
      /minst\s+(\d+)\s*hp\s+på avancerad nivå(?!\s*(?:inom|i för)\b)/i,
    );
    if (!advanced && advancedProfile && /profil|inriktning/i.test(sentence)) {
      push({ type: "CREDITS_ADVANCED_PROFILE", credits: Number(advancedProfile[1]) }, sentence);
      matched = true;
    }

    // "minst 30 hp på avancerad nivå inom huvudområdet Elektroteknik".
    // "Med aktiva val av valbara kurser kan även 30 hp ... uppnås" describes
    // what a student *may* reach, not a requirement, so skip those.
    const isPossibility = /\b(kan (även )?|möjlig|kan uppnås)/i.test(sentence);
    const mainField = sentence.match(/(\d+)\s*hp\s+på avancerad nivå inom huvudområdet\s+(.{0,40})/i);
    if (mainField) {
      matched = true;
      // The capture runs into the rest of the sentence, so take the longest
      // known field name it starts with rather than guessing at word boundaries.
      const field = swedishFields.find((known) =>
        mainField[2].toLowerCase().startsWith(known.toLowerCase()),
      );
      if (field && !isPossibility) {
        push(
          { type: "CREDITS_MAIN_FIELD_TOTAL", credits: Number(mainField[1]), fields: [field] },
          sentence,
          "the advanced-level filter is dropped: CREDITS_MAIN_FIELD_TOTAL counts credits at any level",
        );
      }
    }

    // "Därav minst två av TATA64, TDDD08, TDDD14, TDDD20, TDDE34"
    const choice = sentence.match(/minst\s+(\w+)\s+av\s+(?=[^.]*[A-Z]{3,4}[A-Z0-9]\d{2})/i);
    if (choice) {
      const codes = [...sentence.slice(choice.index!).matchAll(COURSE_CODE)].map((m) => m[0]);
      const count = toCount(choice[1]);
      if (count && codes.length > 0) {
        codes.forEach((c) => consumed.add(c));
        push({ type: "COURSE_SELECTION", minCount: count, courses: codes }, sentence);
        matched = true;
      }
    }

    // "en av kurserna TDDD38, TDDD97 eller TDDC73 väljas"
    if (!matched) {
      const oneOf = sentence.match(/\ben av (?:kurserna|följande)/i);
      if (oneOf) {
        const codes = [...sentence.matchAll(COURSE_CODE)].map((m) => m[0]);
        if (codes.length > 0) {
          codes.forEach((c) => consumed.add(c));
          push({ type: "COURSE_SELECTION", minCount: 1, courses: codes }, sentence);
          matched = true;
        }
      }
    }

    // "Obligatoriska och två valbara kurser i profilen"
    const electiveN = sentence.match(/(\w+)\s+valbara kurser/i);
    if (electiveN) {
      const count = toCount(electiveN[1]);
      if (count) {
        electiveCount = count;
        matched = true;
      }
    }

    // "Minst 4 kurser på avancerad nivå ska väljas av de inom profilen föreslagna"
    const advancedCount = sentence.match(/minst\s+(\d+)\s+kurser\s+på avancerad nivå/i);
    if (advancedCount) {
      // Approximated below in buildRequirements, where course credits are known.
      electiveCount ??= undefined;
      traces.push({
        master,
        requirement: null,
        source: sentence,
        approximation: `"minst ${advancedCount[1]} kurser på avancerad nivå" has no exact representation; emitted as CREDITS_ADVANCED_PROFILE using the profile's typical course size`,
      });
      requirements.push({
        type: "CREDITS_ADVANCED_PROFILE",
        credits: Number(advancedCount[1]) * 6,
      });
      matched = true;
    }

    if (!matched && /\b(hp|kurs|profil|nivå)\b/i.test(sentence)) {
      unmatched.push({ master, sentence });
    }
  }

  return { requirements, consumed, electiveCount, electiveCredits };
}

/** Unique course codes for a specialisation, keeping plan order. */
function specCourses(rows: PlanRow[], spec: string, vofs: string[]) {
  const seen = new Set<string>();
  const out: PlanRow[] = [];
  for (const row of rows) {
    if (row.specialization !== spec || row.period === 0) continue;
    if (!vofs.includes(row.vof)) continue;
    if (seen.has(row.courseCode)) continue;
    seen.add(row.courseCode);
    out.push(row);
  }
  return out;
}

function buildCommonBase(
  prose: string,
  englishProse: string,
  rows: PlanRow[],
  englishFields: string[],
  traces: RuleTrace[],
): RequirementUnion[] {
  const push = (requirement: RequirementUnion, source: string, approximation?: string) => {
    traces.push({ master: "COMMON_BASE", requirement, source, approximation });
    return requirement;
  };

  const base: RequirementUnion[] = [
    push({ type: "CREDITS_TOTAL", credits: 300 }, "civilingenjörsexamen omfattar 300 hp"),
    push({ type: "CREDITS_MASTER_TOTAL", credits: 120 }, "de två avslutande åren omfattar 120 hp"),
  ];

  const advanced = prose.match(/minst\s+(\d+)\s*hp\s+på avancerad nivå/i);
  base.push(
    push(
      { type: "CREDITS_ADVANCED_MASTER", credits: Number(advanced?.[1] ?? 90) },
      advanced?.[0] ?? "default: 90 hp på avancerad nivå",
    ),
  );

  // "Särskilda kurskrav ... En av följande kurser ska vara avklarad: TANA21 ..."
  const specialRequirement = prose.match(
    /En av följande kurser ska vara avklarad[^.]*?((?:[A-Z]{3,4}[A-Z0-9]\d{2}[^.]*?){2,})(?=\s*(?:Examensben|Särskild|$))/i,
  );
  if (specialRequirement) {
    const codes = [...new Set([...specialRequirement[1].matchAll(COURSE_CODE)].map((m) => m[0]))];
    if (codes.length > 0) {
      base.push(
        push(
          { type: "COURSE_SELECTION", minCount: 1, courses: codes },
          specialRequirement[0].slice(0, 200),
        ),
      );
    }
  }

  // The bachelor project and the degree project are compulsory, program-wide
  // courses; pick them up structurally rather than from prose.
  const thesisPattern =
    /thesis|degree project|bachelor|independent work|kandidat|examensarbete/i;
  const theses = new Set<string>();
  for (const row of rows) {
    if (row.specialization !== "" || row.vof !== "c") continue;
    if (row.semester < 6 || !thesisPattern.test(row.name)) continue;
    theses.add(row.courseCode);
  }
  for (const code of [...theses].sort()) {
    base.push(
      push(
        { type: "COURSE_SELECTION", minCount: 1, courses: [code] },
        `compulsory thesis course found in the plan: ${code}`,
      ),
    );
  }

  // "Degree of Master of Science (120 credits) with a major in A, B, C or D".
  // The prose runs on past the degree title, so keep only the fragments that
  // are actual main fields of this program.
  const major = englishProse.match(/with a major in\s+(.{0,200})/i);
  if (major) {
    const fields = major[1]
      .replace(/\s+or\s+/gi, ", ")
      .split(",")
      .map((f) => f.trim())
      .map((f) => englishFields.find((known) => f.startsWith(known)) ?? "")
      .filter((f, i, all) => f && all.indexOf(f) === i);
    if (fields.length > 0) {
      base.push(
        push(
          { type: "CREDITS_MAIN_FIELD_TOTAL", credits: 30, fields },
          major[0].slice(0, 200),
          "the advanced-level filter is dropped: CREDITS_MAIN_FIELD_TOTAL counts credits at any level",
        ),
      );
    }
  }

  return base;
}

export function buildRequirements(
  rows: PlanRow[],
  swedishProse: string,
  englishProse: string,
  /** specialisation id -> Swedish name, already filtered to kept profiles */
  swedishNames: Map<string, string>,
  /**
   * Swedish main-field name (lowercased) -> English name. The rules are written
   * in Swedish but `Course.mainField` and the seed's `field_*` keys are English,
   * so field names lifted out of the prose have to be translated or the
   * requirement will never match any course.
   */
  fieldTranslations: Map<string, string>,
): RequirementsResult {
  const traces: RuleTrace[] = [];
  const unmatched: { master: string; sentence: string }[] = [];
  const englishFields = [...fieldTranslations.values()].sort((a, b) => b.length - a.length);
  const swedishFields = [...fieldTranslations.keys()].sort((a, b) => b.length - a.length);

  const requirements: Record<string, RequirementUnion[]> = {
    COMMON_BASE: buildCommonBase(swedishProse, englishProse, rows, englishFields, traces),
  };

  const slices = sliceByProfile(swedishProse, swedishNames);

  for (const master of [...swedishNames.keys()].sort()) {
    const prose = slices.get(master) ?? "";
    const parsed = parseProfileProse(master, prose, swedishFields, traces, unmatched);
    const list: RequirementUnion[] = [];

    for (const requirement of parsed.requirements) {
      if (requirement.type !== "CREDITS_MAIN_FIELD_TOTAL") {
        list.push(requirement);
        continue;
      }
      const translated = requirement.fields
        .map((f) => fieldTranslations.get(f.toLowerCase()))
        .filter((f): f is string => Boolean(f));
      if (translated.length === requirement.fields.length) {
        // Mutate so the trace recorded during parsing shows the final value.
        requirement.fields = translated;
        list.push(requirement);
      } else {
        // An untranslatable field name means the sentence was misread; drop the
        // requirement rather than emit one that can never be satisfied.
        const trace = traces.find((t) => t.requirement === requirement);
        if (trace) trace.requirement = null;
        traces.push({
          master,
          requirement: null,
          source: requirement.fields.join(", "),
          approximation: `dropped: "${requirement.fields.join(", ")}" is not one of this program's main fields, so the sentence was probably misparsed`,
        });
      }
    }

    const compulsory = specCourses(rows, master, ["c"]);
    const either = specCourses(rows, master, ["c/e"]);
    const elective = specCourses(rows, master, ["e"]);

    for (const row of compulsory) {
      if (parsed.consumed.has(row.courseCode)) continue;
      list.push({ type: "COURSE_SELECTION", minCount: 1, courses: [row.courseCode] });
      traces.push({
        master,
        requirement: list[list.length - 1],
        source: `compulsory (O) in the plan, semester ${row.semester}`,
      });
    }

    // o/v courses are alternatives to each other within the same slot.
    const groups = new Map<string, string[]>();
    for (const row of either) {
      if (parsed.consumed.has(row.courseCode)) continue;
      const key = `${row.semester}-${row.period}`;
      groups.set(key, [...(groups.get(key) ?? []), row.courseCode]);
    }
    for (const [key, codes] of groups) {
      list.push({ type: "COURSE_SELECTION", minCount: 1, courses: codes });
      traces.push({
        master,
        requirement: list[list.length - 1],
        source: `o/v alternatives in the plan, semester/period ${key}`,
      });
    }

    if (parsed.electiveCount && elective.length > 0) {
      const codes = elective.map((r) => r.courseCode).filter((c) => !parsed.consumed.has(c));
      if (codes.length >= parsed.electiveCount) {
        list.push({
          type: "COURSE_SELECTION",
          minCount: parsed.electiveCount,
          courses: codes,
        });
        traces.push({
          master,
          requirement: list[list.length - 1],
          source: `"${parsed.electiveCount} valbara kurser i profilen" over the plan's elective courses`,
        });
      }
    }

    // "av profilens valbara kurser ska minst N hp väljas" cannot be expressed
    // directly, so fold it into the profile total: compulsory credits + N.
    if (parsed.electiveCredits !== undefined) {
      const compulsoryCredits =
        compulsory.reduce((sum, r) => sum + r.credits, 0) +
        [...groups.values()].reduce((sum, codes) => {
          const row = either.find((r) => r.courseCode === codes[0]);
          return sum + (row?.credits ?? 0);
        }, 0);
      const credits = compulsoryCredits + parsed.electiveCredits;
      const alreadyHasTotal = list.some((r) => r.type === "CREDITS_PROFILE_TOTAL");
      if (!alreadyHasTotal) {
        list.push({ type: "CREDITS_PROFILE_TOTAL", credits });
        traces.push({
          master,
          requirement: list[list.length - 1],
          source: `"av dessa ska minst ${parsed.electiveCredits} hp väljas"`,
          approximation: `"minst N hp from a specific course list" is not expressible; emitted as CREDITS_PROFILE_TOTAL = ${compulsoryCredits} hp compulsory + ${parsed.electiveCredits} hp elective`,
        });
      }
    }

    // A rule sentence can appear more than once in the prose (the plan repeats
    // the profile list in several sections), so drop exact duplicates.
    const seen = new Set<string>();
    requirements[master] = list.filter((requirement) => {
      const key = JSON.stringify(requirement);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return { requirements, traces, unmatched };
}
