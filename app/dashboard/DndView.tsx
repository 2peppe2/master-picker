"use client";

import MastersRequirementsBar from "./(mastersRequirementsBar)/MastersRequirementsBar";
import { useCourseDropHandler } from "./(dndView)/hooks/useCourseDropHandler";
import { ConflictResolverModal } from "@/components/ConflictResolverModal";
import { useConflictManager } from "../../components/ConflictResolverModal/hooks/useConflictManager";
import GhostCourseCard from "@/components/CourseCard/GhostCourseCard";
import { useScheduleStore } from "../atoms/schedule/scheduleStore";
import { PeriodNodeData } from "@/components/Droppable";
import Schedule from "./(schedule)/Schedule";
import { Drawer } from "./(drawer)/Drawer";
import {
  DndProvider,
  OnDragEndArgs,
  OnDragStartArgs,
} from "@/components/DndProvider";
import { Course } from "./page";
import { FC } from "react";

interface DndViewProps {
  courses: Course[];
}

const DndView: FC<DndViewProps> = ({ courses }) => {
  const {
    state: { draggedCourse },
    mutators: { setDraggedCourse },
  } = useScheduleStore();

  const { conflictData, conflictOpen, setConflictOpen } = useConflictManager();
  const { handleDrop } = useCourseDropHandler();

  const onDragEnd = (event: OnDragEndArgs) => {
    const droppedCourse = draggedCourse;
    setDraggedCourse(null);

    if (!event.over || !droppedCourse) return;

    handleDrop({
      course: droppedCourse,
      overData: event.over.data.current as PeriodNodeData,
    });
  };

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
