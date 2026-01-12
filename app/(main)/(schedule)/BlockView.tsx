import semesterScheduleAtom from "@/app/atoms/semestersAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { Draggable } from "@/components/CourseCard/Draggable";
import { Droppable } from "@/components/Droppable";
import { FC } from "react";
import { filterAtom } from "@/app/atoms/FilterAtom";
import { produce } from "immer";
import { CourseWithOccasion } from "../types";

interface BlockViewProps {
  semesterNumber: number;
  periodNumber: number;
  blockNumber: number;
}

export const BlockView: FC<BlockViewProps> = ({
  semesterNumber,
  periodNumber,
  blockNumber,
}) => {
  const semesters = useAtomValue(semesterScheduleAtom);
  const setFilter = useSetAtom(filterAtom);
  const courseSlot: CourseWithOccasion | null =
    semesters[semesterNumber][periodNumber][blockNumber];

  function onClickFilter() {
    unCheckOtherTimeSlots();
    setFilter(
      produce((draft) => {
        draft.semester[semesterNumber] = true;
        draft.period[periodNumber] = true;
        draft.block[blockNumber] = true;
      })
    );
  }
  function unCheckOtherTimeSlots() {
    setFilter(
      produce((draft) => {
        draft.semester = draft.semester.map(() => false);
        draft.period = draft.period.map(() => false);
        draft.block = draft.block.map(() => false);
      })
    );
  }

  if (!courseSlot) {
    return (
      <Droppable
        key={blockNumber}
        id={`semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`}
        data={{
          semesterNumber: semesterNumber,
          periodNumber: periodNumber,
          blockNumber: blockNumber,
        }}
      >
        <div className="flex flex-col items-center">
          <SearchIcon
            className="text-zinc-500 hover:text-foreground size-12"
            onClick={onClickFilter}
          />
          <span className="text-zinc-500">Block {blockNumber + 1}</span>
        </div>
      </Droppable>
    );
  }
  return (
    <Droppable
      key={blockNumber}
      id={`semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`}
      data={{
        semesterNumber: semesterNumber,
        periodNumber: periodNumber,
        blockNumber: blockNumber,
      }}
    >
      <Draggable key={courseSlot.code} id={courseSlot.code} data={courseSlot}>
        <CourseCard course={courseSlot} dropped={true} />
      </Draggable>
    </Droppable>
  );
};
