import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Translate from "@/common/components/translate/Translate";

const StatisticsLoadingState = () => (
  <div
    className={cn(
      "flex min-h-[300px] h-full w-full flex-col items-center",
      "justify-center gap-4 text-muted-foreground",
    )}
  >
    <Loader2 className="h-8 w-8 animate-spin motion-reduce:animate-none" />
    <p className="text-sm font-medium">
      <Translate text="_course_loading_stats" />
    </p>
  </div>
);

export default StatisticsLoadingState;
