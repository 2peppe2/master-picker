import { Prisma } from "@/prisma/generated/client/client";
import { prisma } from "@/lib/prisma";
import DndView from "./DndView";

export default async function MainPage() {
  const COURSES = await prisma.course.findMany({
    include: {
      Program: true,
      CourseOccasion: {
        include: {
          periods: {
            select: {
              period: true,
            },
          },
          blocks: {
            select: {
              block: true,
            },
          },
        },
      },
      CourseMaster: true,
    },
  });

  return <DndView courses={COURSES.map(normalizeCourse)} />;
}

type CourseWithOccasion = Prisma.CourseGetPayload<{
  include: {
    Program: true;
    CourseOccasion: {
      include: {
        periods: { select: { period: true } };
        blocks: { select: { block: true } };
      };
    };
    CourseMaster: true;
  };
}>;

const normalizeCourse = (course: CourseWithOccasion) => ({
  ...course,
  CourseOccasion: course.CourseOccasion.map((occasion) => ({
    ...occasion,
    periods: occasion.periods.map((p) => p.period),
    blocks: occasion.blocks.map((b) => b.block),
  })),
});

export type Course = ReturnType<typeof normalizeCourse>;

export type CourseOccasion = Course["CourseOccasion"][0];
