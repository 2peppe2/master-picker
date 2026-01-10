"use client";

import { PeriodNodeData } from "@/components/Droppable";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { MastersRequirementsBar } from "./(mastersRequirementsBar)/MastersRequirementsBar";
import { Course } from "../courses";
import { Drawer } from "./(drawer)/Drawer";
import CourseCard from "@/components/CourseCard";
import { courseWithOccasions } from "./type";
import { useAtom, useSetAtom } from "jotai";
import semestersAtom from "../atoms/semestersAtom";
import { produce } from "immer";
import SchedulePage from "./(schedule)/Schedule";
import { activeCourseAtom } from "../atoms/ActiveCourseAtom";

interface dndViewProps {
    courses: courseWithOccasions[];
};

const DndView: React.FC<dndViewProps> = ({courses}) => {
  const [activeCourse, setActiveCourse] = useAtom(activeCourseAtom);
  const setSemesters = useSetAtom(semestersAtom);

  
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

  return (
    <DndContext
      onDragStart={(event) => {
        setActiveCourse(event.active.data.current as Course);
      }}
      onDragEnd={(event) => {
        setActiveCourse(null);
        dragEndEventHandler(event);
      }}
      sensors={sensors}
    >
      <div className="grid [grid-template-columns:auto_1fr] mt-4 relative">
        <Drawer courses={courses} />
        <div className="flex flex-col  gap-4 px-8">
          <MastersRequirementsBar />
          <SchedulePage />
        </div>
      </div>
      <DragOverlay>
        {activeCourse && <CourseCard dropped={false} course={activeCourse} />}
      </DragOverlay>
    </DndContext>
  );

  function dragEndEventHandler(event: DragEndEvent) {
    if (!event.over) {
      setSemesters((prev) => {
        const activeId = event.active.id as string;
        return produce(prev, (draft) => {
          clearActiveId(draft, activeId);
        });
      });
      return;
    }
    const overData = event.over.data.current as PeriodNodeData;
    if (!activeCourse) return;
    if (activeCourse.semester !== overData.semester + 7) return;
    if (!activeCourse.period.includes(overData.period + 1)) return;
    if (activeCourse.block !== overData.block + 1) return;
    // Valid drop target

    setSemesters((prev) => {
      const activeId = event.active.id as string;
      return produce(prev, (draft) => {
        clearActiveId(draft, activeId);
        draft[overData.semester][overData.period][overData.block] = activeId;
        if (activeCourse.period.length > 1) {
          // Find the other period and set it too
          const otherPeriod =
            activeCourse.period[0] === overData.period + 1
              ? activeCourse.period[1]
              : activeCourse.period[0];
          draft[overData.semester][otherPeriod - 1][overData.block] = activeId;
        }
      });
    });

    function clearActiveId(draft: (string | null)[][][], activeId: string) {
      for (let i = 0; i < draft.length; i++) {
        for (let j = 0; j < draft[i].length; j++) {
          for (let k = 0; k < draft[i][j]?.length; k++) {
            if (draft[i][j][k] === activeId) {
              draft[i][j][k] = null;
            }
          }
        }
      }
    }
  }
};

export default DndView;
