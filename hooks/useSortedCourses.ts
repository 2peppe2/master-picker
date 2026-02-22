import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { useSearchParams } from "next/navigation";
import { Course } from "@/app/dashboard/page";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

interface UseSortedCoursesArgs {
  courses: Course[];
}

export const useSortedCourses = ({ courses }: UseSortedCoursesArgs) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const shownSemesters = useAtomValue(scheduleAtoms.shownSemestersAtom);
  const searchParams = useSearchParams();
  const master = searchParams.get("master") ?? undefined;

  return useMemo(() => {
    return [...courses].sort((a, b) => {
      const aMatchesMaster = a.CourseMaster.some((cm) => cm.master === master);
      const bMatchesMaster = b.CourseMaster.some((cm) => cm.master === master);

      if (aMatchesMaster && !bMatchesMaster) return -1;
      if (!aMatchesMaster && bMatchesMaster) return 1;

      const aInOpenSemester = a.CourseOccasion.some((oc) => {
        const relativeSemester = yearAndSemesterToRelativeSemester(
          startingYear,
          oc.year,
          oc.semester,
        );
        return shownSemesters.has(relativeSemester);
      });

      const bInOpenSemester = b.CourseOccasion.some((oc) => {
        const relativeSemester = yearAndSemesterToRelativeSemester(
          startingYear,
          oc.year,
          oc.semester,
        );
        return shownSemesters.has(relativeSemester);
      });

      if (aInOpenSemester && !bInOpenSemester) return -1;
      if (!aInOpenSemester && bInOpenSemester) return 1;

      return a.name.localeCompare(b.name);
    });
  }, [courses, master, shownSemesters, startingYear]);
};
