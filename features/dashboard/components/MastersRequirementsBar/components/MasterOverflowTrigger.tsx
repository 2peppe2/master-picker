import Translate from "@/common/components/translate/Translate";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ComponentPropsWithoutRef,
  CSSProperties,
  forwardRef,
} from "react";

interface MasterOverflowTriggerProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  count: number;
  minWidth: CSSProperties["minWidth"];
  presentation: "sheet" | "popover";
}

const MasterOverflowTrigger = forwardRef<
  HTMLButtonElement,
  MasterOverflowTriggerProps
>(({ count, minWidth, presentation, className, style, ...props }, ref) => (
  <Badge asChild variant="outline">
    <button
      {...props}
      ref={ref}
      type="button"
      data-master-overflow-badge
      data-master-overflow-presentation={presentation}
      style={{ ...style, minWidth }}
      className={cn(
        "h-8 w-full shrink-0 cursor-pointer flex items-center justify-center border transition-colors hover:bg-muted/50",
        className,
      )}
    >
      <Translate text="_wildcard_more_count" args={{ count }} />
    </button>
  </Badge>
));

MasterOverflowTrigger.displayName = "MasterOverflowTrigger";

export default MasterOverflowTrigger;
