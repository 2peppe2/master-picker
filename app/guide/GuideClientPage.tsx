"use client";

import type { CourseRequirements } from "./page";

interface GuideClientPageProps {
  courseRequirements: CourseRequirements;
}

const GuideClientPage = ({ courseRequirements } : GuideClientPageProps) => {
  return (
    <div>
      {courseRequirements.map((cr, index) => (
        <div key={index}>
          {cr.courses.map((c) =>
            typeof c.course === "string" ? c.course : JSON.stringify(c.course)
          ).join(", ")}
        </div>
      ))}
    </div>
  );
};

export default GuideClientPage;
