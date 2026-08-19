"use client";

import CourseResultGrid from "./CourseResultGrid";
import { useFiltered } from "@/features/dashboard/state/filter/hooks/useFiltered";
import { draggedCourseAtom } from "@/features/dashboard/state/drag/atoms";
import { scheduledCourseCodesAtom } from "@/features/dashboard/state/schedule/atoms";
import { courseListAtom } from "@/features/dashboard/state/catalog-data/atoms";
import { useSortedCourses } from "@/common/hooks/useSortedCourses";
import { useAtomValue } from "jotai";
import { FC, memo, useMemo } from "react";

const CourseResults: FC = () => {
  const courses = useAtomValue(courseListAtom);
  const draggedCourse = useAtomValue(draggedCourseAtom);
  const scheduledCourseCodes = useAtomValue(scheduledCourseCodesAtom);
  const filteredCourses = useFiltered({ courses });
  const sortedCourses = useSortedCourses({ courses: filteredCourses });

  const availableCourses = useMemo(
    () =>
      sortedCourses.filter((course) => !scheduledCourseCodes.has(course.code)),
    [scheduledCourseCodes, sortedCourses],
  );

  return (
    <CourseResultGrid
      courses={availableCourses}
      draggedCourseCode={draggedCourse?.code}
    />
  );
};

export default memo(CourseResults);
