"use client";

import { useCourseDialogState } from "../hooks/useCourseDialogState";
import CourseDialogPanels from "./CourseDialogPanels";
import { Course } from "@/common/types";
import DialogTabs from "../DialogTabs";
import { DialogChrome } from "../types";
import { FC } from "react";

interface CourseDialogTabsProps {
  course: Course;
  open: boolean;
  chrome?: DialogChrome;
  showAdd: boolean;
  preferredSemesters?: number[];
}

/**
 * Owns the tab state so neither dialog shell has to thread the per-tab
 * selection through to the panels.
 */
const CourseDialogTabs: FC<CourseDialogTabsProps> = ({
  course,
  open,
  chrome = "top",
  showAdd,
  preferredSemesters,
}) => {
  const {
    activeTab,
    setActiveTab,
    initModule,
    setInitModule,
    selectedStatModule,
    setSelectedStatModule,
    tabs,
  } = useCourseDialogState({ course, open });

  return (
    <DialogTabs
      tabs={tabs}
      value={activeTab}
      chrome={chrome}
      onValueChange={(value) => {
        setActiveTab(value);
        if (value !== "statistics") setInitModule(undefined);
      }}
    >
      <CourseDialogPanels
        course={course}
        chrome={chrome}
        showAdd={showAdd}
        preferredSemesters={preferredSemesters}
        initModule={initModule}
        setInitModule={setInitModule}
        selectedStatModule={selectedStatModule}
        setSelectedStatModule={setSelectedStatModule}
        setActiveTab={setActiveTab}
      />
    </DialogTabs>
  );
};

export default CourseDialogTabs;
