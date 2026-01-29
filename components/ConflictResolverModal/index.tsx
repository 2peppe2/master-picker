"use client";

import { Course, CourseOccasion } from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
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
import { FC } from "react";
import {
  StrategyType,
  useCourseContlictResolver,
} from "./hooks/useCourseContlictResolver";

interface ConflictResolverModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  course: Course;
  occasion: CourseOccasion;
  collisions: Course[];
  strategy: StrategyType;
}

export const ConflictResolverModal: FC<ConflictResolverModalProps> = ({
  open,
  setOpen,
  course,
  occasion,
  collisions,
  strategy,
}) => {
  const { resolveConflict } = useCourseContlictResolver();

  if (collisions.length === 0) {
    return null;
  }

  const handleResolution =
    (type: "replace" | "extra") => (e: React.MouseEvent) => {
      e.preventDefault();
      resolveConflict(type, course, occasion, collisions, strategy);
      setOpen(false);
    };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        onPointerDownCapture={(e) => e.stopPropagation()}
        onMouseDownCapture={(e) => e.stopPropagation()}
        onTouchStartCapture={(e) => e.stopPropagation()}
        className="sm:max-w-[500px]"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Block already occupied</AlertDialogTitle>
          <AlertDialogDescription>
            The selected block for <strong>{course.code}</strong> is already
            occupied by:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="text-sm mt-2 mb-4 text-muted-foreground bg-muted/50 p-3 rounded-md">
          <ul className="list-disc pl-4 space-y-1">
            {collisions.map((c) => (
              <li key={c.code}>
                <span className="font-semibold">{c.code}</span> - {c.name}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          How would you like to proceed?
        </p>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>

          <Button variant="outline" onClick={handleResolution("extra")}>
            Add to new block
          </Button>

          <AlertDialogAction onClick={handleResolution("replace")}>
            Replace
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
