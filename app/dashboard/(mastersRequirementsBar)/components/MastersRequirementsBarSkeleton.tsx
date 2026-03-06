import { FC, useMemo } from "react";
import _ from "lodash";

const PROGRAM_AMOUNT_OF_MASTERS: Record<string, number> = {
  "6CMJU": 7,
  "6CITE": 8,
  "6CDDD": 12,
};

interface MastersRequirementsSkeletonProps {
  program?: string;
}

const MastersRequirementsSkeleton: FC<MastersRequirementsSkeletonProps> = ({
  program,
}) => {
  const amountOfMasters = useMemo(() => {
    if (!program) {
      return [1, 2, 3, 4, 5];
    }

    return _.range(PROGRAM_AMOUNT_OF_MASTERS[program]);
  }, [program]);

  return (
    <div className="flex items-center w-full h-full gap-4 animate-pulse">
      <div className="h-8 w-24 bg-muted rounded shrink-0" />
      <div className="flex gap-3 overflow-hidden w-full">
        {amountOfMasters.map((i) => (
          <div key={i} className="h-8 w-full flex-1 bg-muted rounded-full" />
        ))}
      </div>
    </div>
  );
};

export default MastersRequirementsSkeleton;
