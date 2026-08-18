"use client";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import Translate from "@/common/components/translate/Translate";
import CourseOccasionPicker from "../CourseOccasionPicker";
import { OccasionPickerViewProps } from "./types";
import { Button } from "@/components/ui/button";
import AddButton from "./components/AddButton";
import { X } from "lucide-react";
import { FC } from "react";

const OccasionPickerSmall: FC<OccasionPickerViewProps> = ({
  course,
  isOpen,
  onOpenChange,
  preferredSemesters,
  onSelect,
}) => {
  const translate = useCommonTranslate();

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={onOpenChange}
      repositionInputs={false}
    >
      <AddButton courseCode={course.code} onClick={() => onOpenChange(true)} />

      <BottomSheetContent className="overflow-hidden">
        <div className="flex shrink-0 items-start gap-3 px-5 pb-3 pt-2">
          <div className="min-w-0 flex-1">
            <BottomSheetTitle className="text-lg font-semibold tracking-tight">
              <Translate text="_add_course" args={{ courseCode: course.code }} />
            </BottomSheetTitle>
            <BottomSheetDescription className="mt-0.5 truncate text-sm text-muted-foreground">
              <CourseTranslate text={course.name} />
            </BottomSheetDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={translate("close")}
            onClick={() => onOpenChange(false)}
            className="-mr-2 -mt-1 size-10 shrink-0 text-muted-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          <CourseOccasionPicker
            course={course}
            preferredSemesters={preferredSemesters}
            showAddButton
            onSelect={onSelect}
          />
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default OccasionPickerSmall;
