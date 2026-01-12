import semesterScheduleAtom from "@/app/atoms/semestersAtom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { produce } from "immer";
import { useAtomValue, useSetAtom } from "jotai";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { CourseDialog } from "./Dialog";
import { MastersBadge } from "@/components/MastersBadge";
import { Button } from "@/components/ui/button";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { Course } from "@/app/(main)/page";

interface CourseCardProps {
  course: Course;
  dropped: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, dropped }) => {
  const { code, name } = course;

  //TODO fix for multiple semesters
  const occasion = course.CourseOccasion?.[0];
  const year = occasion?.year;
  const semester = occasion?.semester;
  const period = occasion?.periods ?? [];
  const block = occasion?.blocks ?? [];
  const masterPrograms = course.CourseMaster || [];
  const { startingYear } = useAtomValue(userPreferencesAtom);

  const [openDialog, setOpenDialog] = useState(false);
  const setSemesters = useSetAtom(semesterScheduleAtom);

  const removeCourse = () => {
    setSemesters((prev) => {
      const newSemesters = prev.map((semester) =>
        semester.map((period) =>
          period.map((block) => (block?.code === code ? null : block))
        )
      );
      return newSemesters;
    });
  };

  const addCourse = () => {
    // TODO handle multiple blocks
    // Probably has bugs ;(
    setSemesters(
      produce((draft) => {
        if (year && period[0]?.period && block[0]?.block) {
          draft[year - startingYear][period[0].period - 1][block[0].block - 1] =
            course;
          if (period[1]?.period) {
            draft[year - startingYear][period[1].period - 1][
              block[0].block - 1
            ] = course;
          }
        }
      })
    );
  };

  return (
    <Card className="relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
      {dropped ? (
        <Button
          size="icon"
          variant="ghost"
          onClick={removeCourse}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={addCourse}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
      <CourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
      <CardHeader>
        <CardTitle>
          <p
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer hover:underline underline-offset-2 text-left"
          >
            {code}
          </p>
        </CardTitle>
        <CardDescription className="h-6">
          <p
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer hover:underline underline-offset-2 text-left text-sm"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </p>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2 text-foreground">
        <div className="flex gap-2 text-muted-foreground text-xs">
          <div>
            <strong>S:</strong> {semester ?? "-"}
          </div>
          <div>
            <strong>P:</strong>{" "}
            {period.length ? period.map((p) => p.period).join("/") : "-"}
          </div>
          <div>
            <strong>B:</strong> {block[0]?.block ?? "-"}
          </div>
        </div>
        <div className="flex justify-between">
          {masterPrograms.map((program) => (
            <MastersBadge key={program.master} master={program.master} />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
