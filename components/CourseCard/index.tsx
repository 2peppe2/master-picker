import { Course } from "@/app/courses";
import semestersAtom from "@/app/atoms/semestersAtom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { produce } from "immer";
import { useSetAtom } from "jotai";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { CourseDialog } from "./Dialog";
import { MastersBadge } from "@/components/MastersBadge";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: Course;
  dropped: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, dropped }) => {
  const { code, semester, period, block, name, mastersPrograms } = course;

  const [openDialog, setOpenDialog] = useState(false);
  const setSemesters = useSetAtom(semestersAtom);

  const removeCourse = () => {
    setSemesters((prev) => {
      const newSemesters = prev.map((semester) =>
        semester.map((period) =>
          period.map((block) => (block === code ? null : block))
        )
      );
      return newSemesters;
    });
  };

  const addCourse = () => {
    setSemesters(
      produce((draft) => {
        draft[semester - 7][period[0] - 1][block - 1] = code;
        if (period.length > 1) {
          draft[semester - 7][period[1] - 1][block - 1] = code;
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
            <strong>S:</strong> {semester}
          </div>
          <div>
            <strong>P:</strong> {period.join("/")}
          </div>
          <div>
            <strong>B:</strong> {block}
          </div>
        </div>
        <div className="flex justify-between">
          {mastersPrograms.map((program) => (
            <MastersBadge key={program} master={program} />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
