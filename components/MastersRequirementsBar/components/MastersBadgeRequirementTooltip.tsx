import { LucideCircleCheck, LucideCircleDashed } from "lucide-react";
import { MasterRequirement } from "../types";
import { FC } from "react";

interface MastersBadgeTooltipProps {
  master: string;
  all: MasterRequirement[];
  fulfilled: MasterRequirement[];
}

export const MastersBadgeRequirementTooltip: FC<MastersBadgeTooltipProps> = ({
  master,
  all,
  fulfilled,
}) => (
  <div className="flex flex-col gap-2 mt-2 mb-2">
    {all.map((requirement, i) => (
      <MastersRequirementRowRenderer
        key={`${master}-requirement-row-${i}`}
        requirement={requirement}
        isFulfilled={fulfilled.includes(requirement)}
      />
    ))}
  </div>
);

type RequirementComponentMap = {
  [K in MasterRequirement["type"]]: FC<{
    requirement: Extract<MasterRequirement, { type: K }>;
  }>;
};

const RequirementRows: RequirementComponentMap = {
  "G-level": ({ requirement }) => (
    <>Have at least {requirement.credits} G-level credits.</>
  ),
  "A-level": ({ requirement }) => (
    <>Have at least {requirement.credits} A-level credits.</>
  ),
  Total: ({ requirement }) => (
    <>Have at least {requirement.credits} total credits.</>
  ),
  Courses: ({ requirement }) => (
    <>Have selected at least one of {requirement.courses.join(", ")}.</>
  ),
};

const MastersRequirementRowRenderer = <T extends MasterRequirement>({
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
        <LucideCircleCheck color="var(--color-emerald-500)" size={16} />
      ) : (
        <LucideCircleDashed
          className="text-background dark:text-foreground"
          size={16}
        />
      )}
      <RequirementRow requirement={requirement} />
    </div>
  );
};
