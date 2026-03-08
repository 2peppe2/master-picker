"use client";

import CourseSelectionRow from "./rows/CourseSelectionRow";
import MainFieldRow from "./rows/MainFieldRow";
import { FC, ReactNode, useMemo } from "react";
import { RequirementUnion } from "../../page";
import CreditRow from "./rows/CreditRow";
import { cn } from "@/lib/utils";
import {
  LucideCircleCheck,
  LucideCircleDashed,
  LucideGraduationCap,
  LucideFolderTree,
  LucideBookOpen,
} from "lucide-react";

interface MasterBadgeTooltipProps {
  master: string;
  name: string;
  all: RequirementUnion[];
  fulfilled: RequirementUnion[];
}

export const MasterBadgeRequirementTooltip: FC<MasterBadgeTooltipProps> = ({
  all,
  name,
  fulfilled,
}) => {
  const categories = useMemo(
    () => ({
      degree: all.filter((r) =>
        [
          "CREDITS_TOTAL",
          "CREDITS_MASTER_TOTAL",
          "CREDITS_ADVANCED_MASTER",
        ].includes(r.type),
      ),
      profile: all.filter((r) =>
        [
          "CREDITS_PROFILE_TOTAL",
          "CREDITS_ADVANCED_PROFILE",
          "CREDITS_MAIN_FIELD_TOTAL",
        ].includes(r.type),
      ),
      courses: all.filter((r) => r.type === "COURSE_SELECTION"),
    }),
    [all],
  );

  return (
    <div className="flex flex-col gap-4 p-3 max-w-[400px] bg-popover text-popover-foreground border border-border rounded-xl shadow-xl backdrop-blur-sm">
      <header className="space-y-2">
        <h4 className="font-bold text-sm tracking-tight">{name}</h4>
      </header>

      <div className="space-y-5">
        <Section
          title="Degree"
          icon={<LucideGraduationCap size={14} />}
          items={categories.degree}
          fulfilled={fulfilled}
        />
        <Section
          title="Profile"
          icon={<LucideFolderTree size={14} />}
          items={categories.profile}
          fulfilled={fulfilled}
        />
        <Section
          title="Courses"
          icon={<LucideBookOpen size={14} />}
          items={categories.courses}
          fulfilled={fulfilled}
        />
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  icon: ReactNode;
  items: RequirementUnion[];
  fulfilled: RequirementUnion[];
}

const Section: FC<SectionProps> = ({ title, icon, items, fulfilled }) => {
  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span className="p-1 rounded bg-secondary text-primary">{icon}</span>
        {title}
      </div>
      <div className="grid gap-2 ml-1">
        {items.map((requirement, index: number) => (
          <RowRenderer
            key={`master-requirement-row-${index}`}
            requirement={requirement}
            isFulfilled={fulfilled.some(
              (f) => JSON.stringify(f) === JSON.stringify(requirement),
            )}
          />
        ))}
      </div>
    </div>
  );
};

interface RowRendererProps {
  requirement: RequirementUnion;
  isFulfilled: boolean;
}

const RowRenderer: FC<RowRendererProps> = ({ requirement, isFulfilled }) => (
  <div
    className={cn(
      "flex items-start gap-3 text-[12px] transition-all",
      isFulfilled ? "opacity-100" : "opacity-90",
    )}
  >
    <div className="mt-0.5 shrink-0">
      {isFulfilled ? (
        <LucideCircleCheck
          className="text-green-500 dark:text-green-400"
          size={14}
          strokeWidth={3}
        />
      ) : (
        <LucideCircleDashed
          className="text-muted-foreground/30"
          size={14}
          strokeWidth={2}
        />
      )}
    </div>

    <div className="text-muted-foreground dark:text-zinc-400">
      <RequirementRowContent requirement={requirement} />
    </div>
  </div>
);

interface RowContentProps {
  requirement: RequirementUnion;
}

const RequirementRowContent: FC<RowContentProps> = ({ requirement }) => {
  switch (requirement.type) {
    case "COURSE_SELECTION":
      return <CourseSelectionRow requirement={requirement} />;

    case "CREDITS_MAIN_FIELD_TOTAL":
      return <MainFieldRow requirement={requirement} />;

    case "CREDITS_TOTAL":
    case "CREDITS_MASTER_TOTAL":
    case "CREDITS_PROFILE_TOTAL":
    case "CREDITS_ADVANCED_PROFILE":
    case "CREDITS_ADVANCED_MASTER":
      return <CreditRow requirement={requirement} />;

    default:
      throw new Error(
        `Unhandled requirement type: ${JSON.stringify(requirement)}`,
      );
  }
};
