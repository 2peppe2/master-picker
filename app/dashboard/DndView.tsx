"use client";

import MastersRequirementsBar from "./(mastersRequirementsBar)/MastersRequirementsBar";
import {
  relativeSemesterToYearAndSemester,
  yearAndSemesterToRelativeSemester,
} from "@/lib/semesterYearTranslations";
import {
  useScheduleStore,
  WILDCARD_BLOCK_START,
} from "../atoms/schedule/scheduleStore";
import { userPreferencesAtom } from "../atoms/UserPreferences";
import { activeCourseAtom } from "../atoms/ActiveCourseAtom";
import { PeriodNodeData } from "@/components/Droppable";
import CourseCard from "@/components/CourseCard";
import { Course, CourseOccasion } from "./page";
import { useAtom, useAtomValue } from "jotai";
import Schedule from "./(schedule)/Schedule";
import AddAlert from "@/components/AddAlert";
import { Drawer } from "./(drawer)/Drawer";
import { FC, useState } from "react";
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

interface DndViewProps {
  courses: Course[];
}

const DndView: FC<DndViewProps> = ({ courses }) => {
  const [activeCourse, setActiveCourse] = useAtom(activeCourseAtom);
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const {
    mutators: { addCourseByDrop, addBlockToSemester },
    getters: { getSlotCourse, getOccasionCollisions, getSlotBlocks },
  } = useScheduleStore();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertCourse, setAlertCourse] = useState<Course | null>(null);

  const [dropTarget, setDropTarget] = useState<{
    block: number;
    period: number;
  } | null>(null);
  const [selectedOccasion, setSelectedOccasion] =
    useState<CourseOccasion | null>(null);
  const [collisions, setCollisions] = useState<Course[]>([]);

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

    const relevantOccasion = droppedCourse.CourseOccasion.find(
      (occ) => occ.year === year && occ.semester === semester,
    );

    if (!relevantOccasion) return;

    const relevantPeriod = relevantOccasion.periods.find(
      (p) => p.period === targetPeriod,
    );

    if (!relevantPeriod) return;

    const isWildcardDrop = targetBlock > WILDCARD_BLOCK_START;

    const isValidDrop =
      isWildcardDrop || relevantPeriod.blocks.includes(targetBlock);

    if (!isValidDrop) return;

    const currentBlocks = getSlotBlocks({
      semester: overData.semesterNumber,
      period: targetPeriod,
    });

    const isGhostDrop = overData.blockNumber >= currentBlocks.length;

    let finalOccasion = relevantOccasion;
    if (isWildcardDrop) {
      finalOccasion = {
        ...relevantOccasion,
        periods: relevantOccasion.periods.map((p) => ({ ...p, blocks: [] })),
      };
    }

    if (isGhostDrop) {
      addBlockToSemester({ semester: overData.semesterNumber });

      addCourseByDrop({
        course: droppedCourse,
        occasion: finalOccasion,
        period: targetPeriod,
        block: targetBlock,
      });

      return;
    }

    const currentCollisions = getOccasionCollisions({
      occasion: finalOccasion,
    });

    setSelectedOccasion(finalOccasion);
    setCollisions(currentCollisions);

    const slot = getSlotCourse({
      semester: overData.semesterNumber,
      period: targetPeriod,
      block: targetBlock,
    });

    if (slot || currentCollisions.length > 0) {
      // Check both specific slot and partials
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

  const handleAddAsExtra = (occasion: CourseOccasion) => {
    const relativeSemester = yearAndSemesterToRelativeSemester(
      startingYear,
      occasion.year,
      occasion.semester,
    );

    addBlockToSemester({ semester: relativeSemester });

    const wildcardOccasion = {
      ...occasion,
      periods: occasion.periods.map((p) => ({ ...p, blocks: [] })),
    };

    if (!dropTarget) {
      return;
    }

    if (!alertCourse) {
      return;
    }

    addCourseByDrop({
      course: alertCourse,
      occasion: wildcardOccasion,
      block: dropTarget.block,
      period: dropTarget.period,
    });
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
            onReplace={() =>
              addCourseByDrop({
                course: alertCourse,
                occasion: selectedOccasion,
                block: dropTarget.block,
                period: dropTarget.period,
              })
            }
            onAddAsExtra={() => {
              handleAddAsExtra(selectedOccasion);
            }}
            open={alertOpen}
            setOpen={setAlertOpen}
            collisions={collisions}
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
