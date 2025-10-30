import { Card, CardTitle } from "@/components/ui/card";

import { MastersBadgeRequirementTooltip } from "./components/MastersBadgeRequirementTooltip";
import { useEvaluateMasterProgress } from "./hooks/useEvaluateMasterProgress";
import { MastersBadge } from "../MastersBadge";
import masterRequirements from "./data";
import { Master } from "./types";

const MASTERS = Object.keys(masterRequirements) as Master[];

export const MastersRequirementsBar = () => {
  const evaluateMasterProgress = useEvaluateMasterProgress();

  return (
    <Card className="p-4 mb-4">
      <CardTitle className="flex gap-4 text-lg">
        Master Requirements:
        {MASTERS.map((master) => {
          const { fulfilled, progress } = evaluateMasterProgress(
            master,
            masterRequirements[master]
          );
          return (
            <MastersBadge
              key={master}
              master={master}
              text={`${progress}%`}
              tooltip={
                <MastersBadgeRequirementTooltip
                  master={master}
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
