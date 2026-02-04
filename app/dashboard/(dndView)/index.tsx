"use client";

import { useConflictManager } from "@/components/ConflictResolverModal/hooks/useConflictManager";
import MastersRequirementsBar from "../(mastersRequirementsBar)/MastersRequirementsBar";
import { ConflictResolverModal } from "@/components/ConflictResolverModal";
import GhostCourseCard from "@/components/CourseCard/GhostCourseCard";
import { useCourseDropHandler } from "./hooks/useCourseDropHandler";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { PeriodNodeData } from "@/components/Droppable";
import Schedule from "../(schedule)/Schedule";
import { Drawer } from "../(drawer)/Drawer";
import { FC, useCallback } from "react";
import {
  DndProvider,
  OnDragEndArgs,
  OnDragStartArgs,
} from "@/components/DndProvider";
import { Course } from "../page";
import { useAtom } from "jotai";

interface DndViewProps {
  courses: Course[];
}

const DndView: FC<DndViewProps> = ({ courses }) => {
  const [draggedCourse, setDraggedCourse] = useAtom(
    scheduleAtoms.draggedCourseAtom,
  );

  const { conflictData, conflictOpen, setConflictOpen } = useConflictManager();
  const { handleDrop } = useCourseDropHandler();

  const onDragEnd = useCallback(
    (event: OnDragEndArgs) => {
      setDraggedCourse(null);

      if (!event.over || !draggedCourse) {
        return;
      }

      handleDrop({
        course: draggedCourse,
        overData: event.over.data.current as PeriodNodeData,
      });
    },
    [handleDrop, draggedCourse, setDraggedCourse],
  );

  return (
    <DndProvider<Course>
      onDragEnd={onDragEnd}
      onDragStart={(event: OnDragStartArgs<Course>) =>
        setDraggedCourse(event.active)
      }
      renderDragged={({ active }) => <GhostCourseCard course={active} />}
    >
      <div className="grid [grid-template-columns:auto_1fr] mt-4 relative">
        {conflictOpen && conflictData && (
          <ConflictResolverModal
            open={conflictOpen}
            setOpen={setConflictOpen}
            conflictData={conflictData}
          />
        )}
        <Drawer courses={courses} />
        <MainSection />
      </div>
    </DndProvider>
  );
};

export default DndView;

const MainSection = () => (
  <main className="flex flex-col gap-4 px-8 min-w-0">
    <MastersRequirementsBar />
    <Schedule />
  </main>
);
