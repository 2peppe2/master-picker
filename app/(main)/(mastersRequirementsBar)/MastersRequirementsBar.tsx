import { Card, CardTitle } from "@/components/ui/card";

import { MastersBadgeRequirementTooltip } from "./components/MastersBadgeRequirementTooltip";
import { useEvaluateMasterProgress } from "./hooks/useEvaluateMasterProgress";
import { MasterBadge } from "@/components/MastersBadge";
import {
  getMastersWithRequirements,
  MastersWithRequirements,
} from "@/app/actions/getMasters";
import { useEffect, useState } from "react";

export const MastersRequirementsBar = () => {
  const [mastersWithRequirements, setMastersWithRequirements] =
    useState<MastersWithRequirements | null>(null);
  const evaluateMasterProgress = useEvaluateMasterProgress();

  useEffect(() => {
    getMastersWithRequirements().then(setMastersWithRequirements);
  }, []);

  if (!mastersWithRequirements) {
    return null;
  }

  return (
    <Card className="p-4 mb-4">
      <CardTitle className="flex gap-4 text-lg">
        Master Requirements:
        {mastersWithRequirements.map((master) => {
          const requirements = master.requirements.flatMap(
            (req) => req.requirements
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
      </CardTitle>
    </Card>
  );
};
