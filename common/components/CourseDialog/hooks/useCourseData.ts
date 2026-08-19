"use client";

import { getCourseStatistic } from "liu-tentor-package";
import { useQuery } from "@tanstack/react-query";

export const useCourseData = (courseCode: string) => {
  return useQuery({
    queryKey: ["courseData", courseCode],
    queryFn: async () => await getCourseStatistic(courseCode),
    staleTime: 1000 * 60 * 60,
    enabled: !!courseCode,
  });
};
