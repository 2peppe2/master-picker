"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { Course } from "@/common/types";
import { useEffect, useMemo, useState } from "react";

interface UseCourseDialogStateProps {
  course: Course;
  open: boolean;
}

/**
 * Coordinates active dialog tabs and their tab-specific selection state.
 *
 * Only tab metadata is produced here -- the panels render their own content so
 * a statistics selection does not rebuild every other tab's element tree.
 */
export const useCourseDialogState = ({
  course,
  open,
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
      { name: translate("course_tab_overview"), value: "overview" },
      { name: translate("course_tab_examination"), value: "examination" },
      { name: translate("course_tab_statistics"), value: "statistics" },
      { name: translate("_course_tab_evaluate"), value: "evaliuate-score" },
    ],
    [translate],
  );

  return {
    activeTab,
    setActiveTab,
    initModule,
    setInitModule,
    selectedStatModule,
    setSelectedStatModule,
    tabs,
    translate,
  };
};
