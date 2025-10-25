import { Course } from "@/app/courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MastersBadge } from "./MastersBadge";
import { Button } from "./ui/button";
import { CourseDialog } from "./CourseDialog";
import { useState } from "react";
import { X } from "lucide-react";
import { useAtom } from "jotai";
import semestersStore from "@/app/semesterStore";


type CourseCardHorizontalProps = Course & {
  dropped: boolean
};
const CourseCardHorizontal: React.FC<CourseCardHorizontalProps> = ({
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
  const [semesters, setSemesters] = useAtom(semestersStore);
  const removeCourse = () => {
    setSemesters((prev) => {
      const newSemesters = prev.map((semester) =>
        semester.map((period) =>
          period.map((block) => (block === code ? null : block))
        )
      );
      return newSemesters;
    });
  }
  return (
    <Card
      className={`relative h-20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer`}
    >
      {dropped &&
        <Button
          variant="ghost"
          size="icon"
          onClick={removeCourse}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>}
      <CourseDialog open={openDialog} onOpenChange={setOpenDialog} course={{ code: code, name: name, semester: semester, period, credits, level, block, link, mastersPrograms, dependencies }} />
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
        <a>
          {"S: " + semester}, {"P: " + period.join("/")} {"B: " + block}
        </a>
        <div className="flex justify-between">
        {mastersPrograms.map((program) => (
          <MastersBadge key={program} program={program} />
        ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export { CourseCardHorizontal };
