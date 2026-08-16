import { range } from "lodash";

export type AcademicTerm = "HT" | "VT";

export interface CurrentTermTargetArgs {
  startingYear: number;
  visibleSemesters: number[];
  today?: Date;
}

export const getCurrentAcademicTerm = (today = new Date()) => {
  const year = today.getFullYear();
  const isAutumnTerm =
    today.getMonth() > 5 || (today.getMonth() === 5 && today.getDate() >= 15);

  return {
    year,
    semester: isAutumnTerm ? ("HT" as const) : ("VT" as const),
  };
};

export const getCurrentTermSemester = ({
  startingYear,
  visibleSemesters,
  today,
}: CurrentTermTargetArgs) => {
  const { year, semester } = getCurrentAcademicTerm(today);
  const relativeSemester =
    (year - startingYear) * 2 + (semester === "HT" ? 0 : -1);

  if (visibleSemesters.length === 0) return relativeSemester;

  return visibleSemesters.reduce((closest, semester) =>
    Math.abs(semester - relativeSemester) < Math.abs(closest - relativeSemester)
      ? semester
      : closest,
  );
};

export const getVisibleSemesters = (
  showBachelorYears: boolean,
  masterPeriod: { start: number; end: number },
) =>
  showBachelorYears
    ? range(0, 10)
    : range(masterPeriod.start - 1, masterPeriod.end);
