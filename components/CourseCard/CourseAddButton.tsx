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
  const checkCollisionBeforeAdd = (occasion: CourseOccasion) => {
    if (getters.getOccasionCollisions({occasion: occasion}).length > 0) {
      setAlertOpen(true);
    } else{
      mutators.addCourse({ course, occasion: occasion });
    }
  }

  if (!isMultiOccasion) {
    return (
      <><AddAlert
      course={course}
      primaryAction={() => mutators.addCourse({ course, occasion: course.CourseOccasion[0] })}
      open={alertOpen}
      setOpen={setAlertOpen}
      collisions={getters.getOccasionCollisions({occasion: course.CourseOccasion[0]})} />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => checkCollisionBeforeAdd(course.CourseOccasion[0])}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
      </Button></>
    );
  }
  return (
    //TODO: Fix collision checking for multi-occasion courses
    <Popover>
      <PopoverTrigger asChild>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" align="start" sideOffset={10}>
        <MultiCourseDropdown course={course} checkCollisionBeforeAdd = {checkCollisionBeforeAdd} />
      </PopoverContent>
    </Popover>
  );
};

export default CourseAddButton;

type MultiCourseDropdownProps = {
  course: Course;
  checkCollisionBeforeAdd: (occasion: CourseOccasion) => void;
};

const MultiCourseDropdown = ({ course, checkCollisionBeforeAdd }: MultiCourseDropdownProps) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);
  return (
    <div className="flex flex-col gap-2">
      {course.CourseOccasion.map((occasion) => (
        <Button
          key={occasion.id}
          variant="outline"
          size="sm"
          onClick={() => checkCollisionBeforeAdd(occasion)}
        >
          {`Add to Semester ${yearAndSemesterToRelativeSemester(
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







