"use client";

import Translate from "@/common/components/translate/Translate";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FC } from "react";
import type { Course } from "@/app/dashboard/page";
import type { CourseRequirements } from "../../page";

interface GuideSidebarProps {
  compulsoryCourses: any[];
  electiveCourses: CourseRequirements;
  selections: Record<number, Course[]>;
  activeTab: string;
}

const GuideSidebar: FC<GuideSidebarProps> = ({
  compulsoryCourses,
  electiveCourses,
  selections,
  activeTab,
}) => {
  return (
    <div className="flex flex-col h-fit w-full sticky top-0 max-h-screen overflow-y-auto custom-scrollbar p-3 gap-1">
      {compulsoryCourses.length > 0 && (
        <div
          className={cn(
            "flex items-center px-4 py-3 h-14 relative text-left rounded-xl transition-all border border-transparent",
            activeTab === "compulsory"
              ? "bg-card shadow-sm ring-1 ring-foreground/5"
              : "opacity-70",
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0 shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
            <span className="font-medium text-xs text-foreground">
              <Translate text="_guide_required_courses" />
            </span>
          </div>
          <Check className="ml-auto text-emerald-500 h-3.5 w-3.5" />
        </div>
      )}
      {electiveCourses.map((req, i) => {
        const count = selections[i]?.length || 0;
        const min = req.minCount ?? 1;
        const isFulfilled = count >= min;
        const val = `elective-${i}`;
        const isActive = activeTab === val;

        return (
          <div
            key={`trigger-${i}`}
            className={cn(
              "flex items-center px-4 py-3 h-14 relative text-left rounded-xl transition-all border border-transparent",
              isActive
                ? "bg-card shadow-sm ring-1 ring-foreground/5"
                : "opacity-70",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0 transition-all",
                  isFulfilled
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]",
                )}
              />
              <span className="font-medium text-xs text-foreground">
                <Translate
                  text="_guide_elective_group"
                  args={{ index: i + 1 }}
                />
              </span>
            </div>
            {isFulfilled && (
              <Check className="ml-auto text-emerald-500 h-3.5 w-3.5" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GuideSidebar;
