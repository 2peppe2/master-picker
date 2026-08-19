import { cn } from "@/lib/utils";
import { BarChart2 } from "lucide-react";
import Translate from "@/common/components/translate/Translate";

const StatisticsEmptyState = () => (
  <div
    className={cn(
      "flex min-h-[300px] h-full w-full flex-col items-center",
      "justify-center gap-4 text-muted-foreground",
    )}
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
      <BarChart2 className="h-6 w-6 opacity-50" />
    </div>
    <p className="text-sm font-medium">
      <Translate text="_course_stat_none" />
    </p>
  </div>
);

export default StatisticsEmptyState;
