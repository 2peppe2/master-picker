"use client";

import { PeriodNodeData } from "@/components/Droppable";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { MastersRequirementsBar } from "./(mastersRequirementsBar)/MastersRequirementsBar";
import { Drawer } from "./(drawer)/Drawer";
import CourseCard from "@/components/CourseCard";
import { useAtom, useAtomValue } from "jotai";
import { useScheduleStore } from "../atoms/scheduleStore";
import Schedule from "./(schedule)/Schedule";
import { activeCourseAtom } from "../atoms/ActiveCourseAtom";
import { FC } from "react";
import { Course } from "./page";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "../atoms/UserPreferences";

interface DndViewProps {
  courses: Course[];
}

const DndView: FC<DndViewProps> = ({ courses }) => {
  const [activeCourse, setActiveCourse] = useAtom(activeCourseAtom);
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const { mutators } = useScheduleStore();

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      // makes sure dragging only activates after moving a few pixels
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor)
  );

  const onDragStart = (event: DragStartEvent) => {
    setActiveCourse(event.active.data.current as Course);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveCourse(null);

    if (!event.over) return;
    if (!activeCourse) return;

    const overData = event.over.data.current as PeriodNodeData;

    const { year, semester } = relativeSemesterToYearAndSemester(
      startingYear,
      overData.semesterNumber
    );
    const relevantOccasion = activeCourse.CourseOccasion.find(
      (occ) => {
        if (occ.year !== year || occ.semester !== semester) return false;
        for (const period of occ.periods) {
          if (period.period !== overData.periodNumber + 1) continue;
          if (period.blocks.includes(overData.blockNumber + 1)) return true;
        }
        return false;
      }
    );

    if (!relevantOccasion) return;

    mutators.addCourse({
      course: activeCourse,
      occasion: relevantOccasion,
    });
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <div className="grid [grid-template-columns:auto_1fr] mt-4 relative">
        <Drawer courses={courses} />
        <div className="flex flex-col  gap-4 px-8">
          <MastersRequirementsBar />
          <Schedule />
        </div>
      </div>
      <DragOverlay>
        {activeCourse && <CourseCard dropped={false} course={activeCourse} />}
      </DragOverlay>
    </DndContext>
  );
};

export default DndView;
