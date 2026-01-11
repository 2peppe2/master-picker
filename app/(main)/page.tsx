import DndView from "./DndView";
import { prisma } from "@/lib/prisma";
import { CourseWithOccasion } from "./types";

export default async function MainPage() {
  const COURSES: CourseWithOccasion[] = await prisma.course.findMany({
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

  return <DndView courses={COURSES} />;
}
