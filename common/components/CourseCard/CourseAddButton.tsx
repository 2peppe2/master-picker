"use client";

import { useCourseContlictResolver } from "../ConflictResolverModal/hooks/useCourseContlictResolver";
import { useWildcardExpansion } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";
import { useConflictManager } from "../ConflictResolverModal/hooks/useConflictManager";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import ConflictResolverModal from "@/common/components/ConflictResolverModal";
import WildcardExpansionDialog from "../WildcardExpansionDialog";
import { Course, CourseOccasion } from "@/common/types";
import { semestersAtom } from "@/features/dashboard/state/filter/atoms";
import { useIsPhone } from "@/common/hooks/useResponsiveLayout";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import Translate from "@/common/components/translate/Translate";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { Plus, X } from "lucide-react";
import CourseOccasionPicker from "./CourseOccasionPicker";
import { useAtomValue } from "jotai";

interface CourseAddButtonProps {
  course: Course;
}

const CourseAddButton: FC<CourseAddButtonProps> = ({ course }) => {
  const checkWildcardExpansion = useWildcardExpansion();
  const { executeAdd } = useCourseContlictResolver();
  const isPhone = useIsPhone();
  const preferredSemesters = useAtomValue(semestersAtom);

  const [expansionAlertOpen, setExpansionAlertOpen] = useState(false);
  const [occasionPickerOpen, setOccasionPickerOpen] = useState(false);

  const [selectedOccasion, setSelectedOccasion] = useState<CourseOccasion>(
    course.CourseOccasion[0],
  );

  const { conflictData, conflictOpen, setConflictOpen, showConflictIfNeeded } =
    useConflictManager();

  const isMultiOccasion = course.CourseOccasion.length > 1;

  const handleAddAttempt = (occasion: CourseOccasion) => {
    if (showConflictIfNeeded({ course, occasion, strategy: "button" })) {
      setOccasionPickerOpen(false);
      return;
    }

    if (checkWildcardExpansion({ occasion })) {
      setSelectedOccasion(occasion);
      setExpansionAlertOpen(true);
      setOccasionPickerOpen(false);
      return;
    }

    executeAdd({ course, occasion, strategy: "button" });
    setOccasionPickerOpen(false);
  };

  const occasionPicker = (
    <CourseOccasionPicker
      course={course}
      preferredSemesters={preferredSemesters}
      showAddButton={isPhone}
      onSelect={(occasion) => {
        setSelectedOccasion(occasion);
        handleAddAttempt(occasion);
      }}
    />
  );

  return (
    <>
      {conflictOpen && conflictData && (
        <ConflictResolverModal
          open={conflictOpen}
          setOpen={setConflictOpen}
          conflictData={conflictData}
        />
      )}

      <WildcardExpansionDialog
        open={expansionAlertOpen}
        setOpen={setExpansionAlertOpen}
        courseCode={course.code}
        onConfirm={() =>
          executeAdd({
            course,
            occasion: selectedOccasion,
            strategy: "button",
          })
        }
      />

      {isPhone && isMultiOccasion ? (
        <BottomSheet
          open={occasionPickerOpen}
          onOpenChange={setOccasionPickerOpen}
          repositionInputs={false}
        >
          <AddButton
            courseCode={course.code}
            onClick={() => setOccasionPickerOpen(true)}
          />
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
                aria-label="Close add course"
                onClick={() => setOccasionPickerOpen(false)}
                className="-mr-2 -mt-1 size-10 shrink-0 text-muted-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5">
              {occasionPicker}
            </div>
          </BottomSheetContent>
        </BottomSheet>
      ) : isMultiOccasion ? (
          <Popover open={occasionPickerOpen} onOpenChange={setOccasionPickerOpen}>
            <PopoverTrigger asChild>
              <AddButton courseCode={course.code} />
            </PopoverTrigger>
            <PopoverContent
              side="left"
              align="start"
              sideOffset={10}
              className="w-64 p-0"
            >
              {occasionPicker}
            </PopoverContent>
          </Popover>
        ) : (
        <AddButton
          courseCode={course.code}
          onClick={() => handleAddAttempt(course.CourseOccasion[0])}
        />
      )}
    </>
  );
};

export default CourseAddButton;

interface AddButtonProps extends React.ComponentPropsWithRef<typeof Button> {
  courseCode: string;
}

const AddButton = ({ courseCode, ...props }: AddButtonProps) => (
  <Button
    {...props}
    data-no-drag="true"
    aria-label={`Add ${courseCode}`}
    variant="ghost"
    size="icon"
    className={`absolute right-1 top-1 z-20 size-8 text-muted-foreground hover:text-foreground sm:right-1.5 sm:top-1.5 ${
      props.className ?? ""
    }`}
  >
    <Plus className="size-3.5" />
  </Button>
);
