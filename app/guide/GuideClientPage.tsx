"use client";

import CourseCard from "@/components/CourseCard";
import type { CourseRequirements } from "./page";
import { normalizeCourse } from "../courseNormalizer";
import { useAtomValue, useSetAtom } from "jotai";
import { mastersAtom } from "../atoms/mastersAtom";
import type { Master } from "../dashboard/page";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MasterBadge } from "@/components/MasterBadge";

interface GuideClientPageProps {
  courseRequirements: CourseRequirements;
  masters: Record<string, Master>;
  selectedMaster: string;
}

const GuideClientPage = ({
  courseRequirements,
  masters,
  selectedMaster,
}: GuideClientPageProps) => {
  const setMasters = useSetAtom(mastersAtom);
  setMasters(masters);

  const compulsoryCourses = React.useMemo(
    () => courseRequirements.filter((req) => req.courses.length === 1),
    [courseRequirements],
  );
  const electiveCourses = React.useMemo(
    () => courseRequirements.filter((req) => req.courses.length > 1),
    [courseRequirements],
  );

  const scheduledCourses = useAtomValue(scheduleAtoms.selectedCoursesAtom);

  const scheduledCourseCodes = React.useMemo(
    () => new Set(scheduledCourses.map((course) => course.code)),
    [scheduledCourses],
  );

  const scheduledChoiceSelections = React.useMemo(() => {
    const selectionMap: Record<number, string | null> = {};

    electiveCourses.forEach((req, index) => {
      const scheduledMatch = req.courses.find((courseEntry) =>
        scheduledCourseCodes.has(courseEntry.course.code),
      );
      selectionMap[index] = scheduledMatch?.course.code ?? null;
    });

    return selectionMap;
  }, [electiveCourses, scheduledCourseCodes]);

  const [selections, setSelections] = React.useState<
    Record<number, string | null>
  >({});

  const selectedCodesByGroup = React.useMemo(() => {
    const map: Record<number, string | null> = {};

    electiveCourses.forEach((_, index) => {
      map[index] =
        selections[index] ?? scheduledChoiceSelections[index] ?? null;
    });

    return map;
  }, [electiveCourses, selections, scheduledChoiceSelections]);

  const completedChoiceGroups = electiveCourses.reduce((count, _, index) => {
    return selectedCodesByGroup[index] ? count + 1 : count;
  }, 0);

  const isChoiceComplete =
    electiveCourses.length === 0 || completedChoiceGroups === electiveCourses.length;

  return (
    <div className="min-h-screen ">
      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-24">
        <GuideHeader selectedMaster={selectedMaster} />

        <div className="grid gap-4 sm:grid-cols-3">
          <CompulsorySummaryCard compulsoryCourses={compulsoryCourses} />
          <ElectiveSummaryCard
            completedChoiceGroups={completedChoiceGroups}
            electiveCourses={electiveCourses}
          />
        </div>

        <div className="mt-6 rounded-2xl border  p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Selection progress</span>
            <span>
              {completedChoiceGroups}/{electiveCourses.length} groups
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full  transition-all"
              style={{ width: `${"-"}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span
              className={cn(
                "rounded-full border px-3 py-1 font-medium",
                "border-emerald-200  text-emerald-700",
              )}
            >
              1. Required added
            </span>
            <span
              className={cn(
                "rounded-full border px-3 py-1 font-medium",
                isChoiceComplete
                  ? "border-emerald-200  text-emerald-700"
                  : "border-sky-200 bg-sky-50 text-sky-700",
              )}
            >
              2. Choose options
            </span>
            <span
              className={cn(
                "rounded-full border px-3 py-1 font-medium",
                isChoiceComplete
                  ? "border-sky-200 bg-sky-50 text-sky-700"
                  : "border-muted bg-muted/40 text-muted-foreground",
              )}
            >
              3. Ready to continue
            </span>
          </div>
        </div>

        {compulsoryCourses.length > 0 && (
          <Card className="mt-10">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-emerald-500/10 text-emerald-700">
                  Auto-added
                </Badge>
                <CardTitle>Required courses</CardTitle>
              </div>
              <CardDescription>
                These courses are mandatory and will be added automatically to
                your schedule.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {compulsoryCourses.map((req) =>
                  req.courses.map((courseEntry) => {
                    return (
                      <div key={courseEntry.course.code} className="space-y-3">
                        <CourseCard course={normalizeCourse(courseEntry.course)} variant="noAdd" />
                      </div>
                    );
                  }),
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {electiveCourses.map((req, groupIndex) => {
          const selectedCode = selectedCodesByGroup[groupIndex];

          return (
            <Card className="mt-8" key={`choice-group-${groupIndex}`}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Choose 1</Badge>
                      <span className="text-xs text-muted-foreground">
                        Group {groupIndex + 1} · {req.courses.length} options
                        {req.type ? ` · ${req.type}` : ""}
                      </span>
                    </div>
                    <CardTitle>Select the course you prefer</CardTitle>
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium",
                      selectedCode
                        ? "text-emerald-700"
                        : "text-muted-foreground",
                    )}
                  >
                    {selectedCode ? `Selected ${selectedCode}` : "No selection"}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {req.courses.map((courseEntry) => {
                    const normalizedCourse = normalizeCourse(
                      courseEntry.course,
                    );
                    const courseCode = normalizedCourse.code;
                    const isSelected = selectedCode === courseCode;
                    const isInSchedule = scheduledCourseCodes.has(courseCode);

                    return (
                      <div
                        key={courseCode}
                        className={cn(
                          "rounded-2xl border p-4 transition",
                          isSelected
                            ? "border-emerald-300 bg-emerald-50/60"
                            : "border-muted bg-background hover:border-foreground/20",
                        )}
                      >
                        <div className="space-y-4">
                          <CourseCard
                            course={normalizedCourse}
                            variant="noAdd"
                          />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            {isInSchedule && (
                              <Badge className="bg-emerald-500/10 text-emerald-700">
                                In schedule
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant={isSelected ? "default" : "secondary"}
                              onClick={() =>
                                setSelections((prev) => ({
                                  ...prev,
                                  [groupIndex]:
                                    prev[groupIndex] === courseCode
                                      ? null
                                      : courseCode,
                                }))
                              }
                              aria-pressed={isSelected}
                            >
                              {isSelected ? "Selected" : `Select ${courseCode}`}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GuideClientPage;

interface GuideHeaderProps {
  selectedMaster: string;
}
const GuideHeader = ({ selectedMaster }: GuideHeaderProps) => {
  return (
    <header className="flex flex-col gap-2">
      <MasterBadge name={selectedMaster} title={true} style="text-base" />
      <h1 className="text-3xl font-semibold tracking-tight">
        {"Great choice! Let's set up your schedule."}
      </h1>
      <div className="mt-4 max-w-2xl">
        <p className="text-base text-muted-foreground">
          {
            "Required courses are added automatically. This master requires you to choose between several course options. Dont worry, you can change your choices later if you change your mind!"
          }
        </p>
      </div>
    </header>
  );
};

interface CompulsoryCardSummaryProps {
  compulsoryCourses: CourseRequirements;
}

const CompulsorySummaryCard = ({
  compulsoryCourses,
}: CompulsoryCardSummaryProps) => {
  const totalCompulsoryCourseCount = compulsoryCourses.reduce(
    (total, req) => total + req.courses.length,
    0,
  );

  return (
    <div className="rounded-2xl border p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Compulsory courses
      </p>
      <p className="mt-2 text-2xl font-semibold">
        {totalCompulsoryCourseCount}
      </p>
      <p className="text-xs text-muted-foreground">
        Auto-added to your schedule
      </p>
    </div>
  );
};

interface ElectiveSummaryCardProps {
  completedChoiceGroups: number;
  electiveCourses: CourseRequirements;
}

const ElectiveSummaryCard = ({
  completedChoiceGroups,
  electiveCourses,
}: ElectiveSummaryCardProps) => {
  const totalElectiveCourseCount = electiveCourses.length;

  return (
    <div className="rounded-2xl border p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Elective Courses
      </p>
      <p className="mt-2 text-2xl font-semibold">
        {completedChoiceGroups}/{totalElectiveCourseCount}
      </p>
      <p className="text-xs text-muted-foreground">Selections made</p>
    </div>
  );
};
