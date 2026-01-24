import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { range } from "lodash";
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
    <div className="flex justify-around gap-5">
      {range(0, blocks.length).map((index: number) => (
        <BlockView
          key={index}
          semesterNumber={semesterNumber}
          periodNumber={periodNumber}
          blockNumber={index}
        />
      ))}
    </div>
  );
};
