"use server";

import { courseWithDetailsArgs, normalizeCourse } from "../courseNormalizer";
import { Prisma } from "@/prisma/generated/client/client";
import DashboardClientPage from "./DashboardClientPage";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FC } from "react";

interface DashboardPageProps {
  searchParams: Promise<{
    program?: string;
    year?: string;
    master?: string;
  }>;
}

const DashboardPage: FC<DashboardPageProps> = async ({ searchParams }) => {
  const { program, year } = await searchParams;

  if (!program || !year) {
    redirect("/");
  }

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
    ...courseWithDetailsArgs,
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
    <DashboardClientPage
      courses={courses.map(normalizeCourse)}
      masters={Object.fromEntries(masters.map((m) => [m.master, m]))}
    />
  );
};

export default DashboardPage;

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
