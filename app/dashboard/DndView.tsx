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
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { useScheduleStore } from "../atoms/schedule/scheduleStore";
import { userPreferencesAtom } from "../atoms/UserPreferences";
import { activeCourseAtom } from "../atoms/ActiveCourseAtom";
import CourseCard from "@/components/CourseCard";
import { Course, CourseOccasion } from "./page";
import { useAtom, useAtomValue } from "jotai";
import Schedule from "./(schedule)/Schedule";
import AddAlert from "@/components/AddAlert";
import { Drawer } from "./(drawer)/Drawer";
import { FC, useState } from "react";

interface DndViewProps {
  courses: Course[];
}

const DndView: FC<DndViewProps> = ({ courses }) => {
  const [activeCourse, setActiveCourse] = useAtom(activeCourseAtom);
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const {
    mutators: { addCourse, addBlockToSemester },
    getters: {
      findMatchingOccasion,
      getSlotCourse,
      getOccasionCollisions,
      checkWildcardExpansion,
    },
  } = useScheduleStore();
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

    const relevantOccasion = findMatchingOccasion({
      course: droppedCourse,
      block: overData.blockNumber + 1,
      period: overData.periodNumber + 1,
      year,
      semester,
    });

    if (!relevantOccasion) return;

    const isGhostDrop = checkWildcardExpansion({ occasion: relevantOccasion });

    if (isGhostDrop) {
      addBlockToSemester({ semester: overData.semesterNumber });

      const wildcardOccasion = {
        ...relevantOccasion,
        periods: relevantOccasion.periods.map((p) => ({ ...p, blocks: [] })),
      };

      setTimeout(() => {
        addCourse({
          action: "dropped",
          course: droppedCourse,
          occasion: wildcardOccasion,
        });
      }, 0);

      return;
    }

    const slot = getSlotCourse({
      semester: overData.semesterNumber,
      period: overData.periodNumber + 1,
      block: overData.blockNumber + 1,
    });

    if (slot) {
      setSelectedOccasion(relevantOccasion);
      setAlertCourse(droppedCourse);
      setAlertOpen(true);
    } else {
      addCourse({
        action: "dropped",
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
              addCourse({
                action: "default",
                course: alertCourse,
                occasion: selectedOccasion,
              })
            }
            open={alertOpen}
            setOpen={setAlertOpen}
            collisions={getOccasionCollisions({
              occasion: selectedOccasion,
            })}
          />
        )}
        <Drawer courses={courses} />
        <div className="flex flex-col gap-4 px-8 min-w-0">
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
