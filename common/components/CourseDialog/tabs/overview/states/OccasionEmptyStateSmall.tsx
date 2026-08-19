import { cn } from "@/lib/utils";
import Translate from "@/common/components/translate/Translate";

const OccasionEmptyStateSmall = () => (
  <div
    className={cn(
      "rounded-2xl bg-muted/40 p-5 text-center text-sm",
      "text-muted-foreground landscape-phone:col-span-full",
    )}
  >
    <Translate text="_course_no_occasions" />
  </div>
);

export default OccasionEmptyStateSmall;
