export const relativeSemesterToYear = (startingYear: number, semesterNumber: number): number => {
    return startingYear + Math.floor((semesterNumber / 2) + 0.5)
}

export type YearAndSemester = {
    year: number;
    semester: "HT" | "VT";
}

export const relativeSemesterToYearAndSemester = (startingYear: number, semesterNumber: number): YearAndSemester => {
    const year = relativeSemesterToYear(startingYear, semesterNumber);
    const ht_or_vt = semesterNumber % 2 === 0 ? "HT" : "VT";
    return { year: year, semester: ht_or_vt };
}


export const yearAndSemesterToRelativeSemester = (
  startingYear: number,
  year: number,
  semester: "HT" | "VT"
): number => {
  const yearDiff = year - startingYear;
  if (yearDiff < 0) {
    throw new Error("year must be >= startingYear");
  }

  return semester === "HT"
    ? yearDiff * 2
    : yearDiff * 2 - 1;
};