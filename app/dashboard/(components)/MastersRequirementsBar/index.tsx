"use client";

import MastersRequirementsSkeleton from "./components/MastersRequirementsBarSkeleton";
import MastersRequirementsSmall from "./components/MastersRequirementsSmall";
import MastersRequirementsLarge from "./components/MastersRequirementsLarge";
import { useProgram } from "../../(store)/preferences/hooks/useProgram";
import { useProcessedMasters } from "./hooks/useProcessedMasters";
import { useMediaQuery } from "react-responsive";

const MastersRequirementsBar = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const program = useProgram();
  const { processed, isLoading } = useProcessedMasters({
    program,
  });

  if (isLoading) {
    return <MastersRequirementsSkeleton program={program} />;
  }

  if (isMobile) {
    return <MastersRequirementsSmall processed={processed} />;
  }

  return <MastersRequirementsLarge processed={processed} />;
};

export default MastersRequirementsBar;
