"use client";

import { getCourseStatistic } from "liu-tentor-package";
import { useQuery } from "@tanstack/react-query";

/** Loads optional external course data for a course code. */
export const useCourseData = (courseCode: string) => {
  return useQuery({
    queryKey: ["courseData", courseCode],
    queryFn: async () => await getCourseStatistic(courseCode),
    staleTime: 1000 * 60 * 60,
    enabled: !!courseCode,
  });
};
