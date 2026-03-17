"use server";

import { getBachelorCourses } from "../actions/getBachelorCourses";
import { courseWithDetailsArgs } from "../courseNormalizer";
import { Prisma } from "@/prisma/generated/client/client";
import { normalizeCourse } from "@/app/courseNormalizer";
import GuideClientPage from "./GuideClientPage";
import type { Master } from "../dashboard/page";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FC } from "react";

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

interface GuidePageProps {
  searchParams: Promise<{
    program?: string;
    year?: string;
    master?: string;
  }>;
}

const GuidePage: FC<GuidePageProps> = async function ({ searchParams }) {
  const { program, year, master } = await searchParams;

  if (!program || !year || !master) {
    redirect("/");
  }

  const programCourse = await prisma.programCourse.findFirst({
    where: {
      program: program,
      startYear: parseInt(year),
    },
    select: { id: true },
  });

  if (!programCourse) {
    redirect("/");
  }

  const masterRequirements = await prisma.requirement.findFirst({
    where: {
      masterProgram: master,
      program,
      programCourseID: programCourse.id,
    },
    select: {
      courseRequirements: {
        select: {
          courses: {
            select: {
              course: courseWithDetailsArgs,
            },
          },
          type: true,
          minCount: true,
        },
      },
    },
  });

  if (!masterRequirements) {
    redirect("/");
  }

  const masters = await prisma.master.findMany({
    where: {
      masterProgram: program,
    },
    select: {
      master: true,
      name: true,
      icon: true,
      style: true,
    },
  });

  const bachelorCourses = await getBachelorCourses(program, parseInt(year));

  return (
    <GuideClientPage
      courseRequirements={masterRequirements.courseRequirements}
      masters={Object.fromEntries(masters.map((m: Master) => [m.master, m]))}
      selectedMaster={master}
      bachelorCourses={bachelorCourses.map(normalizeCourse)}
    />
  );
};

export default GuidePage;
