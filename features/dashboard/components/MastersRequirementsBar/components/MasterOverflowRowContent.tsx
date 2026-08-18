import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { MasterIcon } from "@/common/components/MasterIcon";
import { ProcessedMaster } from "../types";
import { FC } from "react";

interface MasterOverflowRowContentProps {
  iconName: string | null;
  master: ProcessedMaster;
  progressPercentage: number;
}

const MasterOverflowRowContent: FC<MasterOverflowRowContentProps> = ({
  iconName,
  master,
  progressPercentage,
}) => (
  <>
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 rounded-md bg-background/50 backdrop-blur-sm border border-border/50 shrink-0">
          <MasterIcon iconName={iconName} className="size-3.5 opacity-90" />
        </div>
        <div className="truncate text-xs font-semibold opacity-90">
          <CourseTranslate text={master.name} />
        </div>
      </div>
      {progressPercentage > 0 && (
        <span className="text-2xs font-bold tabular-nums opacity-60 shrink-0">
          {progressPercentage}%
        </span>
      )}
    </div>

    <div className="relative h-1 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full bg-current transition-all duration-1000 ease-out opacity-40"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  </>
);

export default MasterOverflowRowContent;
