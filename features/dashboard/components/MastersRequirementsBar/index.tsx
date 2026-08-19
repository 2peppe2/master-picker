"use client";

import MastersRequirementsSkeleton from "@/features/dashboard/components/MastersRequirementsBar/components/MastersRequirementsBarSkeleton";
import MastersRequirementsPhone from "@/features/dashboard/components/MastersRequirementsBar/components/MastersRequirementsPhone";
import MastersRequirementsTablet from "@/features/dashboard/components/MastersRequirementsBar/components/MastersRequirementsTablet";
import MastersRequirementsLandscape from "@/features/dashboard/components/MastersRequirementsBar/components/MastersRequirementsLandscape";
import MastersRequirementsLarge from "@/features/dashboard/components/MastersRequirementsBar/components/MastersRequirementsLarge";
import { useProgram } from "@/features/dashboard/state/preferences/hooks/useProgram";
import { useProcessedMasters } from "@/features/dashboard/components/MastersRequirementsBar/hooks/useProcessedMasters";
import {
  useIsLandscapePhone,
  useLayoutTier,
} from "@/common/hooks/useResponsiveLayout";

const MastersRequirementsBar = () => {
  const tier = useLayoutTier();
  const isLandscapePhone = useIsLandscapePhone();
  const program = useProgram();
  const { processed, isLoading } = useProcessedMasters({
    program,
  });

  if (isLoading) {
    return <MastersRequirementsSkeleton program={program} />;
  }

  if (isLandscapePhone)
    return <MastersRequirementsLandscape processed={processed} />;

  if (tier === "phone")
    return <MastersRequirementsPhone processed={processed} />;

  if (tier === "tablet")
    return <MastersRequirementsTablet processed={processed} />;

  return <MastersRequirementsLarge processed={processed} />;
};

export default MastersRequirementsBar;
