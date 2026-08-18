"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";

import { cn } from "@/lib/utils";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import Translate from "@/common/components/translate/Translate";
import { CourseExamination } from "@/common/types";
import { Button } from "@/components/ui/button";
import { Scale } from "@/prisma/generated/client/enums";
import { BarChart2 } from "lucide-react";
import { Module } from "liu-tentor-package";
import { FC } from "react";

interface MobileExaminationCardProps {
  exam: CourseExamination;
  stats: Module | null;
  isLoading: boolean;
  onNavigateToStatistics: () => void;
}

const MobileExaminationCard: FC<MobileExaminationCardProps> = ({
  exam,
  stats,
  isLoading,
  onNavigateToStatistics,
}) => (
  <article className="rounded-2xl bg-muted/40 p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="break-words font-semibold leading-snug text-foreground">
          <CourseTranslate text={exam.name} />
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {exam.module}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-md bg-muted px-2 py-1 text-xs",
          "font-semibold text-foreground",
        )}
      >
        {exam.credits} HP
      </span>
    </div>

    <dl
      className={cn(
        "mt-3 grid grid-cols-2 gap-2 border-t",
        "border-border/50 pt-3 text-xs",
      )}
    >
      <div className="rounded-xl bg-background/60 p-2.5">
        <dt className="text-2xs text-muted-foreground">
          <Translate text="course_scale" />
        </dt>
        <dd className="mt-1 font-medium text-foreground">
          <Translate
            text={exam.scale === Scale.G_OR_U ? "_scale_gu" : "_scale_345"}
          />
        </dd>
      </div>
      <div className="rounded-xl bg-background/60 p-2.5">
        <dt className="text-2xs text-muted-foreground">
          <Translate text="_course_last_original_statistics" />
        </dt>
        <dd className="mt-1 min-h-4 font-medium text-foreground">
          <MobileGradeSummary
            scale={exam.scale}
            stats={stats}
            isLoading={isLoading}
          />
        </dd>
      </div>
    </dl>

    <Button
      type="button"
      variant="ghost"
      onClick={onNavigateToStatistics}
      className={cn(
        "mt-4 h-11 w-full rounded-xl bg-primary/10",
        "font-semibold text-primary shadow-none",
        "hover:bg-primary/20",
      )}
    >
      <BarChart2 className="size-4" />
      <Translate text="course_tab_statistics" />
    </Button>
  </article>
);

interface MobileGradeSummaryProps {
  scale: Scale;
  stats: Module | null;
  isLoading: boolean;
}

const MobileGradeSummary: FC<MobileGradeSummaryProps> = ({
  scale,
  stats,
  isLoading,
}) => {
  const translate = useCommonTranslate();
  if (isLoading) {
    return <span aria-label={translate("loading")}>•••</span>;
  }

  if (!stats) {
    return <>–</>;
  }

  const getCount = (grade: string) =>
    stats.grades.find((item) => item.grade === grade)?.quantity ?? 0;

  if (scale === Scale.G_OR_U) {
    const passed =
      getCount("G") + getCount("3") + getCount("4") + getCount("5");
    return (
      <span className="whitespace-nowrap">
        G: {passed} · U: {getCount("U")}
      </span>
    );
  }

  return (
    <span className="whitespace-nowrap">
      5: {getCount("5")} · 4: {getCount("4")} · 3: {getCount("3")} · U:{" "}
      {getCount("U")}
    </span>
  );
};

export default MobileExaminationCard;
