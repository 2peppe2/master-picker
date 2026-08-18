"use client";

import { cn } from "@/lib/utils";

import { usePhoneScheduleLayout } from "@/features/dashboard/state/preferences/hooks/usePhoneScheduleLayout";
import { useStartingYear } from "@/features/dashboard/state/preferences/hooks/useStartingYear";
import type { PhoneScheduleLayout } from "@/features/dashboard/state/preferences/atoms";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import Translate from "@/common/components/translate/Translate";
import { Separator } from "@/components/ui/separator";
import {
  periodAtom,
  semesterAtom,
  WILDCARD_BLOCK_START,
} from "@/features/dashboard/state/schedule/atoms";
import { draggedCourseAtom } from "@/features/dashboard/state/drag/atoms";
import { useRightScrollFade } from "@/common/hooks/useBottomScrollFade";
import RightFade from "@/common/components/RightFade";
import { useAtomValue } from "jotai";
import { FC, Fragment, useMemo } from "react";
import { range } from "lodash";
import Block from "./block";
import { formatCredits, getPeriodCredits } from "./periodCredits";

interface PeriodViewProps {
  semesterNumber: number;
  periodNumber: number;
}

const PeriodView: FC<PeriodViewProps> = ({ semesterNumber, periodNumber }) => {
  const draggedCourse = useAtomValue(draggedCourseAtom);
  const startingYear = useStartingYear();
  const { layout } = usePhoneScheduleLayout();
  const isCarousel = layout === "carousel";

  const blocks = useAtomValue(periodAtom(semesterNumber, periodNumber));
  const { scrollRef, showFade, handleScroll } = useRightScrollFade([blocks]);
  const periods = useAtomValue(semesterAtom(semesterNumber));
  const credits = useMemo(
    () => getPeriodCredits(periods, periodNumber),
    [periodNumber, periods],
  );

  const showGhost = useMemo(() => {
    if (!draggedCourse) return false;

    const isAlreadyInWildcard = blocks.some(
      (course, index) =>
        index >= WILDCARD_BLOCK_START && course?.code === draggedCourse.code,
    );

    if (isAlreadyInWildcard) return false;

    const { year, semester } = relativeSemesterToYearAndSemester(
      startingYear,
      semesterNumber,
    );

    const hasWildcardOption = draggedCourse.CourseOccasion.some(
      (occ) =>
        occ.year === year &&
        occ.semester === semester &&
        occ.periods.some((p) => p.period === periodNumber + 1),
    );

    if (!hasWildcardOption) return false;

    const wildcardSlots = blocks.slice(WILDCARD_BLOCK_START);
    const isFull = wildcardSlots.every((slot) => slot !== null);

    return isFull;
  }, [draggedCourse, blocks, semesterNumber, periodNumber, startingYear]);

  return (
    <div className="flex flex-col gap-2">
      <p
        className={cn(
          "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 px-1",
          "text-xs font-medium uppercase tracking-normal",
          "text-muted-foreground sm:text-sm sm:normal-case",
          "sm:tracking-normal",
        )}
      >
        <Translate text="_period_label" args={{ p: periodNumber + 1 }} />
        <span className="normal-case text-primary">
          <Translate
            text="_period_credits"
            args={{ credits: formatCredits(credits) }}
          />
        </span>
      </p>
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          // Only the carousel needs to keep sideways drags for itself; the grid
          // has nothing to scroll, so it lets the dashboard tab swipe through.
          data-no-swipe={isCarousel ? "true" : undefined}
          className={cn(
            "relative w-full max-w-full",
            isCarousel
              ? cn(
                  // The panel above sets touch-pan-y, so re-allow pan-x here.
                  "[touch-action:pan-x_pan-y]",
                  // Phones swipe through one period per row so both periods
                  // stay on screen.
                  "flex snap-x snap-mandatory gap-3",
                  "scroll-px-1 overflow-x-auto px-1 pb-3",
                  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                )
              : // Two blocks per row, so a whole period fits on one screen.
                "grid grid-cols-2 gap-3 px-1 pb-3",
            // Tablets get the four-column grid, desktop the wide row.
            "sm:grid sm:snap-none sm:grid-cols-4 sm:gap-4",
            "sm:touch-auto sm:overflow-visible lg:flex",
            "lg:justify-between lg:gap-3 lg:overflow-x-auto",
            "lg:px-3 lg:py-3",
          )}
        >
          {range(0, blocks.length).map((index) => (
            <PeriodBlockSlot
              key={index}
              index={index}
              layout={layout}
              semesterNumber={semesterNumber}
              periodNumber={periodNumber}
            />
          ))}

          {showGhost && blocks.length === WILDCARD_BLOCK_START && (
            <WildcardDivider carousel={isCarousel} />
          )}

          <div
            className={cn(
              slotSizeClasses(isCarousel),
              "transition-all duration-200 ease-in-out",
              showGhost
                ? "mx-auto flex translate-x-0 items-center lg:mx-0"
                : "pointer-events-none hidden -translate-x-4 overflow-hidden",
            )}
          >
            <Block
              variant="ghost"
              data={{ semesterNumber, periodNumber, blockNumber: blocks.length }}
            />
          </div>
        </div>
        {isCarousel && showFade && <RightFade className="bottom-3 sm:hidden" />}
      </div>
    </div>
  );
};

