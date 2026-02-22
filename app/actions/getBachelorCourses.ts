"use server";
import { prisma } from "@/lib/prisma";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { Semester } from "@/prisma/generated/client/enums";
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
    include: {
      ProgramCourse: {
        include: {
          Program: {
            select: {
              program: true,
              name: true,
              shortname: true,
            },
          },
        },
      },
      CourseOccasion: {
        include: {
          periods: {
            select: {
              period: true,
              blocks: {
                select: {
                  block: true,
                },
              },
            },
          },
          recommendedMasters: {
            select: { master: true, masterProgram: true },
          },
        },
      },
      CourseMaster: true,
      Examination: {
        select: { credits: true, module: true, name: true, scale: true },
      },
    },
  });
  return courses;
});
