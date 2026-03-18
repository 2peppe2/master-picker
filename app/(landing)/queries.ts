import { Prisma } from "@/prisma/generated/client/client";

export const landingPageProgramSelect = {
  program: true,
  name: true,
  shortname: true,
  programCourses: {
    select: {
      startYear: true,
      requirements: {
        select: {
          masterProgram: true,
          master: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { startYear: "desc" },
  },
} satisfies Prisma.ProgramSelect;