export default PeriodView;

/**
 * Slot box sizing. The carousel keeps fixed squares it can snap between; the
 * grid fills its column, which is the same shape the tablet breakpoint uses.
 */
const slotSizeClasses = (carousel: boolean) =>
  cn(
    carousel
      ? "size-40 shrink-0 snap-start"
      : "mx-auto size-auto aspect-square w-full min-w-0 shrink",
    "sm:mx-auto sm:size-auto sm:aspect-square sm:w-full sm:min-w-0 sm:shrink",
    "lg:mx-0 lg:h-40 lg:w-40 lg:shrink-0",
  );

/**
 * Separates the standard blocks from user-added wildcard slots: a vertical rule
 * in the flex layouts, a full-width horizontal rule in the grid ones so the
 * wildcards start on a fresh row.
 */
interface WildcardDividerProps {
  carousel: boolean;
}

const WildcardDivider: FC<WildcardDividerProps> = ({ carousel }) => (
  <div
    className={cn(
      carousel
        ? "flex h-40 w-px shrink-0 items-center bg-transparent"
        : "col-span-full my-1 h-px w-auto bg-border",
      "sm:col-span-full sm:my-1 sm:h-px sm:w-auto sm:bg-border",
      "lg:my-0 lg:h-40 lg:w-px lg:shrink-0",
      "lg:bg-transparent",
    )}
  >
    <Separator
      orientation="vertical"
      className={cn(
        "h-full w-px bg-zinc-600 sm:hidden lg:block",
        carousel ? "block" : "hidden",
      )}
    />
  </div>
);

interface PeriodBlockSlotProps {
  index: number;
  layout: PhoneScheduleLayout;
  semesterNumber: number;
  periodNumber: number;
}

const PeriodBlockSlot: FC<PeriodBlockSlotProps> = ({
  index,
  layout,
  semesterNumber,
  periodNumber,
}) => {
  const isWildcardStart = index === WILDCARD_BLOCK_START;
  const isWildcardBlock = index >= WILDCARD_BLOCK_START;
  const carousel = layout === "carousel";

  return (
    <Fragment>
      {isWildcardStart && <WildcardDivider carousel={carousel} />}

      <div className={slotSizeClasses(carousel)}>
        <Block
          variant={isWildcardBlock ? "wildcard" : "standard"}
          data={{ semesterNumber, periodNumber, blockNumber: index }}
        />
      </div>
    </Fragment>
  );
};
