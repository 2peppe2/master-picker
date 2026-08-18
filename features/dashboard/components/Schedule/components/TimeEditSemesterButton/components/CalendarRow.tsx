"use client";

import Translate from "@/common/components/translate/Translate";
import { ChevronRight, Loader2 } from "lucide-react";
import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalendarRowContentProps {
  icon: ReactNode;
  label: ReactNode;
  /** One line on what tapping the row actually does. */
  hint: ReactNode;
  /** Undefined while the links are still resolving, or after a failure. */
  href?: string;
  /** Distinguishes "still resolving" from "resolved to nothing". */
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

    {/* Only a resolved row is actionable, so the affordance follows the link. */}
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

const rowClasses = (href: string | undefined, phone: boolean) =>
  cn(
    "group flex w-full items-center gap-3 rounded-lg border text-left",
    "px-3 py-2.5 transition-colors",
    phone ? "min-h-14" : "min-h-12",
    href
      ? cn(
          "border-border/60 hover:border-border hover:bg-accent",
          "hover:text-accent-foreground active:bg-accent/80",
        )
      : "pointer-events-none border-transparent opacity-60",
  );

interface CalendarRowProps extends CalendarRowContentProps {
  target?: string;
  phone?: boolean;
}

const CalendarRow: FC<CalendarRowProps> = ({
  icon,
  label,
  hint,
  href,
  target,
  loading = false,
  phone = false,
}) => {
  if (!href) {
    return (
      <span className={rowClasses(href, phone)} aria-disabled>
        <CalendarRowContent
          icon={icon}
          label={label}
          hint={hint}
          loading={loading}
        />
      </span>
    );
  }

  return (
    <a
      href={href}
      className={rowClasses(href, phone)}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      <CalendarRowContent
        icon={icon}
        label={label}
        hint={hint}
        href={href}
        loading={loading}
      />
    </a>
  );
};

export default CalendarRow;
