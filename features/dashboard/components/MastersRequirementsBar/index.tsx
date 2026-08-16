"use client";

import MastersRequirementsSkeleton from "@/features/dashboard/components/MastersRequirementsBar/components/MastersRequirementsBarSkeleton";
import MastersRequirementsSmall from "@/features/dashboard/components/MastersRequirementsBar/components/MastersRequirementsSmall";
import MastersRequirementsLarge from "@/features/dashboard/components/MastersRequirementsBar/components/MastersRequirementsLarge";
import { useProgram } from "@/features/dashboard/state/preferences/hooks/useProgram";
import { useProcessedMasters } from "@/features/dashboard/components/MastersRequirementsBar/hooks/useProcessedMasters";
import { useIsCompact } from "@/common/hooks/useResponsiveLayout";

const MastersRequirementsBar = () => {
  const isCompact = useIsCompact();
  const program = useProgram();
  const { processed, isLoading } = useProcessedMasters({
    program,
  });

  if (isLoading) {
    return <MastersRequirementsSkeleton program={program} />;
  }

  if (isCompact) {
    return <MastersRequirementsSmall processed={processed} />;
  }

  return <MastersRequirementsLarge processed={processed} />;
};

export default MastersRequirementsBar;
