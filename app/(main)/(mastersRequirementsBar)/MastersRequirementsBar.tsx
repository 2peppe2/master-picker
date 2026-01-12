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
  const [masters, setMasters] = useState<MastersWithRequirements | null>(null);
  const evaluateMasterProgress = useEvaluateMasterProgress();

  useEffect(() => {
    getMastersWithRequirements().then(setMasters);
  }, []);

  if (!masters) {
    return null;
  }

  return (
    <Card className="p-4 mb-4">
      <CardTitle className="flex gap-4 text-lg">
        Master Requirements:
        {masters.map((master) => {
          const requirements = master.requirements.flatMap(
            (req) => req.requirements
          );
          const { fulfilled, progress } = evaluateMasterProgress(requirements);
          return (
            <MasterBadge
              master={master}
              key={master.master}
              text={`${progress}%`}
              tooltip={
                <MastersBadgeRequirementTooltip
                  master={master.master}
                  fulfilled={fulfilled}
                  all={requirements}
                />
              }
            />
          );
        })}
      </CardTitle>
    </Card>
  );
};
