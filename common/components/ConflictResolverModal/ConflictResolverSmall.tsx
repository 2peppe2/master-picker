"use client";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import Translate from "@/common/components/translate/Translate";
import { ConflictResolutionProps } from "./types";
import ConflictList from "./components/ConflictList";
import { Button } from "@/components/ui/button";
import { FC } from "react";

const ConflictResolverSmall: FC<ConflictResolutionProps> = ({
  open,
  setOpen,
  conflictData,
  onResolve,
}) => (
  <BottomSheet nested open={open} onOpenChange={setOpen} repositionInputs={false}>
    <BottomSheetContent data-no-swipe="true" className="overflow-hidden">
      <div className="shrink-0 border-b px-4 pb-4 pt-2">
        <BottomSheetTitle className="text-lg font-semibold">
          <Translate text="_block_already_occupied" />
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
          <Translate text="_how_to_proceed" />
        </p>
      </div>

      <div className="grid shrink-0 gap-2 border-t bg-background px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
        <Button
          type="button"
          onClick={onResolve("replace")}
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
          onClick={onResolve("extra")}
          className="min-h-11 w-full rounded-xl"
        >
          <Translate text="_add_to_new_block" />
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

export default ConflictResolverSmall;
