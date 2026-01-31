"use client";

import { useCourseContlictResolver } from "@/components/ConflictResolverModal/hooks/useCourseContlictResolver";
import MastersRequirementsBar from "./(mastersRequirementsBar)/MastersRequirementsBar";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { ConflictResolverModal } from "@/components/ConflictResolverModal";
import { userPreferencesAtom } from "../atoms/UserPreferences";
import { PeriodNodeData } from "@/components/Droppable";
import {
  DndProvider,
  OnDragEndArgs,
  OnDragStartArgs,
} from "@/components/DndProvider";
import CourseCard from "@/components/CourseCard";
import { Course, CourseOccasion } from "./page";
import Schedule from "./(schedule)/Schedule";
import { Drawer } from "./(drawer)/Drawer";
import {
  useScheduleStore,
  WILDCARD_BLOCK_START,
} from "../atoms/schedule/scheduleStore";
import { useAtomValue } from "jotai";
import { FC, useState } from "react";

interface DndViewProps {
  courses: Course[];
}

const DndView: FC<DndViewProps> = ({ courses }) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);

  const { executeAdd } = useCourseContlictResolver();
  const {
    state: { draggedCourse },
    mutators: { addCourseByDrop, addBlockToSemester, setDraggedCourse },
    getters: { getSlotCourse, getOccasionCollisions, getSlotBlocks },
  } = useScheduleStore();

  const [alertData, setAlertData] = useState<{
    course: Course;
    occasion: CourseOccasion;
    collisions: Course[];
    dropSlot: { block: number; period: number };
  } | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const onDragEnd = (event: OnDragEndArgs) => {
    const droppedCourse = draggedCourse;
    setDraggedCourse(null);

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
      });

      return;
    }

    const currentCollisions = getOccasionCollisions({
      occasion: finalOccasion,
    });

    const slot = getSlotCourse({
      semester: overData.semesterNumber,
      period: targetPeriod,
      block: targetBlock,
    });

    if (slot || currentCollisions.length > 0) {
      setAlertData({
        course: droppedCourse,
        occasion: finalOccasion,
        collisions: currentCollisions,
        dropSlot: { block: targetBlock, period: targetPeriod },
      });
      setAlertOpen(true);
    } else {
      executeAdd({
        course: droppedCourse,
        occasion: finalOccasion,
        startegy: "dropped",
      });
    }
  };

  return (
    <DndProvider<Course>
      onDragEnd={onDragEnd}
      onDragStart={(event: OnDragStartArgs<Course>) =>
        setDraggedCourse(event.active)
      }
      renderDragged={({ active }) => (
        <CourseCard dropped={false} course={active} />
      )}
    >
      <div className="grid [grid-template-columns:auto_1fr] mt-4 relative">
        {alertOpen && alertData && (
          <ConflictResolverModal
            strategy="dropped"
            open={alertOpen}
            setOpen={setAlertOpen}
            {...alertData}
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
