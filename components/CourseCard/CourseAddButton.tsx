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
import { useState } from "react";

type CourseAddButtonProps = {
  course: Course;
};

const CourseAddButton = ({ course }: CourseAddButtonProps) => {
  const isMultiOccasion = course.CourseOccasion.length > 1;
  const {
    mutators,
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
      mutators.addBlockToSemester({ semester: relativeSemester });
      mutators.addCourse({ course, occasion });
    } else {
      mutators.addCourse({ course, occasion });
    }
  };

  const checkCollisionBeforeAdd = (occasion: CourseOccasion) => {
    const isWildcard = occasion.periods.some((p) => p.blocks.length === 0);

    if (isWildcard) {
      const needsExpansion = checkWildcardExpansion({ occasion });
      if (needsExpansion) {
        setExpansionAlertOpen(true);
        return;
      }
      mutators.addCourse({ course, occasion });
      return;
    }

    if (getOccasionCollisions({ occasion }).length > 0) {
      setCollisionAlertOpen(true);
    } else {
      mutators.addCourse({ course, occasion });
    }
  };

  return (
    <>
      <AddAlert
        course={course}
        primaryAction={() =>
          mutators.addCourse({ course, occasion: selectedOccasion })
        }
        open={collisionAlertOpen}
        setOpen={setCollisionAlertOpen}
        collisions={getOccasionCollisions({
          occasion: selectedOccasion,
        })}
      />

      <AlertDialog
        open={expansionAlertOpen}
        onOpenChange={setExpansionAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Expand Schedule?</AlertDialogTitle>
            <AlertDialogDescription>
              There are no empty wildcard slots available in this semester.
              Adding this course will create a new block row for the entire
              semester.
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
              Add New Block & Course
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

const MultiCourseDropdown = ({
  course,
  checkCollisionBeforeAdd,
  setSelectedOccasion,
}: MultiCourseDropdownProps) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);

  return (
    <div className="flex flex-col gap-2">
      {course.CourseOccasion.map((occasion) => (
        <Button
          key={occasion.id}
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedOccasion(occasion);
            checkCollisionBeforeAdd(occasion);
          }}
        >
          {`Add to Semester ${
            yearAndSemesterToRelativeSemester(
              startingYear,
              occasion.year,
              occasion.semester,
            ) + 1
          }`}
        </Button>
      ))}
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
