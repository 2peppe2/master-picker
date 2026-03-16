"use server";

import { RequirementUnion } from "../dashboard/page";
import { prisma } from "@/lib/prisma";

export async function getMasters() {
  const masters = await prisma.master.findMany();
  return masters;
}

export async function getMastersWithRequirements(
  year: number,
  program: string,
) {
  const programCourse = await prisma.programCourse.findFirst({
    where: {
      program: program,
      startYear: year,
    },
    select: { id: true },
  });

  if (!programCourse) return [];

  const masters = await prisma.master.findMany({
    where: {
      masterProgram: program,
      requirements: {
        some: {
          programCourseID: programCourse.id,
        },
      },
    },
    include: {
      requirements: {
        where: {
          programCourseID: programCourse.id,
        },
        include: {
          creditRequirements: { select: { credits: true, type: true } },
          courseRequirements: {
            select: { courses: true, type: true, minCount: true },
          },
          mainFieldRequirements: {
            select: { credits: true, type: true, fields: true },
          },
        },
      },
    },
  });

  return masters.map((master) => ({
    ...master,
    requirements: master.requirements.map((requirement) => {
      const requirements: RequirementUnion[] = [];

      requirement.courseRequirements.forEach((req) => requirements.push(req));

      requirement.creditRequirements.forEach((req) => {
        requirements.push(req);
      });

      requirement.mainFieldRequirements.forEach((req) => {
        requirements.push(req);
      });

      return {
        requirements,
        masterProgram: requirement.masterProgram,
        id: requirement.id,
      };
    }),
  }));
}

export type MastersWithRequirements = Awaited<
  ReturnType<typeof getMastersWithRequirements>
>;

export type MasterRequirement = MastersWithRequirements[0]["requirements"][0];
