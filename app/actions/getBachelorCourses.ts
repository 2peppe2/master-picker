"use server";
import { prisma } from "@/lib/prisma";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { Semester } from "@/prisma/generated/client/enums";
import { courseWithDetailsArgs } from "../courseNormalizer";
import { cache } from "react";

export const getBachelorCourses = cache(async (program: string, startYear: number) => {
  const firstSixSemesters = Array.from({ length: 6 }, (_, semesterNumber) =>
    relativeSemesterToYearAndSemester(startYear, semesterNumber)
  );

  const semesterFilters = firstSixSemesters.map(({ year, semester }) => ({
    year,
    semester: semester === "HT" ? Semester.HT : Semester.VT,
  }));

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
          OR: semesterFilters,
        },
      },
    },
    ...courseWithDetailsArgs,
  });
  return courses;
});
