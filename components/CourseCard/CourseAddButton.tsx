import { Course } from "@/app/(main)/page";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useScheduleStore } from "@/app/atoms/scheduleStore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { useAtomValue } from "jotai";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";

type CourseAddButtonProps = {
    course: Course;
};

const CourseAddButton = ({ course }: CourseAddButtonProps) => {
    const isMultiOccasion = course.CourseOccasion.length > 1;
    const { mutators } = useScheduleStore();
    if (!isMultiOccasion) {
        return (
            <Button
                variant="ghost"
                size="icon"
                onClick={() => mutators.addCourse({ course, occasion: course.CourseOccasion[0] })}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
                <Plus className="h-4 w-4" />
            </Button>
        );
    }
    return (
        <Popover >
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
                <MultiCourseDropdown course={course} />
            </PopoverContent>
        </Popover>
    )
};

export default CourseAddButton;

type MultiCourseDropdownProps = {
    course: Course;
};

const MultiCourseDropdown = ({ course }: MultiCourseDropdownProps) => {
    const { mutators } = useScheduleStore();
    const { startingYear } = useAtomValue(userPreferencesAtom);
    return (
        <div className="flex flex-col gap-2">
            {course.CourseOccasion.map((occasion) => (
                <Button
                    key={occasion.id}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        mutators.addCourse({ course, occasion })
                    }
                >
                    Add  to {`Semester ${
                        yearAndSemesterToRelativeSemester(
                            startingYear,
                            occasion.year,
                            occasion.semester
                        ) + 1}`}
                </Button>
            ))}
        </div>
    );
}