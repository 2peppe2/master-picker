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
import {
  useScheduleStore,
  WILDCARD_BLOCK_START,
} from "../atoms/schedule/scheduleStore";
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
    mutators: { addCourseByDrop, addBlockToSemester },
    getters: {
      findMatchingOccasion,
      getSlotCourse,
      getOccasionCollisions,
      checkWildcardExpansion,
    },
  } = useScheduleStore();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertCourse, setAlertCourse] = useState<Course | null>(null);

  const [dropTarget, setDropTarget] = useState<{
    block: number;
    period: number;
  } | null>(null);
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
    setDropTarget(null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const droppedCourse = activeCourse;
    setActiveCourse(null);

    if (!event.over) return;
    if (!droppedCourse) return;

    const overData = event.over.data.current as PeriodNodeData;
    const targetPeriod = overData.periodNumber + 1;
    const targetBlock = overData.blockNumber + 1;

    const { year, semester } = relativeSemesterToYearAndSemester(
      startingYear,
      overData.semesterNumber,
    );

    const relevantOccasion = findMatchingOccasion({
      course: droppedCourse,
      block: targetBlock,
      period: targetPeriod,
      year,
      semester,
    });

    if (!relevantOccasion) return;

    // 1. Check if we dropped into the wildcard zone (Block > 4)
    const isWildcardDrop = targetBlock > WILDCARD_BLOCK_START;

    // 2. If so, convert the occasion to a wildcard occasion (remove fixed block constraints)
    //    This ensures all periods of this course are treated as wildcard periods.
    let finalOccasion = relevantOccasion;
    if (isWildcardDrop) {
      finalOccasion = {
        ...relevantOccasion,
        periods: relevantOccasion.periods.map((p) => ({ ...p, blocks: [] })),
      };
    }

    // 3. Check for expansion using the (potentially wildcard) occasion
    const isGhostDrop = checkWildcardExpansion({ occasion: finalOccasion });

    if (isGhostDrop) {
      addBlockToSemester({ semester: overData.semesterNumber });

      setTimeout(() => {
        addCourseByDrop({
          course: droppedCourse,
          occasion: finalOccasion,
          period: targetPeriod,
          block: targetBlock,
        });
      }, 0);

      return;
    }

    const slot = getSlotCourse({
      semester: overData.semesterNumber,
      period: targetPeriod,
      block: targetBlock,
    });

    if (slot) {
      setSelectedOccasion(finalOccasion);
      setAlertCourse(droppedCourse);
      setDropTarget({ block: targetBlock, period: targetPeriod });
      setAlertOpen(true);
    } else {
      addCourseByDrop({
        course: droppedCourse,
        occasion: finalOccasion,
        period: targetPeriod,
        block: targetBlock,
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
        {alertOpen && alertCourse && selectedOccasion && dropTarget && (
          <AddAlert
            course={alertCourse}
            primaryAction={() =>
              addCourseByDrop({
                course: alertCourse,
                occasion: selectedOccasion,
                block: dropTarget.block,
                period: dropTarget.period,
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
