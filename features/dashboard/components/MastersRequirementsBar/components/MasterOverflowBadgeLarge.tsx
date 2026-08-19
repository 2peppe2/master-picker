"use client";

import MasterOverflowList from "./MasterOverflowList";
import MasterOverflowTrigger from "./MasterOverflowTrigger";
import { MasterOverflowBadgeProps } from "./MasterOverflowBadge.types";
import Translate from "@/common/components/translate/Translate";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FC } from "react";
import { useDelayedHoverOpen } from "../hooks/useDelayedHoverOpen";

const MasterOverflowBadgeLarge: FC<MasterOverflowBadgeProps> = ({
  minWidth,
  masters,
  count,
  open,
  onOpenChange,
}) => {
  const { handleMouseEnter, handleMouseLeave } =
    useDelayedHoverOpen(onOpenChange);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <MasterOverflowTrigger
          count={count}
          minWidth={minWidth}
          presentation="popover"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="p-3 w-[calc(100vw-32px)] sm:w-auto sm:min-w-[500px] max-h-[500px] overflow-y-auto scrollbar-thin shadow-2xl border-muted-foreground/20 backdrop-blur-md z-50"
      >
        <div className="px-1 py-1 mb-2">
          <p className="text-2xs font-bold uppercase tracking-normal text-muted-foreground/70 sm:text-left text-center">
            <Translate text="_master_profiles" />
          </p>
        </div>
        <MasterOverflowList masters={masters} />
      </PopoverContent>
    </Popover>
  );
};

export default MasterOverflowBadgeLarge;
