"use client";

import { cn } from "@/lib/utils";

import MasterBadge from "@/common/components/MasterBadge";
import Translate from "@/common/components/translate/Translate";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { CourseOccasion } from "@/common/types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus } from "lucide-react";
import { FC } from "react";
import OccasionValuePillSmall from "./OccasionValuePillSmall";

interface OccasionCardSmallProps {
  occasion: CourseOccasion;
  onAdd: () => void;
  showAdd: boolean;
  hasCollision: boolean;
}

const OccasionCardSmall: FC<OccasionCardSmallProps> = ({
  occasion,
  onAdd,
  showAdd,
  hasCollision,
}) => {
  const translate = useCommonTranslate();
  const toRelativeSemester = useToRelativeSemester();
  const periods = occasion.periods.map((item) => item.period);
  const blocks = Array.from(
    new Set(occasion.periods.flatMap((item) => item.blocks)),
  );
  const relativeSemester = toRelativeSemester({
    year: occasion.year,
    semester: occasion.semester,
  });

  return (
    <article className="rounded-2xl bg-muted/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">
            {translate("semester")} {relativeSemester + 1}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {translate(occasion.semester)} {occasion.year}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5 text-xs">
          <OccasionValuePillSmall label={translate("period")} values={periods} />
          <OccasionValuePillSmall label={translate("block")} values={blocks} />
        </div>
      </div>

      {occasion.recommendedMaster.length > 0 && (
        <div className="mt-4 border-t border-border/50 pt-3">
          <p className="mb-2 text-2xs font-medium text-muted-foreground">
            <Translate text="_recommended_for_master" />
          </p>
          <div className="flex flex-wrap gap-1.5">
            {occasion.recommendedMaster.map((master) => (
              <MasterBadge
                key={master.master}
                name={master.master}
                title
                style="mr-0 max-w-full"
              />
            ))}
          </div>
        </div>
      )}

      {hasCollision && (
        <div
          className={cn(
            "mt-4 flex items-center gap-2 rounded-xl",
            "bg-amber-500/12 px-3 py-2.5 text-xs font-medium",
            "text-amber-800 dark:text-amber-300",
          )}
        >
          <AlertTriangle className="size-4 shrink-0" />
          <Translate text="_course_schedule_conflict" />
        </div>
      )}

      {showAdd && (
        <Button
          type="button"
          onClick={onAdd}
          className="mt-4 h-11 w-full rounded-xl font-semibold"
        >
          <Plus className="size-4" />
          <Translate text="_course_add_course" />
        </Button>
      )}
    </article>
  );
};

export default OccasionCardSmall;
