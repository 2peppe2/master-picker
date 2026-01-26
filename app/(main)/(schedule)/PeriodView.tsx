import { Separator } from "@/components/ui/separator";
import {
  useScheduleStore,
  WILDCARD_BLOCK_START,
} from "@/app/atoms/schedule/scheduleStore";
import Block from "./(block)/Block";
import { FC } from "react";
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
    getters: { getSlotBlocks },
  } = useScheduleStore();

  const blocks = getSlotBlocks({
    semester: semesterNumber,
    period: periodNumber + 1,
  });

  return (
    <div className="flex w-full max-w-full gap-5 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-zinc-300 justify-between">
      {range(0, blocks.length).map((index) => {
        const isWildcardStart = index === WILDCARD_BLOCK_START;

        return (
          <div key={index} className="flex items-center shrink-0">
            {isWildcardStart && (
              <div className="flex h-3/4 items-center px-4">
                <Separator
                  orientation="vertical"
                  className="w-[1px] h-full bg-zinc-300"
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
    </div>
  );
};
