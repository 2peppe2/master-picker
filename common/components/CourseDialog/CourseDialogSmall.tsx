"use client";

import { cn } from "@/lib/utils";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { Course } from "@/common/types";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";
import { FC } from "react";
import CourseMetadata from "./CourseMetadata";
import DialogTabs from "./DialogTabs";
import { useCloseAfterCourseAdded } from "./hooks/useCloseAfterCourseAdded";
import { useCourseDialogState } from "./hooks/useCourseDialogState";
import { useOverlayHistory } from "./hooks/useOverlayHistory";

interface CourseDialogSmallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  showAdd?: boolean;
  preferredSemesters?: number[];
}

const CourseDialogSmall: FC<CourseDialogSmallProps> = ({
  open,
  onOpenChange,
  course,
  showAdd = true,
  preferredSemesters,
}) => {
  const { activeTab, setActiveTab, setInitModule, tabs, translate } =
    useCourseDialogState({
      course,
      open,
      showAdd,
      preferredSemesters,
    });

  const handleOpenChange = useOverlayHistory(open, onOpenChange);

  useCloseAfterCourseAdded({
    courseCode: course.code,
    onClose: () => handleOpenChange(false),
    open,
  });

  return (
    <BottomSheet
      open={open}
      onOpenChange={handleOpenChange}
      direction="bottom"
      repositionInputs={false}
      initialSnapPoint={1}
    >
      <BottomSheetContent className="w-full gap-0 overflow-hidden p-0">
        <header
          className={cn(
            "relative shrink-0 border-b bg-background px-4 pb-3",
            "pt-[calc(0.75rem+env(safe-area-inset-top))]",
            "text-left",
          )}
        >
          <div className="min-w-0 pr-20">
            <BottomSheetTitle className="text-xl font-bold leading-tight">
              {course.code}
            </BottomSheetTitle>
            <BottomSheetDescription
              className={cn(
                "mt-0.5 line-clamp-2 text-sm leading-snug",
                "text-muted-foreground",
              )}
            >
              <CourseTranslate text={course.name} />
            </BottomSheetDescription>
          </div>

          <div
            className={cn(
              "absolute right-3",
              "top-[calc(0.5rem+env(safe-area-inset-top))] flex",
              "items-center gap-1",
            )}
          >
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-11 rounded-full"
            >
              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={translate("_course_more_info")}
              >
                <ExternalLink className="size-4.5" />
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleOpenChange(false)}
              className="size-11 rounded-full"
              aria-label={translate("_course_close")}
            >
              <X className="size-5" />
            </Button>
          </div>

          <CourseMetadata course={course} summaryOnly />
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DialogTabs
            tabs={tabs}
            value={activeTab}
            phone
            onValueChange={(val) => {
              setActiveTab(val);
              if (val !== "statistics") setInitModule(undefined);
            }}
          />
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default CourseDialogSmall;
