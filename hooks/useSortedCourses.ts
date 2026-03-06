import { useSearchParams } from "next/navigation";
import { Course } from "@/app/dashboard/page";
import { useMemo } from "react";

interface UseSortedCoursesArgs {
  courses: Course[];
}

export const useSortedCourses = ({ courses }: UseSortedCoursesArgs) => {
  const searchParams = useSearchParams();
  const master = searchParams.get("master");

  return useMemo(() => {
    const matchMap = new Map(
      courses.map((c) => [
        c.code,
        master ? c.CourseMaster.some((cm) => cm.master === master) : false,
      ]),
    );

    return [...courses].sort((a, b) => {
      const aMatches = matchMap.get(a.code);
      const bMatches = matchMap.get(b.code);

      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;

      return a.name.localeCompare(b.name, "en");
    });
  }, [courses, master]);
};
