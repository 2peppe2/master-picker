import { MastersBadgeRequirementTooltip } from "./components/MastersBadgeRequirementTooltip";
import { useEvaluateMasterProgress } from "./hooks/useEvaluateMasterProgress";
import { FC, ReactNode, useEffect, useState } from "react";
import { MasterBadge } from "@/components/MasterBadge";
import { Card, CardTitle } from "@/components/ui/card";
import {
  getMastersWithRequirements,
  MastersWithRequirements,
} from "@/app/actions/getMasters";
import { range } from "lodash";

const MastersRequirementsBar = () => {
  const [mastersWithRequirements, setMastersWithRequirements] =
    useState<MastersWithRequirements | null>(null);
  const evaluateMasterProgress = useEvaluateMasterProgress();

  useEffect(() => {
    getMastersWithRequirements().then(setMastersWithRequirements);
  }, []);

  if (!mastersWithRequirements) {
    return <MastersRequirementsSkeleton />;
  }

  return (
    <MastersRequirementsContainer>
      {mastersWithRequirements.map((master) => {
        const requirements = master.requirements.flatMap(
          (req) => req.requirements,
        );
        const { fulfilled, progress } = evaluateMasterProgress(requirements);

        return (
          <MasterBadge
            name={master.master}
            key={master.master}
            text={`${progress}%`}
            tooltip={({ masterName }) => (
              <MastersBadgeRequirementTooltip
                name={masterName}
                master={master.master}
                fulfilled={fulfilled}
                all={requirements}
              />
            )}
          />
        );
      })}
    </MastersRequirementsContainer>
  );
};

const MastersRequirementsSkeleton = () => (
  <MastersRequirementsContainer className="animation-pulse">
    {range(0, 8).map((i) => (
      <div
        key={`master-sekeleton-${i}`}
        className="h-6 w-[50px] bg-muted animate-pulse rounded-full"
      />
    ))}
  </MastersRequirementsContainer>
);

interface MastersRequirementsContainerProps {
  children: ReactNode;
  className?: string;
}

const MastersRequirementsContainer: FC<MastersRequirementsContainerProps> = ({
  children,
  className,
}) => (
  <Card className={`p-4 mb-4 ${className}`}>
    <CardTitle className={`flex flex-wrap gap-4 text-lg items-center`}>
      Master Requirements:
      {children}
    </CardTitle>
  </Card>
);

export default MastersRequirementsBar;
