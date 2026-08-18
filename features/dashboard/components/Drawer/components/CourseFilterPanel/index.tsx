"use client";

import type {
  MultiSelectGroup,
  MultiSelectSection,
} from "@/components/ui/MultiSelect/types";
import { Button } from "@/components/ui/button";
import Translate from "@/common/components/translate/Translate";
import BottomFade from "@/common/components/BottomFade";
import { useBottomScrollFade } from "@/common/hooks/useBottomScrollFade";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState, type FC } from "react";
import CourseFilterPanelContent from "./components/CourseFilterPanelContent";
import HeadingSlot from "./components/HeadingSlot";

const HEADING_ROW_CLASS = "flex min-w-0 items-center gap-2 py-2 pl-1 pr-2";

interface CourseFilterPanelProps {
  groups: MultiSelectGroup[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
}

interface DrilldownState {
  heading: string;
  sectionKey?: string;
}

const CourseFilterPanel: FC<CourseFilterPanelProps> = ({
  groups,
  selectedValues,
  onToggle,
  onClear,
  onClose,
}: CourseFilterPanelProps) => {
  const [drilldown, setDrilldown] = useState<DrilldownState | null>(null);
  const translate = useCommonTranslate();

  const activeGroup = useMemo(
    () => groups.find((group) => group.heading === drilldown?.heading) ?? null,
    [groups, drilldown],
  );

  const activeSection = useMemo(
    () =>
      activeGroup?.sections?.find(
        (section) => section.key === drilldown?.sectionKey,
      ) ?? null,
    [activeGroup, drilldown],
  );

  const { scrollRef, showFade, handleScroll } = useBottomScrollFade([
    groups,
    activeGroup,
    activeSection,
  ]);

  const goBack = () =>
    setDrilldown(drilldown?.sectionKey ? { heading: drilldown.heading } : null);

  const title = activeSection?.headerLabel ?? activeGroup?.heading ?? null;

  const selectGroup = (group: MultiSelectGroup) => {
    setDrilldown({ heading: group.heading });
  };

  const selectSection = (
    group: MultiSelectGroup,
    section: MultiSelectSection,
  ) => {
    setDrilldown({ heading: group.heading, sectionKey: section.key });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-1 px-5 py-3">
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
            aria-label={translate("close")}
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
