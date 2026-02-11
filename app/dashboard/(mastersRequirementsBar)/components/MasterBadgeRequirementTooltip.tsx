import { LucideCircleCheck, LucideCircleDashed } from "lucide-react";
import { RequirementsUnion } from "../../page";
import { FC } from "react";

interface MasterBadgeTooltipProps {
  master: string;
  name: string;
  all: RequirementsUnion[];
  fulfilled: RequirementsUnion[];
}

export const MasterBadgeRequirementTooltip: FC<MasterBadgeTooltipProps> = ({
  master,
  all,
  name,
  fulfilled,
}) => (
  <div className="flex flex-col gap-2 mt-2 mb-2">
    <p className="font-semibold">{name}</p>
    {all.map((requirement, i) => (
      <MasterRequirementRowRenderer
        key={`${master}-requirement-row-${i}`}
        requirement={requirement}
        isFulfilled={fulfilled.includes(requirement)}
      />
    ))}
  </div>
);

type RequirementComponentMap = {
  [T in RequirementsUnion as T["type"]]: FC<{ requirement: T }>;
};

const RequirementRows: RequirementComponentMap = {
  G_LEVEL: ({ requirement }) => (
    <>Have at least {requirement.credits} G-level credits.</>
  ),
  A_LEVEL: ({ requirement }) => (
    <>Have at least {requirement.credits} A-level credits.</>
  ),
  TOTAL: ({ requirement }) => (
    <>Have at least {requirement.credits} total credits.</>
  ),
  COURSES_OR: ({ requirement }) => (
    <>
      Have selected at least one of{" "}
      {requirement.courses.map((course) => course.code).join(", ")}.
    </>
  ),
};

const MasterRequirementRowRenderer = <T extends RequirementsUnion>({
  requirement,
  isFulfilled,
}: {
  requirement: T;
  isFulfilled: boolean;
}) => {
  const RequirementRow = RequirementRows[requirement.type] as FC<{
    requirement: T;
  }>;

  return (
    <div className="flex items-center gap-2">
      {isFulfilled ? (
        <LucideCircleCheck className="text-blue-600" size={16} />
      ) : (
        <LucideCircleDashed className="dark:text-background" size={16} />
      )}
      <RequirementRow requirement={requirement} />
    </div>
  );
};
