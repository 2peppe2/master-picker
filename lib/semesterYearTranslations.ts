export const relativeSemesterToYear = (
  startingYear: number,
  semesterNumber: number,
): number => {
  return startingYear + Math.floor(semesterNumber / 2 + 0.5);
};

export type YearAndSemester = {
  year: number;
  semester: "HT" | "VT";
};

export const relativeSemesterToYearAndSemester = (
  startingYear: number,
  semesterNumber: number,
): YearAndSemester => {
  const year = relativeSemesterToYear(startingYear, semesterNumber);
  const ht_or_vt = semesterNumber % 2 === 0 ? "HT" : "VT";
  return { year: year, semester: ht_or_vt };
};
