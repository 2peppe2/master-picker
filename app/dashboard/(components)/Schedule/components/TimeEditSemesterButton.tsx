"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import Translate from "@/common/components/translate/Translate";
import { Slot } from "@/app/dashboard/(store)/schedule/types";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Apple, CalendarDays, ExternalLink, Loader2 } from "lucide-react";
import { FC, ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CalendarLinks {
  timeEditUrl: string;
  icsUrl: string;
  webcalUrl: string;
  googleUrl: string;
}

interface TimeEditSemesterButtonProps {
  periods: Slot[][];
  semester: "HT" | "VT";
  year: number;
}

const TimeEditSemesterButton: FC<TimeEditSemesterButtonProps> = ({
  periods,
  semester,
  year,
}) => {
  const translate = useCommonTranslate();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState<CalendarLinks | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  // The course set the currently held links were resolved for, so the popover
  // only refetches once the semester's courses actually change.
  const resolvedForRef = useRef<string | null>(null);

  const courseCodes = useMemo(
    () =>
      Array.from(
        new Set(
          periods
            .flat()
            .filter((course) => course !== null)
            .map((course) => course.code),
        ),
      ),
    [periods],
  );

  const searchParams = useMemo(() => {
    const params = new URLSearchParams({ semester, year: year.toString() });
    courseCodes.forEach((code) => params.append("course", code));

    return params.toString();
  }, [courseCodes, semester, year]);

  const loadLinks = useCallback(async () => {
    if (resolvedForRef.current === searchParams) return;

    setIsLoading(true);
    setErrorKey(null);

    try {
      const response = await fetch(
        `/api/timeedit/semester-url?${searchParams}`,
      );

      if (!response.ok) {
        setLinks(null);
        setErrorKey(
          response.status === 404 ? "_timeedit_no_matches" : "_timeedit_error",
        );
        return;
      }

      setLinks((await response.json()) as CalendarLinks);
      resolvedForRef.current = searchParams;
    } catch {
      setLinks(null);
      setErrorKey("_timeedit_error");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) void loadLinks();
  };

  const hasCourses = courseCodes.length > 0;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 px-2 hover:bg-accent"
          disabled={!hasCourses}
          title={
            hasCourses
              ? translate("_calendar_subscribe_title")
              : translate("_timeedit_no_courses")
          }
          onClick={(e) => e.stopPropagation()}
        >
          <CalendarDays className="size-4" />
          <span className="hidden xl:inline">
            <Translate text="_calendar_button" />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-2 px-4 pb-2 pt-3">
          <div className="flex-1">
            <p className="text-sm font-semibold">
              <Translate text="_calendar_subscribe_title" />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              <Translate text="_calendar_replan_hint" />
            </p>
          </div>
          {isLoading && (
            <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* The rows are always mounted so the popover never resizes once the
            links resolve -- they just turn from placeholders into links. */}
        <div className="flex flex-col p-1">
          <CalendarRow
            href={links?.googleUrl}
            target="_blank"
            icon={<CalendarDays className="size-4" />}
            label={<Translate text="_calendar_google" />}
          />
          <CalendarRow
            href={links?.webcalUrl}
            icon={<Apple className="size-4" />}
            label={<Translate text="_calendar_apple" />}
          />
          <CalendarRow
            href={links?.timeEditUrl}
            target="_blank"
            icon={<ExternalLink className="size-4" />}
            label={<Translate text="_timeedit_open_semester" />}
          />
        </div>

        {errorKey && (
          <p className="px-4 pb-3 pt-1 text-xs text-muted-foreground">
            <Translate text={errorKey} />
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
};

interface CalendarRowProps {
  icon: ReactNode;
  label: ReactNode;
  /** Undefined while the links are still resolving, or after a failure. */
  href?: string;
  target?: string;
}

const CalendarRow: FC<CalendarRowProps> = ({ icon, label, href, target }) => {
  const className = cn(
    "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm",
    "transition-colors",
    href
      ? "hover:bg-accent hover:text-accent-foreground"
      : "pointer-events-none opacity-50",
  );

  const content = (
    <>
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <span>{label}</span>
    </>
  );

  if (!href) {
    return (
      <span className={className} aria-disabled>
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  );
};

export default TimeEditSemesterButton;
