"use server";

import { Prisma } from "@/prisma/generated/client/client";
import { prisma } from "@/lib/prisma";
import ClientPage from "./ClientPage";

export default async function MainPage() {
  const courses = await prisma.course.findMany({
    include: {
      Program: true,
      CourseOccasion: {
        include: {
          periods: {
            select: {
              period: true,
              blocks: {
                select: {
                  block: true
                }
              }
            }
          },
          recommendedMaster: { select: { master: true }},
        }
      },
      CourseMaster: true,
      Examination: { select: { credits: true, module: true, name: true, scale: true } },

    },
  });

  const masters = await prisma.master.findMany({
    select: {
      master: true,
      name: true,
      icon: true,
      style: true,
    },
  });

  return (
    <ClientPage
      courses={courses.map(normalizeCourse)}
      masters={Object.fromEntries(masters.map((m) => [m.master, m]))}
    />
  );
}

type CourseWithOccasion = Prisma.CourseGetPayload<{
  include: {
    Program: true;
    CourseOccasion: {
      include: {
        periods: {
          select: {
            period: true
            blocks: {
              select: {
                block: true
              }
            }
          };
        }
        recommendedMaster: { select: { master: true }}
      };
      

    };
    Examination: { select: { credits: true, module: true, name: true, scale: true } };
    CourseMaster: true;
  };
}>;

const normalizeCourse = (course: CourseWithOccasion) => ({
  ...course,
  CourseOccasion: course.CourseOccasion.map((occasion) => ({
    ...occasion,
    periods: occasion.periods.map((p) => ({
      period: p.period,
      blocks: p.blocks.map((b) => b.block),
    })),
  })),
});

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
