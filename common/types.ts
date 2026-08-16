import { Prisma } from "@/prisma/generated/client/client";

import { normalizeCourse } from "./courseNormalizer";

export type Course = ReturnType<typeof normalizeCourse>;

export type CourseExamination = Prisma.ExaminationGetPayload<{
  select: {
    credits: true;
    module: true;
    name: true;
    scale: true;
  };
}>;

export type CourseOccasion = Course["CourseOccasion"][number];

export type Master = Prisma.MasterGetPayload<{
  select: {
    master: true;
    name: true;
    icon: true;
    style: true;
  };
}>;

export type CourseRequirement = Prisma.CoursesRequirementGetPayload<{
  select: {
    type: true;
    courses: true;
    minCount: true;
  };
}>;

export type CreditsRequirement = Prisma.CreditRequirementGetPayload<{
  select: {
    type: true;
    credits: true;
  };
}> & {
  current?: number;
};

export type MainFieldRequirement = Prisma.MainFieldRequirementGetPayload<{
  select: {
    type: true;
    credits: true;
    fields: true;
  };
}> & {
  fieldProgress?: Record<string, number>;
};

export type RequirementUnion =
  | CourseRequirement
  | CreditsRequirement
  | MainFieldRequirement;
