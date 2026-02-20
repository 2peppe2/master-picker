import { Badge } from "@/components/ui/badge";
import { CourseRequirements } from "../page";
import { FC } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  completedChoiceGroups: number;
  electiveCourses: CourseRequirements;
  isChoiceComplete: boolean;
}

const ProgressCard: FC<ProgressCardProps> = ({completedChoiceGroups, electiveCourses, isChoiceComplete }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 mt-6 rounded-t-2xl border border-b-0 p-4 pb-8 bg-background">
      <div className="mx-auto w-full max-w-5xl">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Selection progress</span>
        <span>
        {completedChoiceGroups}/{electiveCourses.length} groups
        </span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-muted">
        <div
        className="h-full rounded-full transition-all"
        style={{ width: `${(completedChoiceGroups / electiveCourses.length) * 100}%` }}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Badge variant="outline" className="rounded-full border-emerald-200 text-emerald-700">
        {true ? "1. Confirm Required" : <Check className="h-4 w-4"/>}
        </Badge>
        <Badge variant="outline" className={cn(
          "rounded-full border px-3 py-1 font-medium",
          isChoiceComplete
          ? "border-emerald-200 text-emerald-700"
          : "border-sky-200 bg-sky-50 text-sky-700",
        )}>
        {true ? "2. Choose options" : <Check className="h-4 w-4"/>}
        </Badge>

        <Badge variant="outline" className={cn(
          "rounded-full border px-3 py-1 font-medium",
          isChoiceComplete
          ? "border-sky-200 bg-sky-50 text-sky-700"
          : "border-muted bg-muted/40 text-muted-foreground",
        )}>
        {true ? "3. Ready to continue" : <Check className="h-4 w-4"/>}
        </Badge>

      </div>
      </div>
    </div>
  )
};

export default ProgressCard;