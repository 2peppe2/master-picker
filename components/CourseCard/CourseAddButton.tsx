"use client";

import { useCourseContlictResolver } from "../ConflictResolverModal/hooks/useCourseContlictResolver";
import { useConflictManager } from "../ConflictResolverModal/hooks/useConflictManager";
import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { useScheduleGetters } from "@/app/atoms/schedule/hooks/useScheduleGetters";
import { ConflictResolverModal } from "@/components/ConflictResolverModal";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { WildcardExpansionDialog } from "../WildcardExpansionDialog";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { Course, CourseOccasion } from "@/app/dashboard/page";
import { Button } from "../ui/button";
import { useAtomValue } from "jotai";
import { FC, useState } from "react";
import { Plus } from "lucide-react";

interface CourseAddButtonProps {
  course: Course;
}

const CourseAddButton: FC<CourseAddButtonProps> = ({ course }) => {
  const { checkWildcardExpansion } = useScheduleGetters();
  const { executeAdd } = useCourseContlictResolver();

  const [expansionAlertOpen, setExpansionAlertOpen] = useState(false);

  const [selectedOccasion, setSelectedOccasion] = useState<CourseOccasion>(
    course.CourseOccasion[0],
  );
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { conflictData, conflictOpen, setConflictOpen, showConflictIfNeeded } =
    useConflictManager();

  const isMultiOccasion = course.CourseOccasion.length > 1;

  const handleAddAttempt = (occasion: CourseOccasion) => {
    if (showConflictIfNeeded({ course, occasion, strategy: "button" })) {
      return;
    }

    if (checkWildcardExpansion({ occasion })) {
      setSelectedOccasion(occasion);
      setExpansionAlertOpen(true);
      return;
    }

    executeAdd({ course, occasion, strategy: "button" });
  };

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

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <AddButton
            onClick={
              isMultiOccasion
                ? () => setPopoverOpen(true)
                : () => handleAddAttempt(selectedOccasion)
            }
          />
        </PopoverTrigger>

        <PopoverContent side="left" align="start" sideOffset={10}>
          <MultiCourseDropdown
            course={course}
            onAddAttempt={handleAddAttempt}
            setSelectedOccasion={setSelectedOccasion}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default CourseAddButton;

interface MultiCourseDropdownProps {
  course: Course;
  onAddAttempt: (occasion: CourseOccasion) => void;
  setSelectedOccasion: (occasion: CourseOccasion) => void;
}

const MultiCourseDropdown: FC<MultiCourseDropdownProps> = ({
  course,
  onAddAttempt,
  setSelectedOccasion,
}) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);

  return (
    <div className="flex flex-col gap-1">
      <div className="max-h-[300px] overflow-y-auto p-1 flex flex-col gap-1">
        {course.CourseOccasion.map((occasion) => {
          const relativeSemester =
            yearAndSemesterToRelativeSemester(
              startingYear,
              occasion.year,
              occasion.semester,
            ) + 1;

          const pLabel =
            occasion.periods.length > 0
              ? `Period ${occasion.periods
                  .map((p) => p.period)
                  .sort()
                  .join(", ")}`
              : "Unknown Period";
          const allBlocks = Array.from(
            new Set(occasion.periods.flatMap((p) => p.blocks)),
          ).sort();
          const bLabel =
            allBlocks.length > 0 ? `Block ${allBlocks.join(", ")}` : "No Block";

          return (
            <Button
              key={occasion.id}
              variant="ghost"
              className="h-auto w-full justify-start whitespace-normal px-3 py-3 hover:bg-accent border border-transparent hover:border-border"
              onClick={() => {
                setSelectedOccasion(occasion);
                onAddAttempt(occasion);
              }}
            >
              <div className="flex flex-col items-start gap-1.5 w-full">
                <div className="flex w-full justify-between items-center">
                  <span className="font-semibold text-foreground">
                    Semester {relativeSemester}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex flex-col items-center gap-2">
                  <span className={bLabel === "No Block" ? "italic" : ""}>
                    {pLabel} &bull; {bLabel}
                  </span>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

const AddButton = (props: React.ComponentPropsWithRef<typeof Button>) => (
  <Button
    {...props}
    variant="ghost"
    size="icon"
    className={`cursor-pointer absolute top-2 right-2 text-muted-foreground hover:text-foreground ${
      props.className ?? ""
    }`}
  >
    <Plus className="h-4 w-4" />
  </Button>
);
