import { Prisma } from "@/prisma/generated/client/client";

export const courseWithDetailsArgs = {
  include: {
    ProgramCourse: {
      include: {
        Program: {
          select: {
            program: true,
            name: true,
            shortname: true,
          },
        },
      },
    },
    CourseOccasion: {
      include: {
        periods: {
          select: {
            period: true,
            blocks: {
              select: {
                block: true,
              },
            },
          },
        },
        recommendedMasters: {
          select: { master: true, masterProgram: true },
        },
      },
    },
    Examination: {
      select: { credits: true, module: true, name: true, scale: true },
    },
    CourseMaster: true,
  },
} satisfies Prisma.CourseDefaultArgs;

type CourseWithOccasion = Prisma.CourseGetPayload<
  typeof courseWithDetailsArgs
>;

export const normalizeCourse = (course: CourseWithOccasion) => ({
  ...course,
  department: course.department ?? "",
  mainField: Array.isArray(course.mainField) ? course.mainField : [],
  CourseOccasion: course.CourseOccasion.map(
    ({ recommendedMasters, ...occasion }) => ({
      ...occasion,
      recommendedMaster: recommendedMasters.map((master) => ({
        master: master.master,
        masterProgram: master.masterProgram,
      })),
      periods: occasion.periods.map((p) => ({
        period: p.period,
        blocks: p.blocks.map((b) => b.block),
      })),
    }),
  ),
});
