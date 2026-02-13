import { useFilterStore } from "@/app/atoms/filter/filterStore";
import { Draggable } from "@/components/DndProvider/Draggable";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { SemesterOption } from "@/app/atoms/filter/types";
import { Droppable } from "@/components/Droppable";
import CourseCard from "@/components/CourseCard";
import { SearchIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import { BlockProps } from ".";
import { FC } from "react";

const StandardBlock: FC<BlockProps> = ({ courseSlot, data }) => {
  const draggedCourse = useAtomValue(scheduleAtoms.draggedCourseAtom);

  const isAlreadyOccupiedByCourse = draggedCourse?.code !== courseSlot?.code;
  const hasCourseInBlock = courseSlot && isAlreadyOccupiedByCourse;

  const {
    mutators: { selectBlocks, selectPeriods, selectSemester },
  } = useFilterStore();

  const handleFilterChange = () => {
    selectSemester((data.semesterNumber + 1) as SemesterOption);
    selectPeriods([data.periodNumber + 1]);
    selectBlocks([data.blockNumber + 1]);
  };

  return (
    <Droppable
      data={data}
      id={`block-${data.blockNumber}-${data.periodNumber}-${data.blockNumber}`}
    >
      {hasCourseInBlock ? (
        <Draggable id={courseSlot.code} data={courseSlot}>
          <CourseCard variant="dropped" course={courseSlot} />
        </Draggable>
      ) : (
        <div
          onClick={handleFilterChange}
          className="flex flex-col items-center justify-center h-full w-full group cursor-pointer"
        >
          <SearchIcon className="text-zinc-500 group-hover:text-foreground size-8 mb-2 transition-colors" />
          <span className="text-zinc-500 font-medium select-none">
            Block {data.blockNumber + 1}
          </span>
        </div>
      )}
    </Droppable>
  );
};

export default StandardBlock;
