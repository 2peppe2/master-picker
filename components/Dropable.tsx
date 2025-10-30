import { Course } from '@/app/courses';
import semestersAtom from '@/app/semestersAtom';
import { useDroppable } from '@dnd-kit/core';
import { useAtomValue } from 'jotai';
import React from 'react';

type DroppableProps = {
    id: string;
    data: PeriodNodeData;
    children: React.ReactNode;
}
export type PeriodNodeData = {
    semester: number;
    period: number;
    block: number;

}

export function Droppable(props: DroppableProps) {
    const { semester, period, block } = props.data;
    const dropped = useAtomValue(semestersAtom)[semester][period][block] !== null;
    const { isOver, setNodeRef, active } = useDroppable({
        id: props.id,
        data: props.data,
    });
   
    let overStyles: string = isOver ? "border-red-500" : "border-zinc-500";

    if (isOver && active !== null) {
        const draggableData = active.data.current as Course;
        if (draggableData.semester === (semester + 7)
            && draggableData.period[0] === (period + 1)
            && draggableData.block === (block + 1)) {
            // Valid drop target
            overStyles = "border-teal-500"
        }
    }

    return (
        <div ref={setNodeRef}  className={`w-40 h-40 flex items-center justify-center ${overStyles } border-4 border-dashed rounded-2xl`}>
            {props.children}
            
        </div>
    );
}