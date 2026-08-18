"use client";

import MasterBadgeRequirementTooltip from "./MasterBadgeRequirementTooltip";
import { useMasterAtom } from "@/features/catalog/hooks/useMasterAtom";
import { MasterIcon } from "@/common/components/MasterIcon";
import { Badge } from "@/components/ui/badge";
import { ProcessedMaster } from "../types";
import { cn } from "@/lib/utils";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetTrigger,
  BottomSheetTitle,
  BottomSheetDescription,
} from "@/components/ui/bottom-sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsTouchLayout } from "@/common/hooks/useResponsiveLayout";
import { FC } from "react";

interface MasterProgressBadgeProps {
  master: ProcessedMaster;
  onHover?: () => void;
  tooltipOpen?: boolean;
  onTooltipOpenChange?: (open: boolean) => void;
}

const MasterProgressBadge: FC<MasterProgressBadgeProps> = ({
  master,
  onHover,
  tooltipOpen,
  onTooltipOpenChange,
}) => {
  const isTouchLayout = useIsTouchLayout();
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
          <span className="ml-1 text-2xs font-bold whitespace-nowrap">
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

  /*
   * Not a `sm:` breakpoint: a phone in landscape is 640px+ wide, so a width
   * check hands it the hover-only tooltip and the badge stops responding to
   * taps entirely.
   */
  if (isTouchLayout) {
    return (
      <BottomSheet>
        <BottomSheetTrigger asChild>
          <Badge
            variant="outline"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "min-w-[80px] h-8 w-full flex items-center justify-center relative transition-all duration-200 cursor-pointer overflow-hidden px-2 hover:bg-muted/50",
              masterMeta?.style,
            )}
          >
            {BadgeContent}
          </Badge>
        </BottomSheetTrigger>
        <BottomSheetContent className="overflow-hidden">
          <div className="min-h-0 overflow-y-auto p-6 pt-4">
            <BottomSheetTitle className="sr-only">Requirements</BottomSheetTitle>
            <BottomSheetDescription className="sr-only">
              Master requirements details
            </BottomSheetDescription>
            <MasterBadgeRequirementTooltip
              name={master.name}
              master={master.master}
              all={master.requirements}
              fulfilled={master.fulfilled}
              className="p-0 max-w-none w-full border-none shadow-none bg-transparent backdrop-blur-none"
            />
          </div>
        </BottomSheetContent>
      </BottomSheet>
    );
  }

  return (
    <div className="w-full">
      <Tooltip
        open={tooltipOpen}
        delayDuration={0}
        disableHoverableContent
        onOpenChange={onTooltipOpenChange}
      >
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            data-master-progress-badge={master.master}
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
          className="p-0 border-none bg-transparent shadow-none data-[state=instant-open]:!animate-none data-[state=delayed-open]:!animate-none data-[state=closed]:!animate-none"
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
  );
};

export default MasterProgressBadge;
