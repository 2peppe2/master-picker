"use client";

import { useScheduleGetters } from "@/app/dashboard/(store)/schedule/hooks/useScheduleGetters";
import { useStartingYear } from "@/app/dashboard/(store)/preferences/hooks/useStartingYear";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import Translate from "@/common/components/translate/Translate";
import { Separator } from "@/components/ui/separator";
import {
  scheduleAtoms,
  WILDCARD_BLOCK_START,
} from "@/app/dashboard/(store)/schedule/atoms";
import { useAtomValue } from "jotai";
import { FC, useMemo } from "react";
import { range } from "lodash";
import Block from "./block";

interface PeriodViewProps {
  semesterNumber: number;
  periodNumber: number;
}

const PeriodView: FC<PeriodViewProps> = ({ semesterNumber, periodNumber }) => {
  const draggedCourse = useAtomValue(scheduleAtoms.draggedCourseAtom);
  const startingYear = useStartingYear();

  const { getSlotBlocks } = useScheduleGetters();

  const blocks = getSlotBlocks({
    semester: semesterNumber,
    period: periodNumber + 1,
  });

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
    <div className="flex flex-col">
      <p className="text-muted-foreground text-sm">
        <Translate text="_period_label" args={{ p: periodNumber + 1 }} />
      </p>
      <div className="relative flex w-full max-w-full gap-5 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-zinc-300 justify-between">
        {range(0, blocks.length).map((index) => {
          const isWildcardStart = index === WILDCARD_BLOCK_START;
          const isWildcardBlock = index >= WILDCARD_BLOCK_START;

          return (
            <div key={index} className="flex items-center shrink-0">
              {isWildcardStart && (
                <div className="flex h-full items-center px-4">
                  <Separator
                    orientation="vertical"
                    className="w-[1px] h-full bg-zinc-600"
                  />
                </div>
              )}

              <Block
                variant={isWildcardBlock ? "wildcard" : "standard"}
                data={{ semesterNumber, periodNumber, blockNumber: index }}
              />
            </div>
          );
        })}

        <div
          className={`flex items-center shrink-0 transition-all duration-200 ease-in-out ${
            showGhost
              ? "w-auto block translate-x-0"
              : "w-0 hidden -translate-x-4 overflow-hidden pointer-events-none"
          }`}
        >
          {blocks.length === WILDCARD_BLOCK_START && (
            <div className="flex h-full items-center px-4">
              <Separator
                orientation="vertical"
                className="w-[1px] h-full bg-zinc-600"
              />
            </div>
          )}

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
