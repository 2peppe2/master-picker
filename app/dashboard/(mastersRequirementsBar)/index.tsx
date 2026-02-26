"use client";

import MastersRequirementsSkeleton from "./components/MastersRequirementsBarSkeleton";
import { MasterOverflowBadge } from "./components/MasterOverflowBadge";
import MasterProgressBadge from "./components/MasterProgressBadge";
import { useProcessedMasters } from "./hooks/useProcessedMasters";
import { useBadgeOverflow } from "./hooks/useBadgeOverflow";
import { useSearchParams } from "next/navigation";
import { useMeasure } from "react-use";

const GAP_SIZE = 12;

const MastersRequirementsBar = () => {
  const searchParams = useSearchParams();
  const program = searchParams.get("program") ?? undefined;

  const [barRef, { width: barWidth }] = useMeasure<HTMLDivElement>();
  const [badgeRef, { width: badgeWidth }] = useMeasure<HTMLDivElement>();

  const { processed, isLoading } = useProcessedMasters({
    program,
  });

  const { visibleItems, overflowItems } = useBadgeOverflow({
    barWidth,
    badgeWidth,
    gap: GAP_SIZE,
    masters: processed,
  });

  if (isLoading) {
    return <MastersRequirementsSkeleton program={program} />;
  }

  return (
    <div className="flex items-center w-full h-full gap-4 min-w-0">
      <div className="absolute -top-[1000px] invisible pointer-events-none">
        <div ref={badgeRef} className="inline-block">
          {processed[0] && <MasterProgressBadge master={processed[0]} />}
        </div>
      </div>

      <div className="hidden lg:block text-sm font-medium text-muted-foreground shrink-0">
        Master&apos;s progress
      </div>

      <div ref={barRef} className="flex-1 min-w-0">
        <div className="flex items-center gap-3 w-full">
          {visibleItems.map((master) => (
            <div
              key={master.master}
              className="flex-1 min-w-0"
              style={{ minWidth: badgeWidth }}
            >
              <MasterProgressBadge master={master} />
            </div>
          ))}

          {overflowItems.length > 0 && (
            <div className="flex-1 min-w-0" style={{ minWidth: badgeWidth }}>
              <MasterOverflowBadge
                minWidth={badgeWidth}
                masters={overflowItems}
                count={overflowItems.length}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MastersRequirementsBar;
