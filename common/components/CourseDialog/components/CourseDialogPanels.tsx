"use client";

import ScrollableTabsContent from "./ScrollableTabsContent";
import ExaminationTab from "../tabs/examination";
import EvaluateScore from "../tabs/evaluate";
import Statistics from "../tabs/statistics";
import OverviewTab from "../tabs/overview";
import { Course } from "@/common/types";
import { DialogChrome } from "../types";
import { FC } from "react";

interface CourseDialogPanelsProps {
  course: Course;
  chrome: DialogChrome;
  showAdd: boolean;
  preferredSemesters?: number[];
  initModule?: string;
  setInitModule: (value: string | undefined) => void;
  selectedStatModule: string;
  setSelectedStatModule: (value: string) => void;
  setActiveTab: (value: string) => void;
}

/**
 * The dialog's tab bodies. Radix mounts only the active panel, so writing the
 * tabs out here keeps every inactive tab's tree from being built on each
 * render the way a prebuilt `content` element per tab would.
 */
const CourseDialogPanels: FC<CourseDialogPanelsProps> = ({
  course,
  chrome,
  showAdd,
  preferredSemesters,
  initModule,
  setInitModule,
  selectedStatModule,
  setSelectedStatModule,
  setActiveTab,
}) => (
  <>
    <ScrollableTabsContent value="overview" chrome={chrome}>
      <OverviewTab
        course={course}
        showAdd={showAdd}
        preferredSemesters={preferredSemesters}
      />
    </ScrollableTabsContent>

    <ScrollableTabsContent value="examination" chrome={chrome}>
      <ExaminationTab
        course={course}
        onNavigateToStatistics={(modCode?: string) => {
          setInitModule(modCode);
          setActiveTab("statistics");
        }}
      />
    </ScrollableTabsContent>

    <ScrollableTabsContent value="statistics" chrome={chrome}>
      <Statistics
        course={course}
        initialStatModule={initModule}
        selectedModule={selectedStatModule}
        setSelectedModule={setSelectedStatModule}
        onInitialStatConsumed={() => setInitModule(undefined)}
      />
    </ScrollableTabsContent>

    <ScrollableTabsContent value="evaliuate-score" chrome={chrome}>
      <EvaluateScore courseCode={course.code} />
    </ScrollableTabsContent>
  </>
);

export default CourseDialogPanels;
