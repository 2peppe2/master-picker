"use client";

import { cn } from "@/lib/utils";

import MasterBadge from "@/common/components/MasterBadge";
import Translate from "@/common/components/translate/Translate";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { CourseOccasion } from "@/common/types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus } from "lucide-react";
import { FC, useMemo } from "react";

interface MobileOccasionCardProps {
  occasion: CourseOccasion;
  onAdd: () => void;
  showAdd: boolean;
  hasCollision: boolean;
}

const MobileOccasionCard: FC<MobileOccasionCardProps> = ({
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
  const relativeSemester = useMemo(
    () =>
      toRelativeSemester({
        year: occasion.year,
        semester: occasion.semester,
      }),
    [occasion.semester, occasion.year, toRelativeSemester],
  );

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
          <MobileValuePill label={translate("period")} values={periods} />
          <MobileValuePill label={translate("block")} values={blocks} />
        </div>
      </div>

      {occasion.recommendedMaster.length > 0 && (
        <div className="mt-4 border-t border-border/50 pt-3">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground">
            <Translate text="recommended_for_master" />
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

interface MobileValuePillProps {
  label: string;
  values: number[];
}

const MobileValuePill: FC<MobileValuePillProps> = ({ label, values }) => (
  <div className="min-w-14 rounded-xl bg-muted px-2.5 py-1.5 text-center">
    <span className="block text-[10px] text-muted-foreground">{label}</span>
    <span className="font-semibold text-foreground">
      {values.length > 0 ? values.join(", ") : "–"}
    </span>
  </div>
);

export default MobileOccasionCard;
