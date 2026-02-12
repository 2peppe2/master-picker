"use client";

import { useConflictManager } from "@/components/ConflictResolverModal/hooks/useConflictManager";
import { ConflictResolverModal } from "@/components/ConflictResolverModal";
import { useScrollToCourseFeedback } from "@/hooks/useCourseAddedFeedback";
import { useCourseDropHandler } from "./hooks/useCourseDropHandler";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { PeriodNodeData } from "@/components/Droppable";
import MainSection from "./components/MainSection";
import CourseCard from "@/components/CourseCard";
import { FC, useCallback } from "react";
import Drawer from "../(drawer)";
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

  useScrollToCourseFeedback();

  const onDragEnd = useCallback(
    (event: OnDragEndArgs) => {
      setDraggedCourse(null);
      if (!event.over || !draggedCourse) return;

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
      renderDragged={({ active }) => (
        <CourseCard variant="dragged" course={active} />
      )}
    >
      <div className="grid [grid-template-columns:auto_1fr] relative min-h-screen items-start">
        {conflictOpen && conflictData && (
          <ConflictResolverModal
            open={conflictOpen}
            setOpen={setConflictOpen}
            conflictData={conflictData}
          />
        )}

        <aside className="bg-card border-r border-primary/10 sticky top-0 h-screen overflow-hidden">
          <Drawer courses={courses} />
        </aside>

        <MainSection />
      </div>
    </DndProvider>
  );
};

export default DndView;
