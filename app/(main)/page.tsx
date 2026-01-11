import DndView from "./DndView";
import { prisma } from "@/lib/prisma";
import { courseWithOccasions } from "./types";

export default async function MainPage() {
  const COURSES: courseWithOccasions[] = await prisma.course.findMany({
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
