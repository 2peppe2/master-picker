"use server";

import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { courseWithDetailsArgs } from "@/common/courseNormalizer";
import { Semester } from "@/prisma/generated/client/enums";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getBachelorCourses = cache(
  async (program: string, startYear: number) => {
    const firstSixSemesters = Array.from({ length: 6 }, (_, semesterNumber) =>
      relativeSemesterToYearAndSemester(startYear, semesterNumber),
    );

    const semesterFilters = firstSixSemesters.map(({ year, semester }) => ({
      year,
      semester: semester === "HT" ? Semester.HT : Semester.VT,
    }));
    const courseOccasionFilter = { OR: semesterFilters };

    const courses = await prisma.course.findMany({
      where: {
        ecv: {
          contains: "C",
        },
        ProgramCourse: {
          program,
          startYear,
        },
        CourseOccasion: {
          some: {
            ...courseOccasionFilter,
          },
        },
      },
      include: {
        ...courseWithDetailsArgs.include,
        CourseOccasion: {
          ...courseWithDetailsArgs.include.CourseOccasion,
          where: courseOccasionFilter,
          orderBy: [{ year: "asc" }, { semester: "asc" }],
        },
      },
    });

    return courses.map((course) => ({
      ...course,
      CourseOccasion: [...course.CourseOccasion].sort(
        (left, right) =>
          left.year - right.year ||
          (left.semester === right.semester
            ? 0
            : left.semester === Semester.VT
              ? -1
              : 1),
      ),
    }));
  },
);
