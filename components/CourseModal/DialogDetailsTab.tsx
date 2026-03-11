import DialogTimeChart, { WORKLOAD_COLORS } from "./DialogTimeChart";
import { Course } from "@/app/dashboard/page";
import { LIU_DEPARTMENTS } from "@/lib/departmentShortName";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Building2,
  GraduationCap,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type DialogDetailsTabProps = {
  course: Course;
};

type DetailRowProps = {
  label: string;
  value: string;
  icon: LucideIcon;
};

const DetailRow = ({ label, value, icon: Icon }: DetailRowProps) => (
  <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 py-2.5 text-sm">
    <p className="text-muted-foreground inline-flex items-center gap-1.5">
      <Icon className="size-3.5" />
      {label}
    </p>
    <p className="text-foreground break-words">{value}</p>
  </div>
);

const DialogDetailsTab = ({ course }: DialogDetailsTabProps) => {
  const examiner = course.examiner.trim() === "" ? "N/A" : course.examiner;
  const department = LIU_DEPARTMENTS[course.department] ?? "N/A";
  const level = course.level.trim() === "" ? "N/A" : course.level;
  const mainFields = course.mainField.length > 0 ? course.mainField : [];

  const totalHours = course.scheduledHours + course.selfStudyHours;
  const scheduledShare = totalHours
    ? Math.round((course.scheduledHours / totalHours) * 100)
    : 0;
  const selfStudyShare = totalHours ? 100 - scheduledShare : 0;

  return (
    <div className="space-y-3 py-2 text-foreground">
      <section className="rounded-md border p-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide">
          Course details
        </p>
        <div>
          <DetailRow icon={UserRound} label="Examiner" value={examiner} />
          <Separator />
          <DetailRow icon={Building2} label="Department" value={department} />
          <Separator />
          <DetailRow icon={GraduationCap} label="Level" value={level} />
          <Separator />
          <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 py-2.5 text-sm">
            <p className="text-muted-foreground inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              Main fields
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mainFields.length > 0 ? (
                mainFields.map((field) => (
                  <Badge
                    key={field}
                    variant="outline"
                    className="rounded-md px-2 py-0.5 text-[11px]"
                  >
                    {field}
                  </Badge>
                ))
              ) : (
                <p className="text-foreground">N/A</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-md border p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide">Workload</p>
        <div className="grid items-center gap-3 sm:grid-cols-[auto_minmax(0,1fr)]">
          <DialogTimeChart
            scheduledHours={course.scheduledHours}
            selfStudyHours={course.selfStudyHours}
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between py-1 text-xs">
              <span className="text-muted-foreground inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: WORKLOAD_COLORS.scheduled }}
                />
                Scheduled
              </span>
              <span className="font-medium text-foreground">
                {course.scheduledHours} h ({scheduledShare}%)
              </span>
            </div>
            <div className="flex items-center justify-between py-1 text-xs">
              <span className="text-muted-foreground inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: WORKLOAD_COLORS.selfStudy }}
                />
                Self-study
              </span>
              <span className="font-medium text-foreground">
                {course.selfStudyHours} h ({selfStudyShare}%)
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DialogDetailsTab;
