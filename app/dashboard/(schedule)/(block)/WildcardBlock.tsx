import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";
import { Draggable } from "@/components/DndProvider/Draggable";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { Droppable } from "@/components/Droppable";
import CourseCard from "@/components/CourseCard";
import { useAtomValue } from "jotai";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockProps } from ".";
import { FC } from "react";

const WildcardBlock: FC<BlockProps> = ({ courseSlot, data }) => {
  const { deleteBlockFromSemester } = useScheduleMutators();
  const draggedCourse = useAtomValue(scheduleAtoms.draggedCourseAtom);

  const isThisCourseBeingDragged = draggedCourse?.code === courseSlot?.code;
  const shouldShowCourse = courseSlot && !isThisCourseBeingDragged;

  const handleRemoveSlot = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBlockFromSemester({
      semester: data.semesterNumber,
      blockIndex: data.blockNumber,
    });
  };

  if (courseSlot && isThisCourseBeingDragged) {
    return (
      <div
        className={cn(
          "transition-opacity duration-200",
          draggedCourse
            ? "opacity-30 grayscale-[0.5] pointer-events-none"
            : "opacity-100",
        )}
      >
        <CourseCard variant="dropped" course={courseSlot} />
      </div>
    );
  }

  return (
    <Droppable
      data={data}
      id={`ghost-${data.semesterNumber}-${data.periodNumber}`}
    >
      {shouldShowCourse ? (
        <Draggable
          data={courseSlot}
          id={`${courseSlot.code}-${data.periodNumber}-${data.blockNumber}`}
        >
          <CourseCard variant="dropped" course={courseSlot} />
        </Draggable>
      ) : (
        <div
          className="relative flex flex-col items-center justify-center h-full w-full group transition-all duration-200
        opacity-70 hover:opacity-100 hover:bg-zinc-100/5 dark:hover:bg-zinc-800/50"
        >
          <span className="text-zinc-500 text-xs uppercase tracking-wider select-none">
            Extra
          </span>
          <button
            onClick={handleRemoveSlot}
            className="absolute top-2 right-2 text-zinc-400 border-2 border-transparent rounded-sm p-2
                       cursor-pointer transition-all duration-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 
                       hover:text-zinc-600 dark:hover:text-zinc-200"
            title="Remove block"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </Droppable>
  );
};

export default WildcardBlock;
