import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { useFilterStore } from "@/app/atoms/filter/filterStore";
import { Draggable } from "@/components/CourseCard/Draggable";
import { SemesterOption } from "@/app/atoms/filter/types";
import { Droppable } from "@/components/Droppable";
import CourseCard from "@/components/CourseCard";
import { FC, useCallback, useMemo } from "react";
import { SearchIcon } from "lucide-react";
import { Course } from "../page";

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
  const {
    getters: { getSlotCourse },
  } = useScheduleStore();
  const {
    mutators: { selectBlocks, selectPeriods, selectSemester },
  } = useFilterStore();

  const data = useMemo(
    () => ({
      semesterNumber,
      periodNumber,
      blockNumber,
    }),
    [blockNumber, periodNumber, semesterNumber],
  );

  const courseSlot: Course | null = getSlotCourse({
    semester: semesterNumber,
    period: periodNumber + 1,
    block: blockNumber + 1,
  });

  const handleChangeFilter = useCallback(() => {
    selectSemester((semesterNumber + 1) as SemesterOption);
    selectPeriods([periodNumber + 1]);
    selectBlocks([blockNumber + 1]);
  }, [
    blockNumber,
    periodNumber,
    selectBlocks,
    selectPeriods,
    selectSemester,
    semesterNumber,
  ]);

  if (!courseSlot) {
    return (
      <Droppable
        data={data}
        key={blockNumber}
        id={`semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`}
      >
        <div className="flex flex-col items-center">
          <SearchIcon
            onClick={handleChangeFilter}
            className="text-zinc-500 hover:text-foreground size-12"
          />
          <span className="text-zinc-500">Block {blockNumber + 1}</span>
        </div>
      </Droppable>
    );
  }

  return (
    <Droppable
      data={data}
      key={blockNumber}
      id={`semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`}
    >
      <Draggable key={courseSlot.code} id={courseSlot.code} data={courseSlot}>
        <CourseCard course={courseSlot} dropped={true} />
      </Draggable>
    </Droppable>
  );
};
