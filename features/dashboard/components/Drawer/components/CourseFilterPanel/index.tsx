"use client";

import type {
  MultiSelectGroup,
  MultiSelectOption,
} from "@/components/ui/MultiSelect/types";
import { Button } from "@/components/ui/button";
import Translate from "@/common/components/translate/Translate";
import BottomFade from "@/common/components/BottomFade";
import { useBottomScrollFade } from "@/common/hooks/useBottomScrollFade";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState, type FC, type ReactNode } from "react";
import { CourseFilterCategory } from "./Category";
import { CourseFilterOptions } from "./Group";

/**
 * Shared by the plain heading and the back control so the two never differ in
 * height or indent -- moving between levels must not shift the panel around.
 * The measurements line the chevron up with the rows' icons and the heading
 * with their labels.
 */
const HEADING_ROW_CLASS = "flex min-w-0 items-center gap-2 py-2 pl-1 pr-2";

/** Reserves the chevron's width even at the top level, where there is none. */
interface HeadingSlotProps {
  children?: ReactNode;
}

const HeadingSlot: FC<HeadingSlotProps> = ({ children }) => (
  <span
    aria-hidden
    className="flex size-6 shrink-0 items-center justify-center"
  >
    {children}
  </span>
);

interface CourseFilterPanelProps {
  groups: MultiSelectGroup[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
}

/**
 * Where the panel currently is: a category, and optionally one of its
 * sections. Null is the top-level list. Mirrors the desktop dropdown so both
 * surfaces present the same categories in the same order.
 */
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

  const countSelected = (options: MultiSelectOption[]) =>
    options.filter((option) => selectedValues.includes(option.value)).length;

  const goBack = () =>
    setDrilldown(drilldown?.sectionKey ? { heading: drilldown.heading } : null);

  const title = activeSection?.headerLabel ?? activeGroup?.heading ?? null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-1 px-5 py-3">
        {title ? (
          // Chevron and heading are one control, so the title itself goes back.
          <button
            type="button"
            onClick={goBack}
            aria-label={`${translate("back")}: ${title}`}
            className={cn(
              HEADING_ROW_CLASS,
              "rounded-lg text-left transition-colors",
              // Matches the highlight this panel's own rows use.
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
          {/* Clearing wipes every category, so it only belongs at the top
              level -- offering it inside one category would read as
              clearing just that category. */}
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
          {/* Constant padding: the first row must sit at the same height on
              every level. */}
          <div className="px-5 pb-5 pt-3">
            {activeSection ? (
              <CourseFilterOptions
                options={activeSection.options}
                selectedValues={selectedValues}
                onToggle={onToggle}
              />
            ) : activeGroup ? (
              // A category without sections has nothing to choose between,
              // so it drills straight to its options.
              activeGroup.sections ? (
                <div className="flex flex-col">
                  {activeGroup.sections.map((section) => (
                    <CourseFilterCategory
                      key={section.key}
                      label={section.label}
                      icon={section.icon}
                      selectedCount={countSelected(section.options)}
                      onSelect={() =>
                        setDrilldown({
                          heading: activeGroup.heading,
                          sectionKey: section.key,
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <CourseFilterOptions
                  options={activeGroup.options}
                  selectedValues={selectedValues}
                  onToggle={onToggle}
                />
              )
            ) : (
              <div className="flex flex-col">
                {groups.map((group) => (
                  <CourseFilterCategory
                    key={group.heading}
                    label={group.heading}
                    icon={group.icon}
                    selectedCount={countSelected(group.options)}
                    onSelect={() => setDrilldown({ heading: group.heading })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {showFade && <BottomFade />}
      </div>
    </div>
  );
};

export default CourseFilterPanel;
