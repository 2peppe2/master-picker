import Translate from "@/common/components/translate/Translate";
import { ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

export interface CalendarRowContentProps {
  icon: ReactNode;
  label: ReactNode;
  hint: ReactNode;
  href?: string;
  loading: boolean;
}

const CalendarRowContent: FC<CalendarRowContentProps> = ({
  icon,
  label,
  hint,
  href,
  loading,
}) => (
  <>
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md",
        "bg-muted text-muted-foreground transition-colors",
        href && "group-hover:bg-background group-hover:text-foreground",
      )}
    >
      {icon}
    </span>
    <span className="flex min-w-0 flex-1 flex-col leading-tight">
      <span className="truncate text-sm font-medium">{label}</span>
      <span className="truncate text-xs text-muted-foreground">
        {loading ? <Translate text="_calendar_loading" /> : hint}
      </span>
    </span>
    {loading ? (
      <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
    ) : (
      href && (
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            "group-hover:translate-x-0.5 group-hover:text-foreground",
          )}
        />
      )
    )}
  </>
);

export default CalendarRowContent;
