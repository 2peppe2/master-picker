import { Prisma } from "@/prisma/generated/client/client";

type courseWithOccasions = Prisma.CourseGetPayload<{
  include: {
        Program: true,
        CourseOccasion: { 
          include: { 
            periods: true , 
            blocks: true 
          },
        } 
      },
    }>;

export type { courseWithOccasions };