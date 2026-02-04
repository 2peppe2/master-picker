import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";
import { Draggable } from "@/components/DndProvider/Draggable";
import { Droppable } from "@/components/Droppable";
import CourseCard from "@/components/CourseCard";
import { BlockViewProps } from "./Block";
import { X } from "lucide-react";
import { FC } from "react";

const WildcardBlock: FC<BlockViewProps> = ({
  courseSlot,
  data,
  blockId,
  onFilterChange,
}) => {
  const { deleteBlockFromSemester } = useScheduleMutators();

  const handleRemoveSlot = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBlockFromSemester({
      semester: data.semesterNumber,
      blockIndex: data.blockNumber,
    });
  };

  if (courseSlot) {
    return (
      <Droppable data={data} id={blockId}>
        <Draggable id={courseSlot.code} data={courseSlot}>
          <CourseCard variant="dropped" course={courseSlot} />
        </Draggable>
      </Droppable>
    );
  }

  return (
    <Droppable data={data} id={blockId}>
      <div
        className="relative flex flex-col items-center justify-center h-full w-full group transition-all duration-200
        opacity-70 hover:opacity-100 hover:bg-zinc-100/5 dark:hover:bg-zinc-800/50"
        onClick={onFilterChange}
      >
        <span className="text-zinc-500 text-xs uppercase tracking-wider mt-1 select-none">
          Extra
        </span>

        <button
          onClick={handleRemoveSlot}
          className="absolute top-2 right-2
          text-zinc-400 
          border-2 border-transparent 
          rounded-sm p-2
          cursor-pointer
          transition-all duration-200
          hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-200"
          title="Remove block"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Droppable>
  );
};

export default WildcardBlock;
