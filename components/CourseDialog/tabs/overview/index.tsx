"use client";

import OverviewDetailsSection from "./components/OverviewDetailsSection";
import OverviewSectionHeader from "./components/OverviewSectionHeader";
import { Course } from "@/app/dashboard/page";
import OccasionTable from "./components/OccasionTable";
import { FC } from "react";

interface OverviewTabProps {
  course: Course;
  showAdd: boolean;
}

const OverviewTab: FC<OverviewTabProps> = ({ course, showAdd }) => (
  <div className="space-y-3 py-2 text-foreground">
    <OverviewDetailsSection course={course} />

    <section>
      <OverviewSectionHeader count={course.CourseOccasion.length} />
      <div className="rounded-md border">
        <OccasionTable course={course} showAdd={showAdd} />
      </div>
    </section>
  </div>
);

export default OverviewTab;
