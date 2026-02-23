"use server";

import { Prisma } from "@/prisma/generated/client/client";
import { prisma } from "@/lib/prisma";
import ClientPage from "./ClientPage";
import { normalizeCourse } from "../courseNormalizer"
import { getProgramId } from "../actions/getProgramId";

export default async function MainPage({
  searchParams,
}: {
  searchParams: Promise<{
    program?: string;
    year?: string;
    master?: string;
  }>;
}) {
  const { program, year } = await searchParams;
  if (!program || !year) {
    return "redirecting";
  }
  const programId = await getProgramId(program, parseInt(year, 10));
  const startYear = year ? Number(year) : undefined;
  const hasValidYear = startYear !== undefined && !Number.isNaN(startYear);
  const courseWhere =
    program && hasValidYear
      ? {
          ProgramCourse: {
            program,
            startYear,
          },
        }
      : undefined;
  const courses = await prisma.course.findMany({
    where: courseWhere,
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

  const masters = await prisma.master.findMany({
    select: {
      master: true,
      name: true,
      icon: true,
      style: true,
    },
    where: {
      masterProgram: program,
    },
  });
  
  return (
    <ClientPage
      courses={courses.map(normalizeCourse)}
      masters={Object.fromEntries(masters.map((m) => [m.master, m]))}
      program={program}
      startingYear={startYear!} 
      programId={programId}
    />
  );
}


export type Course = ReturnType<typeof normalizeCourse>;

export type CourseExamination = Prisma.ExaminationGetPayload<{
  select: {
    credits: true;
    module: true;
    name: true;
    scale: true;
  };
}>;

export type CourseOccasion = Course["CourseOccasion"][0];

export type Master = Prisma.MasterGetPayload<{
  select: {
    master: true;
    name: true;
    icon: true;
    style: true;
  };
}>;

export type CourseRequirements = Prisma.CoursesRequirementGetPayload<{
  select: {
    type: true;
    courses: true;
  };
}>;

export type CreditsRequirements = Prisma.CreditRequirementGetPayload<{
  select: {
    type: true;
    credits: true;
  };
}>;

export type RequirementsUnion = CourseRequirements | CreditsRequirements;
