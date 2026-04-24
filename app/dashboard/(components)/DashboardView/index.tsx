"use client";

import { useCourseDropHandler } from "./hooks/useCourseDropHandler";
import DashboardViewLarge from "./DashboardViewLarge";
import DashboardViewSmall from "./DashboardViewSmall";
import DashboardHeader from "./components/DashboardHeader";
import { scheduleAtoms } from "../../(store)/schedule/atoms";
import { PeriodNodeData } from "@/components/Droppable";
import DndProvider from "@/components/DndProvider";
import { FC, useCallback } from "react";
import CourseCard from "@/components/CourseCard";
import { useMediaQuery } from "react-responsive";
import {
  OnDragEndArgs,
  OnDragStartArgs,
  OnRenderDraggedArgs,
} from "@/components/DndProvider/types";
import { Course } from "../../page";
import { useAtom } from "jotai";

import { preferenceAtoms } from "../../(store)/preferences/atoms";

export type DashboardTab = "schedule" | "search";

export interface DashboardViewProps {
  courses: Course[];
}

const DashboardView: FC<DashboardViewProps> = ({ courses }) => {
  const [activeTab, setActiveTab] = useAtom(preferenceAtoms.activeTabAtom);
  const [draggedCourse, setDraggedCourse] = useAtom(
    scheduleAtoms.draggedCourseAtom,
  );

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const dropHandler = useCourseDropHandler();

  const handleDragEnd = useCallback(
    (event: OnDragEndArgs) => {
      setDraggedCourse(null);
      if (!event.over || !draggedCourse) {
        return;
      }

      dropHandler.handleDrop({
        course: draggedCourse,
        overData: event.over.data.current as PeriodNodeData,
      });
    },
    [dropHandler, draggedCourse, setDraggedCourse],
  );

  const handleDragStart = useCallback(
    (event: OnDragStartArgs<Course>) => setDraggedCourse(event.active),
    [setDraggedCourse],
  );

  const handleDragCancel = useCallback(
    () => setDraggedCourse(null),
    [setDraggedCourse],
  );

  const handleRenderDragged = useCallback(
    ({ active }: OnRenderDraggedArgs<Course>) => (
      <CourseCard variant="dragged" course={active} />
    ),
    [],
  );

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-background">
      <DashboardHeader />

      <DndProvider<Course>
        disabled={isMobile}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onRenderDragged={handleRenderDragged}
      >
        {isMobile ? (
          <DashboardViewSmall
            courses={courses}
            dropHandler={dropHandler}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ) : (
          <DashboardViewLarge courses={courses} dropHandler={dropHandler} />
        )}
      </DndProvider>
    </div>
  );
};

export default DashboardView;
