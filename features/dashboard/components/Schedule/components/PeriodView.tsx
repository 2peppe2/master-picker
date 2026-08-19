"use client";

import { cn } from "@/lib/utils";

import { usePhoneScheduleLayout } from "@/features/dashboard/state/preferences/hooks/usePhoneScheduleLayout";
import { useStartingYear } from "@/features/dashboard/state/preferences/hooks/useStartingYear";
import Translate from "@/common/components/translate/Translate";
import {
  ghostVisibilityAtom,
  periodCreditsAtom,
  periodSlotCountAtom,
  WILDCARD_BLOCK_START,
} from "@/features/dashboard/state/schedule/atoms";
import { useRightScrollFade } from "@/common/hooks/useBottomScrollFade";
import RightFade from "@/common/components/RightFade";
import { useAtomValue } from "jotai";
import { FC } from "react";
import { range } from "lodash";
import Block from "./block";
import { formatCredits } from "./periodCredits";
import PeriodBlockSlot from "./PeriodBlockSlot";
import WildcardDivider from "./WildcardDivider";
import { slotSizeClasses } from "./periodSlotStyles";

interface PeriodViewProps {
  semesterNumber: number;
  periodNumber: number;
}

const PeriodView: FC<PeriodViewProps> = ({ semesterNumber, periodNumber }) => {
  const startingYear = useStartingYear();
  const { layout } = usePhoneScheduleLayout();
  const isCarousel = layout === "carousel";
  const slotCount = useAtomValue(
    periodSlotCountAtom(semesterNumber, periodNumber),
  );
  const credits = useAtomValue(periodCreditsAtom(semesterNumber, periodNumber));
  const showGhost = useAtomValue(
    ghostVisibilityAtom(semesterNumber, periodNumber, startingYear),
  );
  const { scrollRef, showFade, handleScroll } = useRightScrollFade([slotCount]);

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
          {range(0, slotCount).map((index) => (
            <PeriodBlockSlot
              key={index}
              index={index}
              layout={layout}
              semesterNumber={semesterNumber}
              periodNumber={periodNumber}
            />
          ))}

          {showGhost && slotCount === WILDCARD_BLOCK_START && (
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
              data={{ semesterNumber, periodNumber, blockNumber: slotCount }}
            />
          </div>
        </div>
        {isCarousel && showFade && <RightFade className="bottom-3 sm:hidden" />}
      </div>
    </div>
  );
};

export default PeriodView;
