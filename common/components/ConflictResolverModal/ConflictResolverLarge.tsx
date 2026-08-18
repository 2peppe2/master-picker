"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Translate from "@/common/components/translate/Translate";
import { ConflictResolutionProps } from "./types";
import ConflictList from "./components/ConflictList";
import { Button } from "@/components/ui/button";
import { FC } from "react";

const ConflictResolverLarge: FC<ConflictResolutionProps> = ({
  open,
  setOpen,
  conflictData,
  onResolve,
}) => (
  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent className="sm:max-w-[500px]">
      <AlertDialogHeader>
        <AlertDialogTitle>
          <Translate text="_block_already_occupied" />
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
        <Translate text="_how_to_proceed" />
      </p>

      <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
        <AlertDialogCancel className="mt-0 cursor-pointer">
          <Translate text="cancel" />
        </AlertDialogCancel>

        <Button variant="outline" onClick={onResolve("extra")}>
          <Translate text="_add_to_new_block" />
        </Button>

        <AlertDialogAction
          className="cursor-pointer"
          onClick={onResolve("replace")}
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

export default ConflictResolverLarge;
