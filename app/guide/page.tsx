import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/client/client";
import GuideClientPage from "./GuideClientPage";
import type { Master } from "../dashboard/page";
import { getBachelorCourses } from "../actions/getBachelorCourses";
import { courseWithDetailsArgs, normalizeCourse } from "../courseNormalizer";
import { getProgramId } from "../actions/getProgramId";

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

const GuidePage = async function ({
  searchParams,
}: {
  searchParams: Promise<{
    program?: string;
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
      program,
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
    return <div>No requirements found</div>;
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

  const programId = await getProgramId(program, parseInt(year, 10));

  return (
    <GuideClientPage
      programId={programId}
      year={parseInt(year)}
      courseRequirements={masterRequirements.courseRequirements}
      masters={Object.fromEntries(masters.map((m: Master) => [m.master, m]))}
      selectedMaster={master}
      bachelorCourses={bachelorCourses.map(normalizeCourse)}
    />
  );
};

export default GuidePage;
