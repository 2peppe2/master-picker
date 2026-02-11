"use client";

import { MasterBadgeRequirementTooltip } from "./MasterBadgeRequirementTooltip";
import { CheckCircle2, CircleDashed } from "lucide-react";
import { mastersAtom } from "@/app/atoms/mastersAtom";
import { Badge } from "@/components/ui/badge";
import { ProcessedMaster } from "../types";
import { useAtomValue } from "jotai";
import { FC, useMemo } from "react";
import { cn } from "@/lib/utils";
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

  const badgeStyles = useMemo(() => {
    if (!isStarted) {
      return { filter: "grayscale(1)", opacity: 0.5 };
    }

    const intensity = Math.min(progressPercentage / 50, 1);

    return {
      filter: `grayscale(${1 - intensity})`,
      opacity: 0.5 + intensity * 0.5,
    };
  }, [isStarted, progressPercentage]);

  const StatusIcon = isComplete ? CheckCircle2 : CircleDashed;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          style={badgeStyles}
          className={cn(
            "relative mr-2 inline-flex flex-none transition-all duration-500",
            masterMeta?.style,
            !isStarted && "grayscale opacity-50",
          )}
        >
          <StatusIcon className="mr-1 h-3 w-3 shrink-0" />

          <span className="min-w-0 truncate whitespace-nowrap">
            {master.name}
          </span>

          {isStarted && (
            <span className="ml-1 text-[10px] font-bold">
              {progressPercentage}%
            </span>
          )}

          {!isComplete && isStarted && (
            <div
              className="absolute bottom-0 left-0 h-[2px] bg-current transition-all duration-500"
              style={{ width: `${progressPercentage}%`, opacity: 0.35 }}
              aria-hidden="true"
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
