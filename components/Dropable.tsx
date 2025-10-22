import React, { act } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useAtom, useAtomValue } from 'jotai';
import semestersStore from '@/app/semesterStore';

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
    const active = useAtomValue(semestersStore)[props.data.semester][props.data.period][props.data.block] !== null;
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
        data: props.data,
    });
    const style: React.CSSProperties = {
        border:  "3px dashed #888",
        borderColor: isOver ? "#06d6a0" : "#888",
        borderRadius: 12, display: "grid", placeItems: "center"
    };

    return (
        <div ref={setNodeRef} style={style} className={` w-40 h-40 flex items-center justify-center`}>
            {props.children}
            
        </div>
    );
}