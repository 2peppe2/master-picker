"use client";

import MasterBadgeRequirementTooltip from "./MasterBadgeRequirementTooltip";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { useMasterAtom } from "@/app/(store)/hooks/useMasterAtom";
import { MasterIcon } from "@/components/MasterIcon";
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

  const RowContent = (
    <>
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
    </>
  );

  return (
    <>
      <div className="hidden sm:block">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "group relative px-3 py-2.5 rounded-lg transition-all duration-200 cursor-default flex flex-col gap-2 min-w-[200px]",
                masterMeta?.style,
              )}
            >
              {RowContent}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side={side}
            sideOffset={15}
            className="p-0 border-none bg-transparent shadow-none z-50"
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

      <div className="block sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <div
              className={cn(
                "group relative px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer flex flex-col gap-2 min-w-[100%]",
                masterMeta?.style,
              )}
            >
              {RowContent}
            </div>
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

export default MasterOverflowRow;