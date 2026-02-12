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
            "h-8 relative mr-2 inline-flex flex-none transition-all duration-500",
            masterMeta?.style,
          )}
        >
          <MasterIcon iconName={masterMeta.icon} />

          {isStarted && (
            <span className="ml-1 text-xsm font-bold">
              {progressPercentage}%
            </span>
          )}

          {!isComplete && isStarted && (
            <div
              className={`absolute bottom-0 left-0 h-[4px] bg-current transition-all duration-500 opacity-35`}
              aria-hidden="true"
              style={{ width: `${progressPercentage}%` }}
            />
          )}
        </Badge>
      </TooltipTrigger>

      <TooltipContent side="bottom">
        <MasterBadgeRequirementTooltip
          name={master.name}
          master={master.master}
          fulfilled={master.fulfilled}
          all={master.requirements}
        />
      </TooltipContent>
    </Tooltip>
  );
};

export default MasterProgressBadge;
