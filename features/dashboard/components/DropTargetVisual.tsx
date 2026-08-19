"use client";

import React, { ReactNode } from "react";
import { getDropTargetVisualStyles } from "./getDropTargetVisualStyles";

interface DropTargetVisualProps {
  children: ReactNode;
  isOver: boolean;
  isValidDropTarget: boolean;
  isWildcard: boolean;
  occupied: boolean;
}

const DropTargetVisual = React.memo(
  React.forwardRef<HTMLDivElement, DropTargetVisualProps>(
    ({ children, isOver, isValidDropTarget, isWildcard, occupied }, ref) => {
      const { stateStyles, overlayClassName } = getDropTargetVisualStyles({
        isOver,
        isValidDropTarget,
        isWildcard,
        occupied,
      });

      return (
        <div
          ref={ref}
          className={`relative flex h-full w-full min-w-0 shrink-0 items-center justify-center rounded-xl transition-all duration-200 motion-reduce:transition-none sm:rounded-2xl ${stateStyles}`}
        >
          {children}
          {overlayClassName && <div className={overlayClassName} />}
        </div>
      );
    },
  ),
);

DropTargetVisual.displayName = "DropTargetVisual";

export default DropTargetVisual;
