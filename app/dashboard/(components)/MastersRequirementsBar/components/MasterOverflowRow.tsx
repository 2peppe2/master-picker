"use client";

import MasterBadgeRequirementTooltip from "./MasterBadgeRequirementTooltip";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { useMasterAtom } from "@/app/(store)/hooks/useMasterAtom";
import { MasterIcon } from "@/components/MasterIcon";
import { ProcessedMaster } from "../types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FC } from "react";

interface MasterOverflowRowProps {
  master: ProcessedMaster;
  side: "left" | "right";
}

const MasterOverflowRow: FC<MasterOverflowRowProps> = ({
  master,
  side,
}) => {
  const masters = useMasterAtom();
  const masterMeta = masters[master.master];

  const progressPercentage = Math.round(
    Math.max(0, Math.min(100, master.progress)),
  );
  const isStarted = progressPercentage > 0;

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "group relative px-3 py-2.5 rounded-lg transition-all duration-200 cursor-default flex flex-col gap-2 min-w-[200px]",
            masterMeta?.style,
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-md bg-background/50 backdrop-blur-sm border border-border/50 shrink-0">
                <MasterIcon
                  iconName={masterMeta.icon}
                  className="size-3.5 opacity-90"
                />
              </div>
              <div className="font-semibold text-xs tracking-tight truncate opacity-90 overflow-hidden">
                <CourseTranslate text={master.name} />
              </div>
            </div>
            {isStarted && (
              <span className="text-[10px] font-bold tabular-nums opacity-60 shrink-0">
                {progressPercentage}%
              </span>
            )}
          </div>

          <div className="relative h-1 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-current transition-all duration-1000 ease-out opacity-40"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </TooltipTrigger>

      <TooltipContent
        side={side}
        sideOffset={15}
        className="p-0 border-none bg-transparent shadow-none"
      >
        <MasterBadgeRequirementTooltip
          name={master.name}
          master={master.master}
          all={master.requirements}
          fulfilled={master.fulfilled}
        />
      </TooltipContent>
    </Tooltip>
  );
};

export default MasterOverflowRow;