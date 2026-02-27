import { useSearchParams } from "next/navigation";
import { Course } from "@/app/dashboard/page";
import { useMemo } from "react";

interface UseSortedCoursesArgs {
  courses: Course[];
}

export const useSortedCourses = ({ courses }: UseSortedCoursesArgs) => {
  const searchParams = useSearchParams();
  const master = searchParams.get("master") ?? undefined;

  return useMemo(() => {
    return [...courses].sort((a, b) => {
      const aMatchesMaster = a.CourseMaster.some((cm) => cm.master === master);
      const bMatchesMaster = b.CourseMaster.some((cm) => cm.master === master);

      if (aMatchesMaster && !bMatchesMaster) return -1;
      if (!aMatchesMaster && bMatchesMaster) return 1;

      return a.name.localeCompare(b.name);
    });
  }, [courses, master]);
};
