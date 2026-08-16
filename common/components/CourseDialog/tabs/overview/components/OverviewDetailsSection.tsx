"use client";

import { cn } from "@/lib/utils";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { BookOpen, Building2, GraduationCap, UserRound } from "lucide-react";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import Translate from "@/common/components/translate/Translate";
import { LIU_DEPARTMENTS } from "@/lib/departmentShortName";
import { Separator } from "@/components/ui/separator";
import OverviewDetailRow from "./OverviewDetailRow";
import { Course } from "@/common/types";
import { Badge } from "@/components/ui/badge";
import { FC } from "react";

interface OverviewDetailsSectionProps {
  course: Course;
}

const OverviewDetailsSection: FC<OverviewDetailsSectionProps> = ({
  course,
}) => {
  const translate = useCommonTranslate();
  const examiner = course.examiner.trim() === "" ? "N/A" : course.examiner;
  const department = LIU_DEPARTMENTS[course.department] ?? "N/A";
  const level = course.level.trim() === "" ? "N/A" : course.level;
  const mainFields = course.mainField.length > 0 ? course.mainField : [];

  return (
    <section>
      <p className="mb-2 text-sm font-medium text-foreground">
        <Translate text="_course_details" />
      </p>
      <div className="mt-1">
        <OverviewDetailRow
          icon={UserRound}
          label={translate("_course_examiner")}
          value={examiner}
        />
        <Separator />
        <OverviewDetailRow
          icon={Building2}
          label={translate("_course_department")}
          value={department}
        />
        <Separator />
        <OverviewDetailRow
          icon={GraduationCap}
          label={translate("_course_level")}
          value={level}
        />
        <Separator />
        <div
          className={cn(
            "grid grid-cols-1 gap-1 py-2.5 text-sm",
            "min-[360px]:grid-cols-[7rem_minmax(0,1fr)]",
            "min-[360px]:gap-3",
          )}
        >
          <p className="text-muted-foreground inline-flex items-center gap-1.5">
            <BookOpen className="size-3.5" />
            <Translate text="_course_main_fields" />
          </p>
          <div className="flex flex-wrap gap-1.5">
            {mainFields.length > 0 ? (
              mainFields.map((field) => (
                <Badge
                  key={field}
                  variant="outline"
                  className="rounded-md px-2 py-0.5 text-[11px]"
                >
                  <CourseTranslate text={field} />
                </Badge>
              ))
            ) : (
              <p className="text-foreground">N/A</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewDetailsSection;
