import { useAtomValue } from "jotai";
import { filterAtom } from "@/app/atoms/FilterAtom";
import { Course } from "../../page";

const useFiltered = (courses: Course[]) => {
  const filters = useAtomValue(filterAtom);
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
    /* TEMPORARILY DISABLED
        // Semester filter
        if (!filters.semester[course.semester - 7]) {
            return false;
        }

        // Period filter (assuming course.period is an array like [1,2])
        const periodMatch = course.CourseOccasion.periods .some(
            (p) => filters.period[p - 1]
        );
        if (!periodMatch) {
            return false;
        }

        // Block filter
        if (!filters.block[course.block - 1]) {
            return false;
        }

        if (filters.masterProfile) {
            if( filters.masterProfile === "all") {
                return true;
            }
            if (!course.mastersPrograms.includes(filters.masterProfile)) {
                return false;
            }
        }
        if (filters.showOnlyApplicable) {
            const slot = semester[course.semester - 7][course.period[0] - 1][course.block - 1];
            if (slot) {
                return false;
            }
        }
            */

    return true;
  });
  return filteredCourses;
};

export default useFiltered;
