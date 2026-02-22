"use client";

import { MasterBadgeRequirementTooltip } from "./MasterBadgeRequirementTooltip";
import { mastersAtom } from "@/app/atoms/mastersAtom";
import { MasterIcon } from "@/components/MasterIcon";
import { Badge } from "@/components/ui/badge";
import { ProcessedMaster } from "../types";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MasterProgressBadgeProps {
  master: ProcessedMaster;
}

const MasterProgressBadge: FC<MasterProgressBadgeProps> = ({ master }) => {
  const masters = useAtomValue(mastersAtom);
  const masterMeta = masters[master.master];

  const progressPercentage = Math.round(
    Math.max(0, Math.min(100, master.progress)),
  );
  const isStarted = progressPercentage > 0;
  const isComplete = progressPercentage >= 100;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "h-8 w-full flex items-center justify-center relative transition-all duration-500 cursor-default overflow-hidden px-2",
            masterMeta?.style,
          )}
        >
          <div className="flex items-center justify-center min-w-0">
            <MasterIcon iconName={masterMeta.icon} className="shrink-0" />

            {isStarted && (
              <span className="ml-1 text-[10px] font-bold whitespace-nowrap">
                {progressPercentage}%
              </span>
            )}
          </div>

          {!isComplete && isStarted && (
            <div
              aria-hidden="true"
              style={{ width: `${progressPercentage}%` }}
              className="absolute bottom-0 left-0 h-[3px] bg-current transition-all duration-500 opacity-30"
            />
          )}
        </Badge>
      </TooltipTrigger>

      <TooltipContent side="bottom">
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

export default MasterProgressBadge;
