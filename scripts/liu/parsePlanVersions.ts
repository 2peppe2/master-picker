import * as cheerio from "cheerio";
import { fetchPage, urls } from "./fetch";
import type { ProgramSpec } from "./programs";

export interface PlanVersion {
  planId: number;
  year: number;
  /** Only the two campuses studieinfo actually names; null when it names none. */
  campus: "Linköping" | "Norrköping" | null;
  /** The raw option text, used to pick a language variant. */
  label: string;
}

const CAMPUSES = ["Linköping", "Norrköping"] as const;

/** "HT 2026, Norrköping, Civilingenjör i ..." -> "Norrköping". */
function parseCampus(label: string): PlanVersion["campus"] {
  const parts = label.split(",").map((p) => p.trim());
  return CAMPUSES.find((campus) => parts.includes(campus)) ?? null;
}

/**
 * The version dropdown on /program/{CODE} lists every published plan revision:
 *
 *   <select id="related_entity_navigation">
 *     <option value="/program/6CDDD/6298">HT 2026, Linköping, ...</option>
 *     <option value="/program/6CDDD/6016">HT 2025, Linköping, ...</option>
 *
 * The numeric id in that path is the `programCourseID` used throughout data/
 * and the Prisma schema (6CDDD/5723 is the 2024 intake, id 5723).
 *
 * A year usually has one revision, but the international programs publish one
 * per language variant ("... - internationell, japanska"), so this returns every
 * revision per year, newest first, and `pickVersion` chooses among them.
 */
export async function fetchPlanVersions(code: string): Promise<Map<number, PlanVersion[]>> {
  const html = await fetchPage(urls.programLatest(code));
  const $ = cheerio.load(html);
  const versions = new Map<number, PlanVersion[]>();

  $("#related_entity_navigation option").each((_, el) => {
    const value = $(el).attr("value") ?? "";
    const label = $(el).text().trim();
    const planId = value.match(/\/program\/[^/]+\/(\d+)/)?.[1];
    const year = label.match(/(?:HT|VT|Autumn|Spring)\s+(\d{4})/)?.[1];
    if (!planId || !year) return;
    // Options are newest-first, and each year's list keeps that order.
    const entry: PlanVersion = {
      planId: Number(planId),
      year: Number(year),
      campus: parseCampus(label),
      label,
    };
    const forYear = versions.get(entry.year);
    if (forYear) forYear.push(entry);
    else versions.set(entry.year, [entry]);
  });

  if (versions.size === 0) {
    throw new Error(`No plan versions found for ${code} - page layout may have changed`);
  }
  return versions;
}

/**
 * The revision a given program spec wants out of one year's list: the language
 * variant it names, or the latest revision when it names none.
 */
export function pickVersion(
  versions: Map<number, PlanVersion[]>,
  program: ProgramSpec,
  year: number,
): PlanVersion | undefined {
  const forYear = versions.get(year) ?? [];
  if (!program.planLabel) return forYear[0];
  return forYear.find((version) => program.planLabel!.test(version.label));
}
