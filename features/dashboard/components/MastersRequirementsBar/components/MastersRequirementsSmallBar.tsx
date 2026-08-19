import MasterProgressBadge from "./MasterProgressBadge";
import MastersRequirementsMoreControl from "./MastersRequirementsMoreControl";
import { cn } from "@/lib/utils";
import { ProcessedMaster } from "../types";
import { FC, Ref } from "react";

interface MastersRequirementsSmallBarProps {
  badgeRef: Ref<HTMLDivElement>;
  barRef: Ref<HTMLDivElement>;
  measurementMaster?: ProcessedMaster;
  overflowCount: number;
  presentation: "bottom-sheet" | "collapsible" | "sheet";
  visibleItems: ProcessedMaster[];
}

const MastersRequirementsSmallBar: FC<
  MastersRequirementsSmallBarProps
> = ({
  badgeRef,
  barRef,
  measurementMaster,
  overflowCount,
  presentation,
  visibleItems,
}) => (
    <div
      className={cn(
        "flex items-center justify-between w-full gap-2 select-none group",
        "min-h-(--touch-sm) h-auto",
      )}
    >
      <div className="absolute -top-[1000px] invisible pointer-events-none">
        <div ref={badgeRef} className="inline-block">
          {measurementMaster && (
            <MasterProgressBadge master={measurementMaster} />
          )}
        </div>
      </div>

      <div
        ref={barRef}
        className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden h-full"
      >
        {visibleItems.map((master) => (
          <div key={master.master} className="shrink-0 h-8">
            <MasterProgressBadge master={master} />
          </div>
        ))}
        {overflowCount > 0 && (
          <MastersRequirementsMoreControl
            count={overflowCount}
            presentation={presentation}
          />
        )}
      </div>
    </div>
);

export default MastersRequirementsSmallBar;
