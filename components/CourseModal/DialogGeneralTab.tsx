import DialogTimeChart from "./DialogTimeChart";
import { Course } from "@/app/dashboard/page";
import OccasionTable from "./OccasionTable";
import { LIU_DEPARTMENTS } from "@/lib/departmentShortName";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Building2,
  GraduationCap,
  UserRound,
} from "lucide-react";
import { ComponentType } from "react";

type DialogGeneralTabProps = {
  course: Course;
  showAdd: boolean;
};

type OverviewItemProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

const OverviewItem = ({ icon: Icon, label, value }: OverviewItemProps) => {
  return (
    <div className="flex items-start gap-2 rounded-md border bg-background/70 px-2 py-1.5">
      <Icon className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-muted-foreground text-[10px] uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xs leading-4 text-foreground break-words">{value}</p>
      </div>
    </div>
  );
};

const DialogGeneralTab = ({ course, showAdd }: DialogGeneralTabProps) => {
  const examiner = course.examiner.trim() === "" ? "N/A" : course.examiner;
  const department = LIU_DEPARTMENTS[course.department] ?? "N/A";
  const level = course.level.trim() === "" ? "N/A" : course.level;
  const mainField = course.mainField.length ? course.mainField.join(", ") : "N/A";

  return (
    <div className="space-y-2 py-2 text-foreground">
      <section className="grid gap-2 rounded-lg border bg-muted/15 p-2.5 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px]">
              {course.credits} ECTS
            </Badge>
            <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px]">
              Level {level}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <OverviewItem icon={UserRound} label="Examiner" value={examiner} />
            <OverviewItem icon={Building2} label="Department" value={department} />
            <OverviewItem icon={GraduationCap} label="Level" value={level} />
            <OverviewItem icon={BookOpen} label="Main field" value={mainField} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 sm:w-36 sm:flex-col sm:items-end">
          <DialogTimeChart
            scheduledHours={course.scheduledHours}
            selfStudyHours={course.selfStudyHours}
          />
          <div className="w-full space-y-1 text-[11px]">
            <div className="flex items-center justify-between rounded-md border bg-background/70 px-2 py-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: "var(--chart-2)" }}
                />
                Scheduled
              </span>
              <span className="font-medium text-foreground">{course.scheduledHours} h</span>
            </div>
            <div className="flex items-center justify-between rounded-md border bg-background/70 px-2 py-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: "var(--chart-1)" }}
                />
                Self-study
              </span>
              <span className="font-medium text-foreground">{course.selfStudyHours} h</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-2.5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
          Planned occasions
        </p>
        <OccasionTable course={course} showAdd={showAdd} />
      </section>
    </div>
  );
};

export default DialogGeneralTab;
