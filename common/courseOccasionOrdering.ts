export interface OccasionSemester {
  year: number;
  semester: "HT" | "VT";
}

interface SortCourseOccasionsArgs<T extends OccasionSemester> {
  occasions: readonly T[];
  preferredSemesters: readonly number[];
  toRelativeSemester: (occasion: OccasionSemester) => number;
}

export const sortCourseOccasionsByPreferredSemesters = <
  T extends OccasionSemester,
>({
  occasions,
  preferredSemesters,
  toRelativeSemester,
}: SortCourseOccasionsArgs<T>): T[] => {
  if (preferredSemesters.length === 0) return [...occasions];

  const getPreferenceRank = (occasion: T) => {
    try {
      const semester = toRelativeSemester(occasion) + 1;
      const rank = preferredSemesters.indexOf(semester);
      return rank === -1 ? Number.POSITIVE_INFINITY : rank;
    } catch {
      return Number.POSITIVE_INFINITY;
    }
  };

  return occasions
    .map((occasion, index) => ({
      occasion,
      index,
      rank: getPreferenceRank(occasion),
    }))
    .sort((left, right) => left.rank - right.rank || left.index - right.index)
    .map(({ occasion }) => occasion);
};
