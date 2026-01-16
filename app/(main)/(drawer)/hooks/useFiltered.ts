import { useAtomValue } from "jotai";
import { filterAtom } from "@/app/atoms/FilterAtom";
import { Course } from "../../page";
import { useScheduleStore } from "@/app/atoms/scheduleStore";
import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";

const useFiltered = (courses: Course[]) => {
  const filters = useAtomValue(filterAtom);
  const { state: { schedules } } = useScheduleStore();
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const filteredCourses = Object.values(courses).filter((course) => {
    // Filter by search term
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      if (
        !course.name.toLowerCase().includes(searchTerm) &&
        !course.code.toLowerCase().includes(searchTerm)
      ) {
        return false;
      }
    }
    return true; // TEMPORARY OVERRIDE

    const relativeSemester = yearAndSemesterToRelativeSemester(
      startingYear,
      course.CourseOccasion[0].year,
      course.CourseOccasion[0].semester
    );

    if (!filters.semester.includes(relativeSemester + 1)) {
      return false;
    }

    // Period filter (assuming course.period is an array like [1,2])
    const periodMatch = course.CourseOccasion.map(
      (occasion) => occasion.periods.map((p) => p - 1).some((p) => filters.period[p])
    ).some((match) => match);

    if (!periodMatch ||
      course.CourseOccasion.map(occasion => occasion.periods.length === 0).some(isEmpty => isEmpty)) {
      return false;
    }

    const blockMatch = course.CourseOccasion.map(
      (occasion) => occasion.blocks.map((b) => b - 1).some((b) => filters.block[b])
    ).some((match) => match);

    if (!blockMatch ||
      course.CourseOccasion.map(occasion => occasion.blocks.length === 0).some(isEmpty => isEmpty)) {
      return false;
    }


    if (filters.masterProfile) {
      if (filters.masterProfile === "all") {
        return true;
      }
      course.CourseMaster.map((master) => {
        if (!master.master.includes(filters.masterProfile!)) {
          return false;
        }
      });
    }
    if (filters.showOnlyApplicable) {
      const masterMatch = course.CourseOccasion.map((occasion) => {
        occasion.periods.map((period) => {
          occasion.blocks.map((block) => {
            const relativeYear = yearAndSemesterToRelativeSemester(startingYear, occasion.year, occasion.semester);
            const slot = schedules[relativeYear][period - 1][block - 1];
            if (slot) {
              return true;
            }
          });
        });
      }).some((match) => match);

      if (!masterMatch) {
        return false;
      }
    }

    return true;
  });
  return filteredCourses;
};

export default useFiltered;
