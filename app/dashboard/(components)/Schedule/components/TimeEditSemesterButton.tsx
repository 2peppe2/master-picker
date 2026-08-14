"use client";

import Translate from "@/common/components/translate/Translate";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { FC, useMemo, useState } from "react";
import { Slot } from "@/app/dashboard/(store)/schedule/types";

interface TimeEditSemesterButtonProps {
  periods: Slot[][];
  semester: "HT" | "VT";
  year: number;
}

const TimeEditSemesterButton: FC<TimeEditSemesterButtonProps> = ({
  periods,
  semester,
  year,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const translate = useCommonTranslate();

  const courses = useMemo(() => {
    const uniqueCourses = new Map(
      periods
        .flat()
        .filter((course) => course !== null)
        .map((course) => [course.code, course]),
    );

    return Array.from(uniqueCourses.values());
  }, [periods]);

  const openTimeEdit = async () => {
    if (courses.length === 0 || isLoading) return;

    const targetWindow = window.open("", "_blank");
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        semester,
        year: year.toString(),
      });
      courses.forEach((course) => params.append("course", course.code));

      const response = await fetch(`/api/timeedit/semester-url?${params}`);
      if (!response.ok) {
        targetWindow?.close();
        alert(translate("_timeedit_no_matches"));
        return;
      }

      const { url } = (await response.json()) as { url: string };

      if (targetWindow) {
        targetWindow.location.href = url;
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch {
      targetWindow?.close();
      alert(translate("_timeedit_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-2 px-2 hover:bg-accent"
      disabled={courses.length === 0 || isLoading}
      title={
        isLoading
          ? translate("_timeedit_opening")
          : courses.length === 0
            ? translate("_timeedit_no_courses")
            : translate("_timeedit_open_semester")
      }
      onClick={(e) => {
        e.stopPropagation();
        void openTimeEdit();
      }}
    >
      <span className="sr-only">
        <Translate text="_timeedit_open_semester" />
      </span>
      <CalendarDays className="size-4" />
      <span className="hidden xl:inline">
        <Translate text="_timeedit_button" />
      </span>
    </Button>
  );
};

export default TimeEditSemesterButton;
