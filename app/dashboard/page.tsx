"use server";

import {
  courseWithDetailsArgs,
  normalizeCourse,
} from "@/common/courseNormalizer";
import DashboardClientPage from "@/features/dashboard/DashboardClientPage";
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
