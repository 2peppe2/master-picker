"use client";

import { cn } from "@/lib/utils";

import { useStartingYear } from "@/features/dashboard/state/preferences/hooks/useStartingYear";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import Translate from "@/common/components/translate/Translate";
import { Separator } from "@/components/ui/separator";
import {
  periodAtom,
  semesterAtom,
  WILDCARD_BLOCK_START,
} from "@/features/dashboard/state/schedule/atoms";
import { draggedCourseAtom } from "@/features/dashboard/state/drag/atoms";
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

  const blocks = useAtomValue(periodAtom(semesterNumber, periodNumber));
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
      <div
        className={cn(
          "relative grid w-full max-w-full grid-cols-2 gap-3",
          "px-1 pb-3 sm:grid-cols-4 sm:gap-4 lg:flex",
          "lg:justify-between lg:gap-3 lg:overflow-x-auto",
          "lg:px-3 lg:py-3",
        )}
      >
        {range(0, blocks.length).map((index) => (
          <PeriodBlockSlot
            key={index}
            index={index}
            semesterNumber={semesterNumber}
            periodNumber={periodNumber}
          />
        ))}

        {showGhost && blocks.length === WILDCARD_BLOCK_START && (
          <div
            className={cn(
              "col-span-full h-px bg-border lg:h-40 lg:w-px",
              "lg:shrink-0 lg:bg-transparent",
            )}
          >
            <Separator
              orientation="vertical"
              className="hidden h-full w-px bg-zinc-600 lg:block"
            />
          </div>
        )}

        <div
          className={`aspect-square w-full min-w-0 transition-all duration-200 ease-in-out lg:h-40 lg:w-40 lg:shrink-0 ${
            showGhost
              ? "mx-auto flex translate-x-0 items-center lg:mx-0"
              : "pointer-events-none hidden -translate-x-4 overflow-hidden"
          }`}
        >
          <Block
            variant="ghost"
            data={{ semesterNumber, periodNumber, blockNumber: blocks.length }}
          />
        </div>
      </div>
    </div>
  );
};

export default PeriodView;

interface PeriodBlockSlotProps {
  index: number;
  semesterNumber: number;
  periodNumber: number;
}

const PeriodBlockSlot: FC<PeriodBlockSlotProps> = ({
  index,
  semesterNumber,
  periodNumber,
}) => {
  const isWildcardStart = index === WILDCARD_BLOCK_START;
  const isWildcardBlock = index >= WILDCARD_BLOCK_START;

  return (
    <Fragment>
      {isWildcardStart && (
        <div
          className={cn(
            "col-span-full my-1 flex h-px items-center bg-border",
            "lg:my-0 lg:h-40 lg:w-px lg:shrink-0",
            "lg:bg-transparent",
          )}
        >
          <Separator
            orientation="vertical"
            className="hidden h-full w-px bg-zinc-600 lg:block"
          />
        </div>
      )}

      <div
        className={cn(
          "mx-auto aspect-square w-full min-w-0 lg:mx-0 lg:h-40",
          "lg:w-40 lg:shrink-0",
        )}
      >
        <Block
          variant={isWildcardBlock ? "wildcard" : "standard"}
          data={{ semesterNumber, periodNumber, blockNumber: index }}
        />
      </div>
    </Fragment>
  );
};
