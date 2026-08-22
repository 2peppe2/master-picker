import type { Course, CourseOccasion } from "../../prisma/json_types";
import type { PlanRow } from "./parseProgramPlan";

export interface CourseAnomaly {
  courseCode: string;
  note: string;
}

/**
 * The English plan page already labels courses c / e / v / c-e, which is the
 * `ecv` vocabulary data/ uses. A course listed under several specialisations can
 * carry different labels; where they disagree the course is elective in
 * practice, since some path through the program lets you skip it.
 */
function resolveEcv(vofs: Set<string>, courseCode: string, anomalies: CourseAnomaly[]): string {
  const values = [...vofs].filter((v) => v !== "");
  if (values.length !== vofs.size) {
    anomalies.push({
      courseCode,
      note: "empty VOF in the plan; defaulted to E (elective)",
    });
  }
  if (values.length === 0) return "E";
  if (values.length === 1) return values[0].toUpperCase().replace("-", "/");
  return "E";
}

const sorted = (values: Iterable<string>) => [...new Set(values)].sort();

export function buildCourses(
  rows: PlanRow[],
  programCode: string,
  keptSpecializations: Set<string>,
): { courses: Course[]; anomalies: CourseAnomaly[] } {
  const anomalies: CourseAnomaly[] = [];
  const byCourse = new Map<string, PlanRow[]>();

  for (const row of rows) {
    const list = byCourse.get(row.courseCode);
    if (list) list.push(row);
    else byCourse.set(row.courseCode, [row]);
  }

  const courses: Course[] = [];

  for (const [code, courseRows] of byCourse) {
    if (!/^[A-Z0-9]{4}\d{2}$/.test(code)) {
      anomalies.push({ courseCode: code, note: "course code has an unexpected shape" });
    }

    // An occasion is a (year, semester) run of periods that recommend the same
    // set of masters. A course can be a profile course in one period and a plain
    // elective in the next, and those are separate occasions in data/.
    const periodGroups = new Map<string, { period: number; rows: PlanRow[] }>();
    for (const row of courseRows) {
      const key = `${row.year}-${row.semester}-${row.period}`;
      const group = periodGroups.get(key);
      if (group) group.rows.push(row);
      else periodGroups.set(key, { period: row.period, rows: [row] });
    }

    const occasionGroups = new Map<string, { rows: PlanRow[]; periods: Map<number, Set<number>> }>();
    for (const { period, rows: periodRows } of periodGroups.values()) {
      const masters = sorted(
        periodRows.map((r) => r.specialization).filter((s) => keptSpecializations.has(s)),
      );
      const key = `${periodRows[0].year}-${periodRows[0].semester}-${masters.join(",")}`;

      const group = occasionGroups.get(key) ?? {
        rows: [] as PlanRow[],
        periods: new Map<number, Set<number>>(),
      };
      group.rows.push(...periodRows);
      const blocks = group.periods.get(period) ?? new Set<number>();
      periodRows.forEach((r) => r.blocks.forEach((b) => blocks.add(b)));
      group.periods.set(period, blocks);
      occasionGroups.set(key, group);
    }

    const occasions: CourseOccasion[] = [...occasionGroups.values()].map((group) => ({
      year: group.rows[0].year,
      // json_types declares this string, but every file in data/ stores the
      // program semester as a number; the file format is authoritative here.
      semester: group.rows[0].semester as unknown as string,
      ht_or_vt: group.rows[0].htOrVt,
      recommended_masters: sorted(
        group.rows.map((r) => r.specialization).filter((s) => keptSpecializations.has(s)),
      ),
      periods: [...group.periods.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([period, blocks]) => ({ period, blocks: [...blocks].sort((a, b) => a - b) })),
    }));
    occasions.sort((a, b) => a.year - b.year || Number(a.semester) - Number(b.semester));

    // The first listing wins: studieinfo links to /kurs/{CODE}/{term} once an
    // occasion exists for that term and to a bare /kurs/{CODE} otherwise.
    const first = courseRows[0];
    courses.push({
      code,
      name: first.name,
      credits: first.credits,
      level: first.level,
      link: first.link,
      ecv: resolveEcv(new Set(courseRows.map((r) => r.vof)), code, anomalies),
      program: [programCode],
      mastersPrograms: sorted(
        courseRows.map((r) => r.specialization).filter((s) => keptSpecializations.has(s)),
      ),
      occasions,
    });
  }

  courses.sort((a, b) => a.code.localeCompare(b.code));
  return { courses, anomalies };
}
