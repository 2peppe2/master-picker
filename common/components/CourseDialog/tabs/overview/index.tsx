"use client";

import OverviewDetailsSection from "./components/OverviewDetailsSection";
import OverviewSectionHeader from "./components/OverviewSectionHeader";
import { Course } from "@/common/types";
import OccasionTable from "./components/OccasionTable";
import { FC } from "react";

interface OverviewTabProps {
  course: Course;
  showAdd: boolean;
  preferredSemesters?: number[];
}

const OverviewTab: FC<OverviewTabProps> = ({
  course,
  showAdd,
  preferredSemesters,
}) => (
  <div className="space-y-4 py-3 text-foreground">
    <OverviewDetailsSection course={course} />

    <section className="space-y-2">
      <OverviewSectionHeader count={course.CourseOccasion.length} />
      <OccasionTable
        course={course}
        showAdd={showAdd}
        preferredSemesters={preferredSemesters}
      />
    </section>
  </div>
);

export default OverviewTab;
