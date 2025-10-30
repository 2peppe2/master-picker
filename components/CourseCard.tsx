import { Course } from "@/app/courses";
import semestersAtom from "@/app/semestersAtom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { produce } from "immer";
import { useAtom } from "jotai";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { CourseDialog } from "./CourseDialog";
import { MastersBadge } from "./MastersBadge";
import { Button } from "./ui/button";

type CourseCardProps = Course & {
  dropped: boolean;
};
const CourseCard: React.FC<CourseCardProps> = ({
  code,
  name,
  semester,
  period,
  credits,
  level,
  block,
  link,
  mastersPrograms,
  dependencies,
  dropped,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const multiPeriod = period.length > 1;
  const shortName = name.length > 30 ? name.slice(0, 27) + "..." : name;
  const [semesters, setSemesters] = useAtom(semestersAtom);
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
    console.log(
      "Adding course",
      code,
      "to semester",
      semester,
      "period",
      period,
      "block",
      block
    );
    setSemesters(
      produce((draft) => {
        draft[semester - 7][period[0] - 1][block - 1] = code;
      })
    );
  };

  return (
    <Card
      className={`relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer`}
    >
      {dropped ? (
        <Button
          variant="ghost"
          size="icon"
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
        open={openDialog}
        onOpenChange={setOpenDialog}
        course={{
          code: code,
          name: name,
          semester: semester,
          period,
          credits,
          level,
          block,
          link,
          mastersPrograms,
          dependencies,
        }}
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

export { CourseCard };
