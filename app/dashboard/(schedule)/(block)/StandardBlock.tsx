import { Draggable } from "@/components/CourseCard/Draggable";
import { Droppable } from "@/components/Droppable";
import CourseCard from "@/components/CourseCard";
import { SearchIcon } from "lucide-react";
import { BlockViewProps } from "./Block";
import { FC } from "react";

const StandardBlock: FC<BlockViewProps> = ({
  courseSlot,
  data,
  blockId,
  onFilterChange,
  displayNumber,
}) => {
  if (courseSlot) {
    return (
      <Droppable data={data} id={blockId}>
        <Draggable id={courseSlot.code} data={courseSlot}>
          <CourseCard course={courseSlot} dropped={true} />
        </Draggable>
      </Droppable>
    );
  }

  return (
    <Droppable data={data} id={blockId}>
      <div
        className="flex flex-col items-center justify-center h-full w-full group cursor-pointer"
        onClick={onFilterChange}
      >
        <SearchIcon className="text-zinc-500 group-hover:text-foreground size-8 mb-2 transition-colors" />
        <span className="text-zinc-500 font-medium select-none">
          Block {displayNumber}
        </span>
      </div>
    </Droppable>
  );
};

export default StandardBlock;
