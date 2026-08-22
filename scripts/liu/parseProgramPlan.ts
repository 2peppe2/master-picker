import * as cheerio from "cheerio";
import { fetchPage, isNotFound, urls } from "./fetch";

export interface PlanRow {
  courseCode: string;
  /** Course name as printed in the plan (English page gives the English name). */
  name: string;
  /**
   * Absolute course link taken straight from the table. studieinfo emits
   * /kurs/{CODE}/{term} when an occasion exists and a bare /kurs/{CODE} for
   * future years that have none yet - matching what data/ already contains.
   */
  link: string;
  credits: number;
  level: string;
  blocks: number[];
  /** Raw data-vof: "o" | "v" | "f" | "o/v" | "" */
  vof: string;
  /** "" for courses not tied to a specialisation. */
  specialization: string;
  semester: number;
  year: number;
  htOrVt: "HT" | "VT";
  period: number;
}

export interface ProgramPlan {
  code: string;
  planId: number;
  rows: PlanRow[];
  /** specialisation code -> name, in the page's language */
  specializations: Map<string, string>;
  /** main-field id -> name, in the page's language */
  mainFields: Map<string, string>;
  /** Everything before the curriculum tab, tags stripped, whitespace collapsed. */
  prose: string;
}

/** "Termin 7 HT 2027" / "Semester 7 Autumn 2027" */
function parseSemesterHeading(text: string) {
  const semester = text.match(/(?:Termin|Semester)\s+(\d+)/i)?.[1];
  const season = text.match(/\b(HT|VT|Autumn|Spring)\b/i)?.[1];
  const year = text.match(/\b(20\d{2})\b/)?.[1];
  if (!semester || !season || !year) return null;
  const s = season.toUpperCase();
  return {
    semester: Number(semester),
    year: Number(year),
    htOrVt: (s === "HT" || s === "AUTUMN" ? "HT" : "VT") as "HT" | "VT",
  };
}

function parseBlocks(text: string): number[] {
  // Block cells look like "2", "2, 3", "1/2" or "-" when unscheduled.
  return [...text.matchAll(/\d+/g)].map((m) => Number(m[0]));
}

export async function fetchProgramPlan(
  code: string,
  planId: number,
  lang: "sv" | "en",
): Promise<ProgramPlan | null> {
  const html = await fetchPage(urls.programPlan(code, planId, lang));
  if (isNotFound(html)) return null;

  const $ = cheerio.load(html);

  const specializations = new Map<string, string>();
  $("select.specializations-filter option").each((_, el) => {
    const value = $(el).attr("value");
    if (value) specializations.set(value, $(el).text().trim());
  });

  const mainFields = new Map<string, string>();
  $("select.field-of-study-filter option").each((_, el) => {
    const value = $(el).attr("value");
    if (value) mainFields.set(value, $(el).text().trim());
  });

  const rows: PlanRow[] = [];

  $("section.semester").each((_, section) => {
    const heading = parseSemesterHeading($(section).find("h3").first().text());
    if (!heading) return;

    $(section)
      .find("div.specialization")
      .each((_, specDiv) => {
        const specialization = $(specDiv).attr("data-specialization")?.trim() ?? "";

        $(specDiv)
          .find("tbody.period")
          .each((_, tbody) => {
            // The period is announced by a full-width header row inside tbody.
            const periodText = $(tbody).find("tr").first().find("th").first().text();
            const period = Number(periodText.match(/(\d+)/)?.[1] ?? 0);

            $(tbody)
              .find("tr.main-row")
              .each((_, tr) => {
                const courseCode = $(tr).attr("data-course-code")?.trim();
                if (!courseCode) return;
                const cells = $(tr).find("td");
                // Credits carry a "*" marker when the course spans several periods.
                const credits = Number(
                  $(cells[2]).text().trim().replace("*", "").replace(",", "."),
                );

                const href = $(cells[1]).find("a").attr("href") ?? `/kurs/${courseCode}`;

                rows.push({
                  courseCode,
                  name: $(cells[1]).text().trim(),
                  link: new URL(href, "https://studieinfo.liu.se").toString(),
                  credits,
                  level: $(cells[3]).text().trim(),
                  blocks: parseBlocks($(cells[4]).text()),
                  vof: $(tr).attr("data-vof")?.trim().toLowerCase() ?? "",
                  specialization,
                  period,
                  ...heading,
                });
              });
          });
      });
  });

  if (rows.length === 0) {
    throw new Error(`No curriculum rows parsed for ${code}/${planId} (${lang})`);
  }

  // Everything before the curriculum tab is the utbildningsplan prose, which is
  // where the degree requirements and per-profile rules live.
  const prose = cheerio
    .load(html.split('id="curriculum"')[0])("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  return { code, planId, rows, specializations, mainFields, prose };
}
