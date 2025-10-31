"use client";

import { PeriodNodeData } from "@/components/Dropable";
import { SemesterView } from "@/components/SemesterView";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useAtom } from "jotai";
import { produce } from "immer";
import { range } from 'lodash';
import semestersAtom from "./atoms/semestersAtom";

import { MastersRequirementsBar } from "../components/MastersRequirementsBar";
import { Course } from "./courses";
import { Drawer } from "./Drawer";

const MjukvaraPage: React.FC = () => {
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
    <DndContext onDragEnd={dragEndEventHandler} sensors={sensors}>
      <div className="grid [grid-template-columns:auto_1fr] py-4">
        <div>
          <Drawer />
        </div>
        <div className="flex flex-col  gap-4 px-8">
          <MastersRequirementsBar />
          {SEMESTERS.map((index) => (
            <SemesterView key={index} semesterNumber={index} />
          ))}
        </div>
      </div>
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
    const draggableData = event.active.data.current as Course;
    if (draggableData.semester !== overData.semester + 7) return;
    if (draggableData.period[0] !== overData.period + 1) return;
    if (draggableData.block !== overData.block + 1) return;
    // Valid drop target

    setSemesters((prev) => {
      const activeId = event.active.id as string;
      return produce(prev, (draft) => {
        clearActiveId(draft, activeId);
        draft[overData.semester][overData.period][overData.block] = activeId;
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
export default MjukvaraPage;
