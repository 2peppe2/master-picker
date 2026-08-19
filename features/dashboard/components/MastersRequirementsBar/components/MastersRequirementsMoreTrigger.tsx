import Translate from "@/common/components/translate/Translate";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";

interface MastersRequirementsMoreTriggerProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  count: number;
}

const MastersRequirementsMoreTrigger = forwardRef<
  HTMLButtonElement,
  MastersRequirementsMoreTriggerProps
>(({ count, className, ...props }, ref) => (
  <Badge
    asChild
    variant="outline"
    className={cn(
      "h-8 text-2xs font-bold text-muted-foreground flex-1 min-w-0",
      "bg-background/50 cursor-pointer hover:bg-muted/80 transition-colors",
      "justify-center px-3",
      className,
    )}
  >
    <button
      {...props}
      ref={ref}
      type="button"
      data-master-overflow-list-trigger
    >
      <Translate text="_wildcard_more_count" args={{ count }} />
    </button>
  </Badge>
));

MastersRequirementsMoreTrigger.displayName =
  "MastersRequirementsMoreTrigger";

export default MastersRequirementsMoreTrigger;
