"use client";

import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { Course } from "@/app/dashboard/page";
import { useCallback } from "react";

export interface CourseCollision {
  course1: Course;
  course2: Course;
  periodIndex: number;
  blockIndex: number;
  semesterIndex: number;
}

export const useCourseCollisions = () => {
  const yearAndSemesterToRelativeSemester = useToRelativeSemester();

  return useCallback(
    (courses: Course[]) => {
      // Create a map to track which course occupies each block
      // Map key: `${semesterIndex}-${periodIndex}-${blockIndex}`
      const blockMap = new Map<string, Course>();
      const collisions: CourseCollision[] = [];

      courses.forEach((course) => {
        const selectedIndex = (course as any).selectedOccasionIndex ?? 0;
        const occasion = course.CourseOccasion?.[selectedIndex];

        if (!occasion || !occasion.periods) return;

        const semesterIndex = yearAndSemesterToRelativeSemester({
          year: occasion.year,
          semester: occasion.semester,
        });

        // Ignore courses from the first 3 years (Semesters 1-6, indices 0-5)
        if (semesterIndex < 6 || semesterIndex >= 10) return;

        for (const period of occasion.periods) {
          if (period.period < 1) continue;

          const periodIndex = period.period - 1;
          const isWildcardCourse = period.blocks.length === 0;

          if (isWildcardCourse) continue;

          for (const block of period.blocks) {
            const blockIndex = block - 1;
            const blockKey = `${semesterIndex}-${periodIndex}-${blockIndex}`;
            
            const existingCourse = blockMap.get(blockKey);
            if (existingCourse) {
              // Same course might be parsed oddly, only report if different courses
              if (existingCourse.code !== course.code) {
                collisions.push({
                  course1: existingCourse,
                  course2: course,
                  periodIndex,
                  blockIndex,
                  semesterIndex,
                });
              }
            } else {
              blockMap.set(blockKey, course);
            }
          }
        }
      });

      return collisions;
    },
    [yearAndSemesterToRelativeSemester],
  );
};
