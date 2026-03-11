import { Course } from "@/app/dashboard/page";
import OccasionTable from "./OccasionTable";
import { LIU_DEPARTMENTS } from "@/lib/departmentShortName";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";

type DialogGeneralTabProps = {
  course: Course;
  showAdd: boolean;
};

const DialogGeneralTab = ({ course, showAdd }: DialogGeneralTabProps) => {
  const department = LIU_DEPARTMENTS[course.department] ?? "N/A";
  const level = course.level.trim() === "" ? "N/A" : course.level;

  return (
    <div className="space-y-3 py-2 text-foreground">
      <section className="rounded-md border bg-muted/10 p-3">
        <p className="text-muted-foreground mb-2 text-[11px] font-medium uppercase tracking-wide">
          Key facts
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px]">
            {course.credits} ECTS
          </Badge>
          <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px]">
            Level {level}
          </Badge>
          <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px]">
            {department}
          </Badge>
          <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px]">
            {course.Examination.length} modules
          </Badge>
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Planned occasions
          </p>
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            <CalendarClock className="size-3.5" />
            {course.CourseOccasion.length} options
          </span>
        </div>
        <div className="rounded-md border">
          <OccasionTable course={course} showAdd={showAdd} />
        </div>
      </section>
    </div>
  );
};

export default DialogGeneralTab;
