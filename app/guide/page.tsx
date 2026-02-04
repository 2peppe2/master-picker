import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/client/client";
import GuideClientPage from "./GuideClientPage";

export type CourseRequirements = Prisma.RequirementGetPayload<{
  select: {
    courseRequirements: {
      select: {
        courses: {
          select: {
            course: true,
          };
        };
      };
    };
  };
}>["courseRequirements"];
  

const GuidePage = async function ({
  searchParams,
}: {
  searchParams: { program?: string; year?: string; master?: string };
}) {
  const program = searchParams.program ?? null;
  const year = searchParams.year ?? null;
  const master = searchParams.master ?? null;
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
              course: true,
            } 
          },
        },
      },
    },
  });
  if (!masterRequirements) {
    return <div>No requirements found</div>;
  }

  return (
    <GuideClientPage courseRequirements={masterRequirements.courseRequirements} />
  );
};

export default GuidePage;
