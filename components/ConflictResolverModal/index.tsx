"use client";

import Translate from "@/common/components/translate/Translate";
import { Course, CourseOccasion } from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import {
  StrategyType,
  useCourseContlictResolver,
} from "./hooks/useCourseContlictResolver";
import { FC, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export interface ConflictData {
  course: Course;
  occasion: CourseOccasion;
  collisions: Course[];
  strategy: StrategyType;
}

interface ConflictResolverModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  conflictData: ConflictData;
}

const ConflictResolverModal: FC<ConflictResolverModalProps> = ({
  open,
  setOpen,
  conflictData,
}) => {
  const { resolveConflict } = useCourseContlictResolver();

  if (conflictData.collisions.length === 0) {
    return null;
  }

  const handleResolution = useCallback(
    (type: "replace" | "extra") => (e: React.MouseEvent) => {
      e.preventDefault();
      resolveConflict({
        ...conflictData,
        type,
      });
      setOpen(false);
    },
    [resolveConflict, conflictData, setOpen],
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        onPointerDownCapture={(e) => e.stopPropagation()}
        onMouseDownCapture={(e) => e.stopPropagation()}
        onTouchStartCapture={(e) => e.stopPropagation()}
        className="sm:max-w-[500px]"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Translate text="block_already_occupied" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Translate
              isBold
              text="_selected_block_occupied_by"
              args={{ code: conflictData.course.code }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="text-sm mt-2 mb-4 text-muted-foreground bg-muted/50 p-3 rounded-md">
          <ul className="list-disc pl-4 space-y-1">
            {conflictData.collisions.map((c) => (
              <li key={c.code}>
                <span className="font-semibold">{c.code}</span> - {c.name}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          <Translate text="how_to_proceed" />
        </p>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          <AlertDialogCancel className="mt-0 cursor-pointer">
            <Translate text="cancel" />
          </AlertDialogCancel>

          <Button variant="outline" onClick={handleResolution("extra")}>
            <Translate text="add_to_new_block" />
          </Button>

          <AlertDialogAction
            className="cursor-pointer"
            onClick={handleResolution("replace")}
          >
            <Translate text="replace" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConflictResolverModal;
