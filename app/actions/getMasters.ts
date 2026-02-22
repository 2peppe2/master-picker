"use server";
import { prisma } from "@/lib/prisma";
import { RequirementsUnion } from "../dashboard/page";

export async function getMasters() {
  const masters = await prisma.master.findMany();
  return masters;
}

export async function getMastersWithRequirements(program?: string) {
  const masters = await prisma.master.findMany({
    where: program ? { masterProgram: program } : undefined,
    include: {
      requirements: {
        include: {
          creditRequirements: { select: { credits: true, type: true } },
          courseRequirements: { select: { courses: true, type: true } },
        },
      },
    },
  });

  return masters.map((master) => ({
    ...master,
    requirements: master.requirements.map((requirement) => {
      const requirements: RequirementsUnion[] = [];

      requirement.courseRequirements.forEach((requirement) =>
        requirements.push(requirement)
      );

      requirement.creditRequirements.forEach((requirement) => {
        requirements.push(requirement);
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
