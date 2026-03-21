"use client";

import { Course, CourseOccasion } from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import {
  StrategyType,
  useCourseContlictResolver,
} from "./hooks/useCourseContlictResolver";
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
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import { Trans } from "react-i18next";
import { FC } from "react";

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

export const ConflictResolverModal: FC<ConflictResolverModalProps> = ({
  open,
  setOpen,
  conflictData,
}) => {
  const t = useCommonTranslate();
  const { resolveConflict } = useCourseContlictResolver();

  if (conflictData.collisions.length === 0) {
    return null;
  }

  const handleResolution =
    (type: "replace" | "extra") => (e: React.MouseEvent) => {
      e.preventDefault();
      resolveConflict({
        ...conflictData,
        type,
      });
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
          <AlertDialogTitle>{t("block_already_occupied")}</AlertDialogTitle>
          <AlertDialogDescription>
            <Trans
              i18nKey="selected_block_occupied_by"
              values={{ code: conflictData.course.code }}
              components={{ 1: <strong /> }}
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
          {t("how_to_proceed")}
        </p>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          <AlertDialogCancel className="mt-0">{t("cancel")}</AlertDialogCancel>

          <Button variant="outline" onClick={handleResolution("extra")}>
            {t("add_to_new_block")}
          </Button>

          <AlertDialogAction onClick={handleResolution("replace")}>
            {t("replace")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
