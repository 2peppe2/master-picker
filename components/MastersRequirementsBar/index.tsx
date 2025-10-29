import { Card, CardTitle } from "@/components/ui/card";

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
        {MASTERS.map((master) => (
          <MastersBadge
            key={master}
            master={master}
            text={`${
              evaluateMasterProgress(masterRequirements[master]).progress
            }%`}
          />
        ))}
      </CardTitle>
    </Card>
  );
};
