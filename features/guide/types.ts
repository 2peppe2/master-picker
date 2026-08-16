import { courseWithDetailsArgs } from "@/common/courseNormalizer";
import type { Prisma } from "@/prisma/generated/client/client";

export type CourseRequirements = Prisma.RequirementGetPayload<{
  select: {
    courseRequirements: {
      select: {
        courses: {
          select: {
            course: typeof courseWithDetailsArgs;
          };
        };
        type: true;
        minCount: true;
      };
    };
  };
}>["courseRequirements"];
