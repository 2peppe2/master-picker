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

import MastersRequirementsBar from "./(mastersRequirementsBar)/MastersRequirementsBar";
import { Drawer } from "./(drawer)/Drawer";
import CourseCard from "@/components/CourseCard";
import { useAtom, useAtomValue } from "jotai";
import { useScheduleStore } from "../atoms/schedule/scheduleStore";
import Schedule from "./(schedule)/Schedule";
import { activeCourseAtom } from "../atoms/ActiveCourseAtom";
import { FC, Suspense, useState } from "react";
import { Course, CourseOccasion } from "./page";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "../atoms/UserPreferences";
import AddAlert from "@/components/AddAlert";

interface DndViewProps {
  courses: Course[];
}

const DndView: FC<DndViewProps> = ({ courses }) => {
  const [activeCourse, setActiveCourse] = useAtom(activeCourseAtom);
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const { mutators, getters } = useScheduleStore();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertCourse, setAlertCourse] = useState<Course | null>(null);
  const [selectedOccasion, setSelectedOccasion] =
    useState<CourseOccasion | null>(null);

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
    useSensor(KeyboardSensor),
  );

  const onDragStart = (event: DragStartEvent) => {
    setActiveCourse(event.active.data.current as Course);
    setAlertOpen(false);
    setAlertCourse(null);
    setSelectedOccasion(null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const droppedCourse = activeCourse;
    setActiveCourse(null);

    if (!event.over) return;
    if (!droppedCourse) return;

    const overData = event.over.data.current as PeriodNodeData;

    const { year, semester } = relativeSemesterToYearAndSemester(
      startingYear,
      overData.semesterNumber,
    );
    const relevantOccasion = droppedCourse.CourseOccasion.find((occ) => {
      if (occ.year !== year || occ.semester !== semester) return false;
      for (const period of occ.periods) {
        if (period.period !== overData.periodNumber + 1) continue;
        if (period.blocks.includes(overData.blockNumber + 1)) return true;
      }
      return false;
    });

    if (!relevantOccasion) return;
    const slot = getters.getSlotCourse({
      semester: overData.semesterNumber,
      period: overData.periodNumber + 1,
      block: overData.blockNumber + 1,
    });
    console.log(slot);
    if (slot) {
      setSelectedOccasion(relevantOccasion);
      setAlertCourse(droppedCourse);
      setAlertOpen(true);
    } else {
      mutators.addCourse({
        course: droppedCourse,
        occasion: relevantOccasion,
      });
    }
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <div className="grid [grid-template-columns:auto_1fr] mt-4 relative">
        {alertOpen && alertCourse && selectedOccasion && (
          <AddAlert
            course={alertCourse}
            primaryAction={() =>
              mutators.addCourse({
                course: alertCourse,
                occasion: selectedOccasion,
              })
            }
            open={alertOpen}
            setOpen={setAlertOpen}
            collisions={getters.getOccasionCollisions({
              occasion: selectedOccasion,
            })}
          />
        )}
        <Drawer courses={courses} />
        <div className="flex flex-col  gap-4 px-8">
          <Suspense fallback={<div>Loading....</div>}>
            <MastersRequirementsBar />
          </Suspense>

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
