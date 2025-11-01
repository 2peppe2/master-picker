"use client";

import { PeriodNodeData } from "@/components/Droppable";
import { SemesterView } from "@/components/SemesterView";
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
import { useAtom } from "jotai";
import { produce } from "immer";
import { range } from "lodash";
import semestersAtom from "./atoms/semestersAtom";

import { MastersRequirementsBar } from "../components/MastersRequirementsBar";
import { Course } from "./courses";
import { Drawer } from "@/components/Drawer";
import { useState } from "react";
import CourseCard from "@/components/CourseCard";

const StartPage: React.FC = () => {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [semesters, setSemesters] = useAtom(semestersAtom);

  const SEMESTERS = range(0, semesters.length);
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
        <Drawer activeCourse={activeCourse} />
        <div className="flex flex-col  gap-4 px-8">
          <MastersRequirementsBar />
          {SEMESTERS.map((index) => (
            <SemesterView
              key={index}
              semesterNumber={index}
              activeCourse={activeCourse}
            />
          ))}
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

export default StartPage;
