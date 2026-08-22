import * as cheerio from "cheerio";
import type { CourseDetail } from "../../prisma/json_types";
import { fetchPage, isNotFound, urls } from "./fetch";

/**
 * Course pages are laid out as `<h2>Label</h2>` followed by bare text nodes
 * until the next heading - both in the overview panel and in the syllabus body.
 * Reading label -> following content is stable across both.
 */
function headingValues(html: string): Map<string, string> {
  const $ = cheerio.load(html);
  const values = new Map<string, string>();

  $("h2").each((_, heading) => {
    const label = $(heading).text().replace(/\s+/g, " ").trim();
    if (!label || values.has(label)) return;

    const parts: string[] = [];
    let node = heading.nextSibling;
    while (node) {
      if (node.type === "tag") {
        if (node.name === "h2") break;
        parts.push($(node).text());
      } else if (node.type === "text") {
        parts.push(node.data ?? "");
      }
      node = node.nextSibling;
    }

    const text = parts.join(" ").replace(/\s+/g, " ").trim();
    if (text) values.set(label, text);
  });

  return values;
}

function parseHours(text: string | undefined): number[] {
  if (!text) return [0, 0];
  const numbers = [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*h\b/g)].map((m) =>
    Number(m[1].replace(",", ".")),
  );
  return [numbers[0] ?? 0, numbers[1] ?? 0];
}

function normaliseScale(text: string): string | undefined {
  const compact = text.replace(/\s/g, "").toUpperCase();
  if (compact.includes("3,4,5") || compact.includes("3/4/5")) return "U_THREE_FOUR_FIVE";
  if (compact.includes("U,G") || compact.includes("U/G")) return "G_OR_U";
  return undefined;
}

/**
 * The Kod / Benämning / Omfattning / Betygsskala table appears twice (the
 * "Examinationsmoment" tab and the syllabus body) with identical content, so
 * the first occurrence of each module wins.
 */
function parseExaminations(html: string): CourseDetail["examinations"] {
  const $ = cheerio.load(html);
  const examinations: CourseDetail["examinations"] = [];
  const seen = new Set<string>();

  $("table").each((_, table) => {
    const headers = $(table)
      .find("th")
      .map((_, th) => $(th).text().trim().toLowerCase())
      .get();
    const isExamTable =
      headers.some((h) => h === "kod" || h === "code") &&
      headers.some((h) => h.startsWith("betygsskala") || h.startsWith("grading"));
    if (!isExamTable) return;

    $(table)
      .find("tr")
      .each((_, tr) => {
        const cells = $(tr)
          .find("td")
          .map((_, td) => $(td).text().replace(/\s+/g, " ").trim())
          .get();
        if (cells.length < 4) return;
        const [module, name, creditsText, scaleText] = cells;
        if (!/^[A-Z]{3,4}\d*$/.test(module) || seen.has(module)) return;
        seen.add(module);
        examinations.push({
          module,
          name,
          credits: Number(creditsText.replace(/[^\d.,]/g, "").replace(",", ".")) || 0,
          scale: normaliseScale(scaleText),
        });
      });
  });

  return examinations;
}

/**
 * data/ mixes languages here exactly as studieinfo does: names, main fields and
 * examination names are English, while `department` is the Swedish institution
 * name (that is what the seed's `field_*`/`exam_*` key mapping expects).
 */
export async function fetchCourseDetail(
  courseCode: string,
  term: string,
): Promise<CourseDetail | null> {
  const [en, sv] = await Promise.all([
    fetchPage(urls.course(courseCode, term, "en")),
    fetchPage(urls.course(courseCode, term, "sv")),
  ]);
  if (isNotFound(en) || isNotFound(sv)) return null;

  const enValues = headingValues(en);
  const svValues = headingValues(sv);

  const pick = (values: Map<string, string>, ...labels: string[]) => {
    for (const label of labels) {
      const value = values.get(label);
      if (value) return value;
    }
    return "";
  };

  const mainField = pick(enValues, "Main field of study", "Huvudområde");
  const prerequisites = pick(enValues, "Recommended prerequisites", "Prerequisites");

  return {
    examiner: pick(enValues, "Examiner", "Examinator"),
    department: pick(svValues, "Institution"),
    // data/ stores null rather than "" when a course lists no prerequisites.
    prerequisites: (prerequisites || null) as unknown as string,
    main_field: mainField
      ? mainField
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      : [],
    education_components: parseHours(pick(enValues, "Education components", "Undervisningstid")),
    examinations: parseExaminations(en),
  };
}

/**
 * The plan links to /kurs/{CODE}/{term} when an occasion exists for that term
 * and to a bare /kurs/{CODE} for future years that have none scheduled yet.
 */
export function termFromLink(link: string): string | null {
  return link.match(/\/kurs\/[^/]+\/((?:ht|vt)-\d{4})/i)?.[1]?.toLowerCase() ?? null;
}

/**
 * Terms to try when the plan gives no usable term. The plan links to the term
 * the course is scheduled in, which for late program years is in the future and
 * has no syllabus published yet, so fall back to the most recent real terms.
 */
export function candidateTerms(link: string): string[] {
  const now = new Date().getFullYear();
  const terms: string[] = [];
  for (let year = now; year >= now - 2; year--) terms.push(`ht-${year}`, `vt-${year}`);

  const fromLink = termFromLink(link);
  const linkYear = fromLink ? Number(fromLink.slice(3)) : 0;
  // Only trust the plan's term when the syllabus can already exist.
  if (fromLink && linkYear <= now + 1) terms.unshift(fromLink);

  return [...new Set(terms)];
}
