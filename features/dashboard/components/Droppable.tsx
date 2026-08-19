"use client";

import DropTargetVisual from "./DropTargetVisual";
import { WILDCARD_BLOCK_START } from "@/features/dashboard/state/schedule/atoms";
import {
  isCurrentDropTargetAtom,
  isValidDropTargetAtom,
} from "@/features/dashboard/state/drag/atoms";
import { useDroppable } from "@dnd-kit/core";
import { useAtomValue } from "jotai";
import { FC, ReactNode } from "react";

export type PeriodNodeData = {
  semesterNumber: number;
  periodNumber: number;
  blockNumber: number;
};

interface DroppableProps {
  id: string;
  data: PeriodNodeData;
  children: ReactNode;
  occupied?: boolean;
}

export const Droppable: FC<DroppableProps> = ({
  children,
  data,
  id,
  occupied = false,
}) => {
  const { setNodeRef } = useDroppable({ id, data });
  const isValidDropTarget = useAtomValue(isValidDropTargetAtom(id));
  const isOver = useAtomValue(isCurrentDropTargetAtom(id));

  return (
    <DropTargetVisual
      ref={setNodeRef}
      occupied={occupied}
      isOver={isOver}
      isValidDropTarget={isValidDropTarget}
      isWildcard={data.blockNumber >= WILDCARD_BLOCK_START}
    >
      {children}
    </DropTargetVisual>
  );
};
