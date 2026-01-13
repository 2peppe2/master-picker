import { useScheduleStore } from "@/app/atoms/scheduleStore";
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
  const { state } = useScheduleStore();
  const blocks = state.schedules[semesterNumber][periodNumber];
  const BLOCKS = range(0, blocks.length);
  return (
    <div className="flex justify-around gap-5">
      {BLOCKS.map((index: number) => (
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
