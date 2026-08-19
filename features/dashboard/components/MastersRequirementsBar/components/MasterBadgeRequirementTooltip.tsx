"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import MasterRequirementSection from "./MasterRequirementSection";
import { RequirementUnion } from "@/common/types";
import { FC, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  LucideGraduationCap,
  LucideFolderTree,
  LucideBookOpen,
} from "lucide-react";

interface MasterBadgeTooltipProps {
  master: string;
  name: string;
  all: RequirementUnion[];
  fulfilled: RequirementUnion[];
  className?: string;
}

const MasterBadgeRequirementTooltip: FC<MasterBadgeTooltipProps> = ({
  all,
  name,
  fulfilled,
  className,
}) => {
  const translate = useCommonTranslate();

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
    <div
      data-slot="master-requirement-panel"
      className={cn(
        "flex flex-col gap-4 p-3 max-w-[400px] bg-popover text-popover-foreground border border-border rounded-xl shadow-xl backdrop-blur-sm",
        className,
      )}
    >
      <header className="space-y-2">
        <h4 className="text-sm font-bold">
          <CourseTranslate text={name} />
        </h4>
      </header>

      <div className="space-y-5">
        <MasterRequirementSection
          title={translate("degree")}
          icon={<LucideGraduationCap size={14} />}
          items={categories.degree}
          fulfilled={fulfilled}
        />
        <MasterRequirementSection
          title={translate("profile")}
          icon={<LucideFolderTree size={14} />}
          items={categories.profile}
          fulfilled={fulfilled}
        />
        <MasterRequirementSection
          title={translate("courses")}
          icon={<LucideBookOpen size={14} />}
          items={categories.courses}
          fulfilled={fulfilled}
        />
      </div>
    </div>
  );
};

export default MasterBadgeRequirementTooltip;
