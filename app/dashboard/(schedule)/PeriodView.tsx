import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { Separator } from "@/components/ui/separator";
import GhostBlock from "./(block)/GhostBlock";
import {
  useScheduleStore,
  WILDCARD_BLOCK_START,
} from "@/app/atoms/schedule/scheduleStore";
import { useAtomValue } from "jotai";
import Block from "./(block)/Block";
import { FC, useMemo } from "react";
import { range } from "lodash";

interface PeriodViewProps {
  semesterNumber: number;
  periodNumber: number;
}

export const PeriodView: FC<PeriodViewProps> = ({
  semesterNumber,
  periodNumber,
}) => {
  const {
    state: { draggedCourse },
    getters: { getSlotBlocks },
  } = useScheduleStore();

  const { startingYear } = useAtomValue(userPreferencesAtom);

  const blocks = getSlotBlocks({
    semester: semesterNumber,
    period: periodNumber + 1,
  });

  const showGhost = useMemo(() => {
    if (!draggedCourse) return false;

    const { year, semester } = relativeSemesterToYearAndSemester(
      startingYear,
      semesterNumber,
    );

    const hasWildcardOption = draggedCourse.CourseOccasion.some(
      (occ) =>
        occ.year === year &&
        occ.semester === semester &&
        occ.periods.some(
          (p) => p.period === periodNumber + 1, //&& p.blocks.length === 0,
        ),
    );

    if (!hasWildcardOption) return false;

    const wildcardSlots = blocks.slice(WILDCARD_BLOCK_START);
    const isFull = wildcardSlots.every((slot) => slot !== null);

    return isFull;
  }, [draggedCourse, blocks, semesterNumber, periodNumber, startingYear]);

  return (
    <div className="flex flex-col">
      <p className="text-muted-foreground text-sm">{`Period ${periodNumber + 1}`}</p>
      <div className="relative flex w-full max-w-full gap-5 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-zinc-300 justify-between">
        {range(0, blocks.length).map((index) => {
          const isWildcardStart = index === WILDCARD_BLOCK_START;

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
                semesterNumber={semesterNumber}
                periodNumber={periodNumber}
                blockNumber={index}
              />
            </div>
          );
        })}

        <div
          className={`flex items-center shrink-0 transition-all duration-200 ease-in-out ${
            showGhost
              ? "w-auto opacity-100 translate-x-0"
              : "w-0 opacity-0 -translate-x-4 overflow-hidden pointer-events-none"
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

          <GhostBlock
            semesterNumber={semesterNumber}
            periodNumber={periodNumber}
            blockNumber={blocks.length}
          />
        </div>
      </div>
    </div>
  );
};
