"use client";

import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { Course, CourseOccasion } from "@/app/dashboard/page";
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
import { Button } from "../ui/button";
import { useAtomValue } from "jotai";
import { Plus } from "lucide-react";
import AddAlert from "../AddAlert";
import { FC, useState } from "react";

type CourseAddButtonProps = {
  course: Course;
};

const CourseAddButton = ({ course }: CourseAddButtonProps) => {
  const isMultiOccasion = course.CourseOccasion.length > 1;
  const {
    mutators: { addCourseByButton, addBlockToSemester },
    getters: { getOccasionCollisions, checkWildcardExpansion },
  } = useScheduleStore();

  const { startingYear } = useAtomValue(userPreferencesAtom);

  const [collisionAlertOpen, setCollisionAlertOpen] = useState(false);
  const [expansionAlertOpen, setExpansionAlertOpen] = useState(false);

  const [selectedOccasion, setSelectedOccasion] = useState<CourseOccasion>(
    course.CourseOccasion[0],
  );
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleAdd = (occasion: CourseOccasion) => {
    if (checkWildcardExpansion({ occasion })) {
      const relativeSemester = yearAndSemesterToRelativeSemester(
        startingYear,
        occasion.year,
        occasion.semester,
      );
      addBlockToSemester({ semester: relativeSemester });
      addCourseByButton({ course, occasion });
    } else {
      addCourseByButton({ course, occasion });
    }
  };

  const handleAddAsExtra = (occasion: CourseOccasion) => {
    const relativeSemester = yearAndSemesterToRelativeSemester(
      startingYear,
      occasion.year,
      occasion.semester,
    );

    if (checkWildcardExpansion({ occasion })) {
      addBlockToSemester({ semester: relativeSemester });
    }

    const wildcardOccasion = {
      ...occasion,
      periods: occasion.periods.map((p) => ({ ...p, blocks: [] })),
    };

    addCourseByButton({
      course,
      occasion: wildcardOccasion,
    });
  };

  const checkCollisionBeforeAdd = (occasion: CourseOccasion) => {
    const collisions = getOccasionCollisions({ occasion });

    if (collisions.length > 0) {
      setSelectedOccasion(occasion);
      setCollisionAlertOpen(true);
      return;
    }

    if (checkWildcardExpansion({ occasion })) {
      setExpansionAlertOpen(true);
      return;
    }

    addCourseByButton({ course, occasion });
  };

  return (
    <>
      <AddAlert
        occasion={selectedOccasion}
        course={course}
        open={collisionAlertOpen}
        setOpen={setCollisionAlertOpen}
        collisions={getOccasionCollisions({ occasion: selectedOccasion })}
        onReplace={() => {
          addCourseByButton({ course, occasion: selectedOccasion });
        }}
        onAddAsExtra={() => {
          handleAddAsExtra(selectedOccasion);
        }}
      />

      <AlertDialog
        open={expansionAlertOpen}
        onOpenChange={setExpansionAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add block to semester</AlertDialogTitle>
            <AlertDialogDescription>
              There are no empty blocks available in this semester. Adding this
              course will create a new extra block.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleAdd(selectedOccasion);
                setExpansionAlertOpen(false);
              }}
            >
              Add {course.code}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <AddButton
            onClick={
              isMultiOccasion
                ? () => setPopoverOpen(true)
                : () => checkCollisionBeforeAdd(selectedOccasion)
            }
          />
        </PopoverTrigger>

        <PopoverContent side="left" align="start" sideOffset={10}>
          <MultiCourseDropdown
            course={course}
            checkCollisionBeforeAdd={checkCollisionBeforeAdd}
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
  checkCollisionBeforeAdd: (occasion: CourseOccasion) => void;
  setSelectedOccasion: (occasion: CourseOccasion) => void;
}

const formatPeriods = (periods: { period: number }[]) => {
  if (!periods || periods.length === 0) return "Unknown Period";
  const sorted = [...periods].sort((a, b) => a.period - b.period);
  const pNums = sorted.map((p) => p.period);

  return pNums.map((p) => `Period ${p}`).join(", ");
};

const formatBlocks = (periods: { blocks: number[] }[]) => {
  const allBlocks = Array.from(new Set(periods.flatMap((p) => p.blocks))).sort(
    (a, b) => a - b,
  );

  if (allBlocks.length === 0) return "No Block";
  return `Block ${allBlocks.join(", ")}`;
};

const MultiCourseDropdown: FC<MultiCourseDropdownProps> = ({
  course,
  checkCollisionBeforeAdd,
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

          const periodLabel = formatPeriods(occasion.periods);
          const blockLabel = formatBlocks(occasion.periods);

          return (
            <Button
              key={occasion.id}
              variant="ghost"
              className="h-auto w-full justify-start whitespace-normal px-3 py-3 hover:bg-accent border border-transparent hover:border-border"
              onClick={() => {
                setSelectedOccasion(occasion);
                checkCollisionBeforeAdd(occasion);
              }}
            >
              <div className="flex flex-col items-start gap-1.5 w-full">
                <div className="flex w-full justify-between items-center">
                  <span className="font-semibold text-foreground">
                    Semester {relativeSemester}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground flex flex-col items-center gap-2">
                  <span className={blockLabel === "No Block" ? "italic" : ""}>
                    {periodLabel} &bull; {blockLabel}
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
    className={`absolute top-2 right-2 text-muted-foreground hover:text-foreground ${props.className ?? ""}`}
  >
    <Plus className="h-4 w-4" />
  </Button>
);
