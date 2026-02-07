import { Prisma } from "@/prisma/generated/client/client";

type CourseWithOccasion = Prisma.CourseGetPayload<{
  include: {
    ProgramCourse: {
      include: {
        Program: {
          select: {
            program: true;
            name: true;
            shortname: true;
          };
        };
      };
    };
    CourseOccasion: {
      include: {
        periods: {
          select: {
            period: true;
            blocks: {
              select: {
                block: true;
              };
            };
          };
        };
        recommendedMaster: { select: { master: true } };
      };
    };
    Examination: {
      select: { credits: true; module: true; name: true; scale: true };
    };
    CourseMaster: true;
  };
}>;

export const normalizeCourse = (course: CourseWithOccasion) => ({
  ...course,
  CourseOccasion: course.CourseOccasion.map((occasion) => ({
    ...occasion,
    periods: occasion.periods.map((p) => ({
      period: p.period,
      blocks: p.blocks.map((b) => b.block),
    })),
  })),
});