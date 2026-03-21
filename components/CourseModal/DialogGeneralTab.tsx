"use client";

import { LIU_DEPARTMENTS } from "@/lib/departmentShortName";
import { Separator } from "@/components/ui/separator";
import { Course } from "@/app/dashboard/page";
import { Badge } from "@/components/ui/badge";
import OccasionTable from "./OccasionTable";
import { FC } from "react";
import {
  BookOpen,
  Building2,
  CalendarClock,
  GraduationCap,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";

interface DialogGeneralTabProps {
  course: Course;
  showAdd: boolean;
}

interface DetailRowProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

const DetailRow: FC<DetailRowProps> = ({ label, value, icon: Icon }) => (
  <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 py-2.5 text-sm">
    <p className="text-muted-foreground inline-flex items-center gap-1.5">
      <Icon className="size-3.5" />
      {label}
    </p>
    <p className="text-foreground break-words">{value}</p>
  </div>
);

const DialogGeneralTab: FC<DialogGeneralTabProps> = ({ course, showAdd }) => {
  const t = useCommonTranslate();
  const examiner = course.examiner.trim() === "" ? "N/A" : course.examiner;
  const department = LIU_DEPARTMENTS[course.department] ?? "N/A";
  const level = course.level.trim() === "" ? "N/A" : course.level;
  const mainFields = course.mainField.length > 0 ? course.mainField : [];

  return (
    <div className="space-y-3 py-2 text-foreground">
      <section className="rounded-md border p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide">
          {t("_course_details")}
        </p>
        <div className="mt-1">
          <DetailRow icon={UserRound} label={t("_course_examiner")} value={examiner} />
          <Separator />
          <DetailRow icon={Building2} label={t("_course_department")} value={department} />
          <Separator />
          <DetailRow icon={GraduationCap} label={t("_course_level")} value={level} />
          <Separator />
          <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 py-2.5 text-sm">
            <p className="text-muted-foreground inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              {t("_course_main_fields")}
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

      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            {t("_course_planned_occasions")}
          </p>
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            <CalendarClock className="size-3.5" />
            {course.CourseOccasion.length}{" "}
            {course.CourseOccasion.length > 1 ? t("_course_option_plural") : t("_course_option_singular")}
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
