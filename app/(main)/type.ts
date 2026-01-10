import { Prisma } from "@/prisma/generated/client/client";

type courseWithOccasions = Prisma.CourseGetPayload<{
  include: {
        Program: true,
        CourseOccasion: { 
          include: { 
            periods: {select: { period: true }}, 
            blocks: { select: { block: true }} 
          },
        },
        CourseMaster: true, 
      },
    }>;

export type { courseWithOccasions };