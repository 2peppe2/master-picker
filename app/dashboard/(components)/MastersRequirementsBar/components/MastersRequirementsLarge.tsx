"use client";

import MasterProgressBadge from "./MasterProgressBadge";
import MasterOverflowBadge from "./MasterOverflowBadge";
import { useBadgeOverflow } from "../hooks/useBadgeOverflow";
import Translate from "@/common/components/translate/Translate";
import { ProcessedMaster } from "../types";
import { useMeasure } from "react-use";
import { FC, useState } from "react";

interface MastersRequirementsLargeProps {
  processed: ProcessedMaster[];
}

const GAP_SIZE = 12;

const MastersRequirementsLarge: FC<MastersRequirementsLargeProps> = ({
  processed,
}) => {
  const [barRef, { width: barWidth }] = useMeasure<HTMLDivElement>();
  const [badgeRef, { width: badgeWidth }] = useMeasure<HTMLDivElement>();
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);

  const { visibleItems, overflowItems } = useBadgeOverflow({
    barWidth,
    badgeWidth,
    gap: GAP_SIZE,
    masters: processed,
  });

  return (
    <div className="flex items-center w-full h-full gap-4 min-w-0">
      <div className="absolute -top-[1000px] invisible pointer-events-none">
        <div ref={badgeRef} className="inline-block">
          {processed[0] && <MasterProgressBadge master={processed[0]} />}
        </div>
      </div>

      <div className="hidden lg:block text-sm font-medium text-muted-foreground shrink-0">
        <Translate text="_dashboard_master_progress" />
      </div>

      <div ref={barRef} className="flex-1 min-w-0">
        <div className="flex items-center gap-3 w-full">
          {visibleItems.map((master) => (
            <div
              key={master.master}
              className="flex-1 min-w-0"
              style={{ minWidth: badgeWidth }}
            >
              <MasterProgressBadge
                master={master}
                onHover={() => setIsOverflowOpen(false)}
              />
            </div>
          ))}

          {overflowItems.length > 0 && (
            <div className="flex-1 min-w-0" style={{ minWidth: badgeWidth }}>
              <MasterOverflowBadge
                open={isOverflowOpen}
                minWidth={badgeWidth}
                masters={overflowItems}
                count={overflowItems.length}
                onOpenChange={setIsOverflowOpen}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MastersRequirementsLarge;
