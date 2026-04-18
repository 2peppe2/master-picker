"use client";

import MasterBadgeRequirementTooltip from "./MasterBadgeRequirementTooltip";
import { useMasterAtom } from "@/app/(store)/hooks/useMasterAtom";
import { MasterIcon } from "@/components/MasterIcon";
import { Badge } from "@/components/ui/badge";
import { ProcessedMaster } from "../types";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FC } from "react";

interface MasterProgressBadgeProps {
  master: ProcessedMaster;
  onHover?: () => void;
}

const MasterProgressBadge: FC<MasterProgressBadgeProps> = ({
  master,
  onHover,
}) => {
  const masters = useMasterAtom();
  const masterMeta = masters[master.master];

  const progressPercentage = Math.round(
    Math.max(0, Math.min(100, master.progress)),
  );
  const isStarted = progressPercentage > 0;
  const isComplete = progressPercentage >= 100;

  const BadgeContent = (
    <>
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
    </>
  );

  return (
    <>
      <div className="hidden sm:block w-full">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              onMouseEnter={onHover}
              className={cn(
                "min-w-[80px] h-8 w-full flex items-center justify-center relative transition-all duration-200 cursor-default overflow-hidden px-2 hover:bg-muted/50",
                masterMeta?.style,
              )}
            >
              {BadgeContent}
            </Badge>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
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
      </div>

      <div className="block sm:hidden w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Badge
              variant="outline"
              className={cn(
                "min-w-[80px] h-8 w-full flex items-center justify-center relative transition-all duration-200 cursor-pointer overflow-hidden px-2 hover:bg-muted/50",
                masterMeta?.style,
              )}
            >
              {BadgeContent}
            </Badge>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-6 pt-10 w-full rounded-t-2xl outline-none max-h-[90vh] overflow-y-auto">
            <SheetTitle className="sr-only">Requirements</SheetTitle>
            <SheetDescription className="sr-only">Master requirements details</SheetDescription>
            <MasterBadgeRequirementTooltip
              name={master.name}
              master={master.master}
              all={master.requirements}
              fulfilled={master.fulfilled}
              className="p-0 max-w-none w-full border-none shadow-none bg-transparent backdrop-blur-none"
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default MasterProgressBadge;
