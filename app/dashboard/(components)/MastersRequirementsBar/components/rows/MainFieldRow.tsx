"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import Translate from "@/common/components/translate/Translate";
import { MainFieldRequirement } from "@/app/dashboard/page";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface MainFieldRowProps {
  requirement: MainFieldRequirement;
  fieldProgress?: Record<string, number>;
}

const MainFieldRow: FC<MainFieldRowProps> = ({
  requirement,
  fieldProgress = {},
}) => (
  <div className="flex flex-col gap-2">
    <span className="leading-snug">
      <Translate text="have_at_least" />{" "}
      <b className="text-foreground font-semibold">{requirement.credits} HP</b>{" "}
      <Translate text="in_one_of_the_following_fields" />:
    </span>
    <div className="flex flex-wrap gap-1.5">
      {requirement.fields.map((field) => (
        <div
          key={field}
          className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-medium transition-colors",
            (fieldProgress[field] || 0) >= requirement.credits
              ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
              : "bg-secondary/50 border-border text-muted-foreground",
          )}
        >
          <span>
            <CourseTranslate text={field} />
          </span>
          <span className="font-mono font-bold border-l border-current/20 pl-1.5">
            {fieldProgress[field] || 0} HP
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default MainFieldRow;
