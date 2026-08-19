"use client";

import CalendarRowContent, { CalendarRowContentProps } from "./CalendarRowContent";
import { FC } from "react";
import { cn } from "@/lib/utils";

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
