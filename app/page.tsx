'use client';

import { DndContext, PointerSensor, useSensor, useSensors, KeyboardSensor, DragEndEvent, UniqueIdentifier, TouchSensor } from "@dnd-kit/core";
import { CourseCard } from "@/components/CourseCard";
import { Draggable } from "@/components/Draggable";
import { useState } from "react";
import { PeriodNodeData } from "@/components/Dropable";
import { SemesterView } from "@/components/SemesterView";
import semestersStore from "./semesterStore";
import { useAtom } from "jotai";
import { range } from 'lodash';

import { Course, COURSES } from "./courses";


const MjukvaraPage: React.FC = () => {
  const [semesters, setSemesters] = useAtom(semestersStore);
  const notInDropped = (course: Course) => !semesters.flat(3).includes(course.courseCode)

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
      <div className="grid grid-cols-3">
        <div className="col-span-2">
          {SEMESTERS.map((index) => (
            <SemesterView
              key={index}
              semesterNumber={index}

            />
          ))}        </div>
        <div className="col-span-1 p-5">
          <div className="grid grid-cols-2 justify-items-center gap-4 p-4">
            {Object.values(COURSES).filter(notInDropped).map((course) => (
            <Draggable key={course.courseCode} id={course.courseCode} data={course}>
              <CourseCard
                {...course}
              />
            </Draggable>
          ))}
          </div>
          
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