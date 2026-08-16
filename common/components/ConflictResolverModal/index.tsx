"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import Translate from "@/common/components/translate/Translate";
import { useIsPhone } from "@/common/hooks/useResponsiveLayout";
import { Course, CourseOccasion } from "@/common/types";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
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
  const isPhone = useIsPhone();
  const { resolveConflict } = useCourseContlictResolver();

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

  if (conflictData.collisions.length === 0) {
    return null;
  }

  if (isPhone) {
    return (
      <BottomSheet
        nested
        open={open}
        onOpenChange={setOpen}
        repositionInputs={false}
      >
        <BottomSheetContent
          data-no-swipe="true"
          className="overflow-hidden"
        >
          <div className="shrink-0 border-b px-4 pb-4 pt-2">
            <BottomSheetTitle className="text-lg font-semibold">
              <Translate text="block_already_occupied" />
            </BottomSheetTitle>
            <BottomSheetDescription className="mt-1 text-sm text-muted-foreground">
              <Translate
                isBold
                text="_selected_block_occupied_by"
                args={{ code: conflictData.course.code }}
              />
            </BottomSheetDescription>
          </div>

          <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-4">
            <ConflictList collisions={conflictData.collisions} />
            <p className="mt-4 text-sm text-muted-foreground">
              <Translate text="how_to_proceed" />
            </p>
          </div>

          <div className="grid shrink-0 gap-2 border-t bg-background px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
            <Button
              type="button"
              onClick={handleResolution("replace")}
              className="min-h-11 w-full rounded-xl"
            >
              <Translate
                text="_replace_block_with_course"
                args={{ courseCode: conflictData.course.code }}
              />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResolution("extra")}
              className="min-h-11 w-full rounded-xl"
            >
              <Translate text="add_to_new_block" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="min-h-11 w-full rounded-xl"
            >
              <Translate text="cancel" />
            </Button>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[500px]">
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

        <div className="mb-4 mt-2">
          <ConflictList collisions={conflictData.collisions} />
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
            <Translate
              text="_replace_block_with_course"
              args={{ courseCode: conflictData.course.code }}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConflictResolverModal;

interface ConflictListProps {
  collisions: Course[];
}

const ConflictList: FC<ConflictListProps> = ({ collisions }) => (
  <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
    <ul className="list-disc space-y-1 pl-4">
      {collisions.map((course) => (
        <li key={course.code}>
          <span className="font-semibold">{course.code}</span> -{" "}
          <CourseTranslate text={course.name} />
        </li>
      ))}
    </ul>
  </div>
);
