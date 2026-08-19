"use client";

import type { MultiSelectGroup } from "@/components/ui/MultiSelect/types";
import { Button } from "@/components/ui/button";
import Translate from "@/common/components/translate/Translate";
import BottomFade from "@/common/components/BottomFade";
import { useBottomScrollFade } from "@/common/hooks/useBottomScrollFade";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { type FC } from "react";
import CourseFilterPanelContent from "./components/CourseFilterPanelContent";
import HeadingSlot from "./components/HeadingSlot";
import { useCourseFilterDrilldown } from "./hooks/useCourseFilterDrilldown";

const HEADING_ROW_CLASS = "flex min-w-0 items-center gap-2 py-2 pl-1 pr-2";

interface CourseFilterPanelProps {
  groups: MultiSelectGroup[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
}

const CourseFilterPanel: FC<CourseFilterPanelProps> = ({
  groups,
  selectedValues,
  onToggle,
  onClear,
  onClose,
}: CourseFilterPanelProps) => {
  const translate = useCommonTranslate();
  const {
    activeGroup,
    activeSection,
    title,
    goBack,
    selectGroup,
    selectSection,
  } = useCourseFilterDrilldown(groups);

  const { scrollRef, showFade, handleScroll } = useBottomScrollFade([
    groups,
    activeGroup,
    activeSection,
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* The bottom-sheet branch is fullscreen and sits behind the status bar;
          the landscape side sheet has nothing above it, hence the reset. */}
      <div
        className={cn(
          "flex items-center justify-between gap-1 px-5 pb-3",
          "pt-[calc(0.75rem+env(safe-area-inset-top))]",
          "landscape-phone:pt-3",
        )}
      >
        {title ? (
          <button
            type="button"
            onClick={goBack}
            aria-label={`${translate("back")}: ${title}`}
            className={cn(
              HEADING_ROW_CLASS,
              "rounded-lg text-left transition-colors",
              "hover:bg-muted/70 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            <HeadingSlot>
              <ChevronLeft className="size-5" />
            </HeadingSlot>
            <h2 className="min-w-0 truncate text-lg font-semibold">{title}</h2>
          </button>
        ) : (
          <div className={HEADING_ROW_CLASS}>
            <HeadingSlot />
            <h2 className="min-w-0 truncate text-lg font-semibold">
              <Translate text="filters" />
            </h2>
          </div>
        )}
        <div className="flex shrink-0 items-center gap-1">
          {!title && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <Translate text="_clear_filters" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={translate("close_filters")}
            className="size-10"
          >
            <span aria-hidden className="text-xl leading-none">
              ×
            </span>
          </Button>
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto"
        >
          <div className="px-5 pb-5 pt-3">
            <CourseFilterPanelContent
              groups={groups}
              activeGroup={activeGroup}
              activeSection={activeSection}
              selectedValues={selectedValues}
              onToggle={onToggle}
              onSelectGroup={selectGroup}
              onSelectSection={selectSection}
            />
          </div>
        </div>
        {showFade && <BottomFade />}
      </div>
    </div>
  );
};

export default CourseFilterPanel;
