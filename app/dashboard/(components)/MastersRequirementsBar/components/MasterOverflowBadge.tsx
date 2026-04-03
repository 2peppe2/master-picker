"use client";

import Translate from "@/common/components/translate/Translate";
import MasterOverflowRow from "./MasterOverflowRow";
import { Badge } from "@/components/ui/badge";
import { ProcessedMaster } from "../types";
import { FC, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MasterOverflowBadgeProps {
  minWidth: number;
  masters: ProcessedMaster[];
  count: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MasterOverflowBadge: FC<MasterOverflowBadgeProps> = ({
  minWidth,
  masters,
  count,
  open,
  onOpenChange,
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpenChange(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onOpenChange(false);
    }, 150);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Badge
          variant="outline"
          style={{ minWidth }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="h-8 w-full shrink-0 cursor-default flex items-center justify-center border transition-colors hover:bg-muted/50"
        >
          <Translate text="_wildcard_more_count" args={{ count }} />
        </Badge>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="p-3 w-auto min-w-[500px] max-h-[500px] overflow-y-auto scrollbar-thin shadow-2xl border-muted-foreground/20 backdrop-blur-md"
      >
        <div className="px-2 py-1 mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            <Translate text="master_profiles" />
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {masters.map((master, index) => (
            <MasterOverflowRow
              key={master.master}
              master={master}
              side={index % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MasterOverflowBadge;
