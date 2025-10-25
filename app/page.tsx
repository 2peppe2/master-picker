'use client';

import { DndContext, PointerSensor, useSensor, useSensors, KeyboardSensor, DragEndEvent, UniqueIdentifier, TouchSensor, DragOverlay } from "@dnd-kit/core";
import { CourseCard } from "@/components/CourseCard";
import { Draggable } from "@/components/Draggable";
import { useState } from "react";
import { PeriodNodeData } from "@/components/Dropable";
import { SemesterView } from "@/components/SemesterView";
import semestersStore from "./semesterStore";
import { useAtom } from "jotai";
import { range } from 'lodash';

import { Course, COURSES } from "./courses";
import { Drawer } from "./Drawer";
import { RequirementsBar } from "../components/RequirementsBar";


const MjukvaraPage: React.FC = () => {
  const [semesters, setSemesters] = useAtom(semestersStore);

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
    <DndContext onDragEnd={dragEndEventHandler} sensors={sensors}>
      <div className="grid [grid-template-columns:auto_1fr] py-4">
        <div>
          <Drawer/>
        </div>
        <div className="flex flex-col  gap-4 px-8">
          <RequirementsBar/>
          {SEMESTERS.map((index) => (
            <SemesterView
              key={index}
              semesterNumber={index}

            />
          ))}        
          </div>
        
      </div>


    </DndContext>
  );
  function dragEndEventHandler(event: DragEndEvent) {
    //TODO cleanup
    if (!event.over) {
      setSemesters((prev) => {
        const newPeriod = [...prev];
        const activeId = event.active.id as string;
        // Remove the moved id from any other slot in the period matrix
        for (let i = 0; i < newPeriod.length; i++) {
          for (let j = 0; j < newPeriod[i].length; j++) {
            for (let k = 0; k < newPeriod[i][j]?.length; k++) {
              if (newPeriod[i][j][k] === activeId) {
                newPeriod[i][j][k] = null;
              }
            }
          }
        }
        return newPeriod;
      });
      return;
    }
    const overData = event.over.data.current as PeriodNodeData
    const draggableData = event.active.data.current as Course;
    if (draggableData.semester !== (overData.semester + 7)) return;
    if (draggableData.period[0] !== (overData.period + 1)) return;
    if (draggableData.block !== (overData.block + 1)) return;
    // Valid drop target

    setSemesters((prev) => {
      const newPeriod = [...prev];

      const activeId = event.active.id as string;
      // Remove the moved id from any other slot in the semester matrix
      for (let i = 0; i < newPeriod.length; i++) {
        for (let j = 0; j < newPeriod[i].length; j++) {
          for (let k = 0; k < newPeriod[i][j]?.length; k++) {
            if (newPeriod[i][j][k] === activeId) {
              newPeriod[i][j][k] = null;
            }
          }
        }
      }
      // Add the moved id to the new slot
      newPeriod[overData.semester][overData.period][overData.block] = (activeId as string);
      return newPeriod;
    });
  }

}
export default MjukvaraPage;