"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { Course } from "@/app/dashboard/page";
import { useState, useEffect, useMemo, ReactNode } from "react";
import OverviewTab from "../tabs/overview";
import ExaminationTab from "../tabs/examination";
import Statistics from "../tabs/statistics";
import EvaluateScore from "../tabs/evaluate";

interface UseCourseDialogStateProps {
  course: Course;
  open: boolean;
  showAdd?: boolean;
}

export const useCourseDialogState = ({
  course,
  open,
  showAdd = true,
}: UseCourseDialogStateProps) => {
  const translate = useCommonTranslate();
  const [activeTab, setActiveTab] = useState("overview");
  const [initModule, setInitModule] = useState<string | undefined>();
  const [selectedStatModule, setSelectedStatModule] = useState<string>("");

  useEffect(() => {
    if (open) {
      setActiveTab("overview");
      setInitModule(undefined);
      setSelectedStatModule("");
    }
  }, [open, course.code]);

  const tabs = useMemo(
    () => [
      {
        name: translate("_course_tab_overview"),
        value: "overview",
        content: <OverviewTab course={course} showAdd={showAdd} />,
      },
      {
        name: translate("_course_tab_examination"),
        value: "examination",
        content: (
          <ExaminationTab
            course={course}
            onNavigateToStatistics={(modCode?: string) => {
              setInitModule(modCode);
              setActiveTab("statistics");
            }}
          />
        ),
      },
      {
        name: translate("_course_tab_statistics"),
        value: "statistics",
        content: (
          <Statistics
            course={course}
            initialStatModule={initModule}
            selectedModule={selectedStatModule}
            setSelectedModule={setSelectedStatModule}
            onInitialStatConsumed={() => setInitModule(undefined)}
          />
        ),
      },
      {
        name: translate("_course_tab_evaluate"),
        value: "evaliuate-score",
        content: <EvaluateScore courseCode={course.code} />,
      },
    ],
    [course, showAdd, initModule, selectedStatModule, translate],
  );

  return {
    activeTab,
    setActiveTab,
    setInitModule,
    tabs,
    translate,
  };
};
