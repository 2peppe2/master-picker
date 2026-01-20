import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { Course, CourseOccasion } from "@/app/(main)/page";
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
  const { mutators, getters } = useScheduleStore();
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<CourseOccasion>(
    course.CourseOccasion[0],
  );
  const [popoverOpen, setPopoverOpen] = useState(false);

  const checkCollisionBeforeAdd = (occasion: CourseOccasion) => {
    if (getters.getOccasionCollisions({ occasion: occasion }).length > 0) {
      setAlertOpen(true);
    } else {
      mutators.addCourse({ course, occasion: occasion });
    }
  };

  return (
    <>
      <AddAlert
        course={course}
        primaryAction={() =>
          mutators.addCourse({ course, occasion: selectedOccasion })
        }
        open={alertOpen}
        setOpen={setAlertOpen}
        collisions={getters.getOccasionCollisions({
          occasion: selectedOccasion,
        })}
      />

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

type MultiCourseDropdownProps = {
  course: Course;
  checkCollisionBeforeAdd: (occasion: CourseOccasion) => void;
  setSelectedOccasion: (occasion: CourseOccasion) => void;
};

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
            checkCollisionBeforeAdd(occasion);
            setSelectedOccasion(occasion);
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
