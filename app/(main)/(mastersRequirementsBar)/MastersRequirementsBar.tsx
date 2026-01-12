import { Card, CardTitle } from "@/components/ui/card";

import { MastersBadgeRequirementTooltip } from "./components/MastersBadgeRequirementTooltip";
import { useEvaluateMasterProgress } from "./hooks/useEvaluateMasterProgress";
import { MastersBadge } from "@/components/MastersBadge";
import masterRequirements from "./data";
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
          const { fulfilled, progress } = evaluateMasterProgress(
            master.requirements.flatMap(req=>req.requirements)
          );
          return (
            <MastersBadge
              key={master.master}
              masterID={master.master}
              text={`${progress}%`}
              tooltip={
                <MastersBadgeRequirementTooltip
                  master={master.master}
                  fulfilled={fulfilled}
                  all={masterRequirements[master]}
                />
              }
            />
          );
        })}
      </CardTitle>
    </Card>
  );
};
