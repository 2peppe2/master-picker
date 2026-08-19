import MasterRequirementRowContent from "./MasterRequirementRowContent";
import { RequirementUnion } from "@/common/types";
import { cn } from "@/lib/utils";
import { LucideCircleCheck, LucideCircleDashed } from "lucide-react";
import { FC } from "react";

interface MasterRequirementRowProps {
  requirement: RequirementUnion;
  isFulfilled: boolean;
}

const MasterRequirementRow: FC<MasterRequirementRowProps> = ({
  requirement,
  isFulfilled,
}) => (
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
      <MasterRequirementRowContent requirement={requirement} />
    </div>
  </div>
);

export default MasterRequirementRow;
