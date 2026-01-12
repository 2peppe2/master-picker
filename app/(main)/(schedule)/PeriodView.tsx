import semesterScheduleAtom from "@/app/atoms/semestersAtom";
import { useAtomValue } from "jotai";
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
  const semesters = useAtomValue(semesterScheduleAtom);
  const blocks = semesters[semesterNumber][periodNumber];
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
