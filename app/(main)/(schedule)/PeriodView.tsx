import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { Separator } from "@/components/ui/separator";
import { BlockView } from "./BlockView";
import { FC } from "react";

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
    <div className="flex w-full max-w-full gap-5 overflow-x-auto pb-4">
      {blocks.map((_block, index) => (
        <div key={index} className="flex items-center">
          {index === 4 && (
            <div className="flex h-full items-center mr-auto ml-auto">
              <Separator orientation="vertical" className="w-[2px] mr-5" />
            </div>
          )}

          <div
            className={`border p-2 rounded-md bg-secondary/20 ${index >= 4 && "ml-auto"}`}
          >
            <BlockView
              semesterNumber={semesterNumber}
              periodNumber={periodNumber}
              blockNumber={index}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
