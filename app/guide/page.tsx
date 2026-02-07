import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/client/client";
import GuideClientPage from "./GuideClientPage";
import type { Master } from "../dashboard/page";

export type CourseRequirements = Prisma.RequirementGetPayload<{
  select: {
    courseRequirements: {
      select: {
        courses: {
          select: {
            course: {
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
                CourseMaster: true;
                Examination: {
                  select: {
                    credits: true;
                    module: true;
                    name: true;
                    scale: true;
                  };
                };
              };
            };
          };
        };
        type: true;
      };
    };
  };
}>["courseRequirements"];



const GuidePage = async function ({
  searchParams,
}: {
  searchParams: Promise<{
    program?: string ;
    year?: string;
    master?: string;
  }>;
}) {
  const { program, year, master } = await searchParams;

  if (!program || !year || !master) {
    return <div>Missing parameters</div>;
  }

  const masterRequirements = await prisma.requirement.findFirst({
    where: {
      masterProgram: master,
    },
    select: {
      courseRequirements: {
        select: {
          courses: {
            select: {
              course: {
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
                      recommendedMaster: { select: { master: true } },
                    },
                  },
                  CourseMaster: true,
                  Examination: {
                    select: {
                      credits: true,
                      module: true,
                      name: true,
                      scale: true,
                    },
                  },
                },
              },
            },
          },
          type: true,
        },
      },
    },
  });
  if (!masterRequirements) {
    return <div>No requirements found</div>;
  }

  const masters = await prisma.master.findMany({
    select: {
      master: true,
      name: true,
      icon: true,
      style: true,
    },
  });

  return (
    <GuideClientPage
      courseRequirements={masterRequirements.courseRequirements}
      masters={Object.fromEntries(
        masters.map((m: Master) => [m.master, m]),
      )}
      selectedMaster={master}
    />
  );
};

export default GuidePage;
