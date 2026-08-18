"use client";

import { cn } from "@/lib/utils";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { Course } from "@/common/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";
import { FC } from "react";
import CourseMetadata from "./CourseMetadata";
import CourseDialogTabs from "./components/CourseDialogTabs";
import { useCloseAfterCourseAdded } from "./hooks/useCloseAfterCourseAdded";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useOverlayHistory } from "./hooks/useOverlayHistory";

interface CourseDialogLandscapeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  showAdd?: boolean;
  preferredSemesters?: number[];
}

/**
 * Phone-in-landscape shell: edge-to-edge, with the tabs as a vertical rail.
 *
 * A centred dialog wastes the only axis this viewport has to spare, and a
 * bottom sheet spends its scarce height on chrome. Going fullscreen with the
 * tabs on the left leaves nearly the whole 340-ish pixels for content.
 */
const CourseDialogLandscape: FC<CourseDialogLandscapeProps> = ({
  open,
  onOpenChange,
  course,
  showAdd = true,
  preferredSemesters,
}) => {
  const translate = useCommonTranslate();

  const handleOpenChange = useOverlayHistory(open, onOpenChange);

  useCloseAfterCourseAdded({
    courseCode: course.code,
    onClose: () => handleOpenChange(false),
    open,
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        // The built-in close is positioned against the padding box, so it would
        // sit under the notch however the shell is inset. The header renders
        // its own instead.
        showCloseButton={false}
        className={cn(
          "inset-0 flex h-[100dvh] w-full translate-x-0 translate-y-0",
          "flex-col gap-0 overflow-hidden rounded-none border-0 p-0",
          "shadow-none",
          // max-w-none alone loses to the base sm:max-w-lg: tailwind-merge
          // never lets an unprefixed class beat a prefixed one, and every
          // landscape phone is wider than the sm breakpoint.
          "max-w-none sm:max-w-none",
          "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
          "pb-[env(safe-area-inset-bottom)]",
        )}
      >
        <DialogHeader
          className={cn(
            "relative shrink-0 gap-1.5 border-b bg-background text-left",
            // Even inset on both axes -- --density-y is tuned for stacked
            // dashboard chrome and left the title crowding the divider.
            "px-4 py-2.5",
            // Clears the two action buttons pinned to the top right.
            "pe-[calc(5rem+env(safe-area-inset-right))]",
          )}
        >
          <DialogTitle className="text-base font-bold leading-tight">
            {course.code}
          </DialogTitle>
          <DialogDescription
            className={cn(
              "line-clamp-1 text-xs leading-snug",
              "text-muted-foreground",
            )}
          >
            <CourseTranslate text={course.name} />
          </DialogDescription>

          <CourseMetadata course={course} summaryOnly />

          <div className="absolute right-3 top-2 flex items-center gap-1">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-(--touch-sm) rounded-full"
            >
              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={translate("_course_more_info")}
              >
                <ExternalLink className="size-4" />
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleOpenChange(false)}
              className="size-(--touch-sm) rounded-full"
              aria-label={translate("course_close")}
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <CourseDialogTabs
            course={course}
            open={open}
            chrome="rail"
            showAdd={showAdd}
            preferredSemesters={preferredSemesters}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDialogLandscape;
