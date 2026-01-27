import { Draggable } from "@/components/CourseCard/Draggable";
import { Droppable } from "@/components/Droppable";
import CourseCard from "@/components/CourseCard";
import { BlockViewProps } from "./Block";
import { FC } from "react";

const WildcardBlock: FC<BlockViewProps> = ({
  courseSlot,
  data,
  blockId,
  onFilterChange,
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
        className="flex flex-col items-center justify-center h-full w-full group cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        onClick={onFilterChange}
      >
        <div className="text-zinc-500 group-hover:text-foreground text-5xl font-light h-12 flex items-center select-none">
          *
        </div>
        <span className="text-zinc-500 text-xs uppercase tracking-wider mt-1 select-none">
          Extra
        </span>
      </div>
    </Droppable>
  );
};

export default WildcardBlock;
