import { LucideCircleCheck, LucideCircleDashed } from "lucide-react";
import { RequirementUnion } from "../../page";
import { FC } from "react";

const NUM_TO_TYPED: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
};

interface MasterBadgeTooltipProps {
  master: string;
  name: string;
  all: RequirementUnion[];
  fulfilled: RequirementUnion[];
}

export const MasterBadgeRequirementTooltip: FC<MasterBadgeTooltipProps> = ({
  master,
  all,
  name,
  fulfilled,
}) => (
  <div className="flex flex-col gap-2 mt-2 mb-2">
    <p className="font-semibold text-sm border-b pb-1">{name}</p>
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
  [T in RequirementUnion as T["type"]]: FC<{ requirement: T }>;
};

const RequirementRows: RequirementComponentMap = {
  CREDITS_ADVANCED_MASTER: ({ requirement }) => (
    <>Have at least {requirement.credits} Advanced level credits.</>
  ),
  CREDITS_ADVANCED_PROFILE: ({ requirement }) => (
    <>
      Have at least {requirement.credits} Advanced level credits within your
      profile.
    </>
  ),
  CREDITS_PROFILE_TOTAL: ({ requirement }) => (
    <>Have at least {requirement.credits} total credits within your profile.</>
  ),
  CREDITS_MASTER_TOTAL: ({ requirement }) => (
    <>
      Have at least {requirement.credits} total credits for the Master&apos;s
      degree.
    </>
  ),
  CREDITS_TOTAL: ({ requirement }) => (
    <>Have at least {requirement.credits} total credits.</>
  ),
  COURSE_SELECTION: ({ requirement }) => {
    const isMandatory =
      requirement.minCount === 1 && requirement.courses.length === 1;

    const listFormatter = new Intl.ListFormat("en", {
      style: "long",
      type: "disjunction",
    });

    const courseList = listFormatter.format(
      requirement.courses.map((c) => c.courseCode),
    );

    return (
      <>
        {isMandatory ? (
          <>Have selected </>
        ) : (
          <>Have selected at least {NUM_TO_TYPED[requirement.minCount]} of </>
        )}
        {courseList}.
      </>
    );
  },
};

const MasterRequirementRowRenderer = <T extends RequirementUnion>({
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
    <div className="flex items-start gap-2 text-sm">
      <div className="mt-0.5">
        {isFulfilled ? (
          <LucideCircleCheck className="text-green-500" size={16} />
        ) : (
          <LucideCircleDashed
            className="text-muted-foreground opacity-50"
            size={16}
          />
        )}
      </div>
      <RequirementRow requirement={requirement} />
    </div>
  );
};
