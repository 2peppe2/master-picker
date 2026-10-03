"use client";

import Translate from "@/common/components/translate/Translate";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { CalendarClock } from "lucide-react";
import { FC, useEffect, useState } from "react";

const DEADLINE_DAY_UTC = Date.UTC(2026, 9, 10);
const DAY_MS = 86_400_000;
const stockholmDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Stockholm",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const daysUntilDeadline = (): number => {
  const parts = stockholmDate.formatToParts(new Date());
  const datePart = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  const todayUtc = Date.UTC(
    datePart("year"),
    datePart("month") - 1,
    datePart("day"),
  );
  return Math.max(0, Math.round((DEADLINE_DAY_UTC - todayUtc) / DAY_MS));
};

const RegistrationReminderMessage: FC = () => {
  const translate = useCommonTranslate();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const refresh = () => setDaysLeft(daysUntilDeadline());
    refresh();

    // Calendar days change at a minute boundary, including Stockholm midnight.
    let interval: number | undefined;
    const timeout = window.setTimeout(
      () => {
        refresh();
        interval = window.setInterval(refresh, 60_000);
      },
      60_000 - (Date.now() % 60_000),
    );

    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearTimeout(timeout);
      if (interval !== undefined) window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return (
    <>
      <CalendarClock
        aria-hidden="true"
        className="size-4 shrink-0 text-brand-strong"
      />
      <p
        data-course-registration-reminder
        className="text-center text-xs font-semibold leading-tight text-foreground"
      >
        <Translate text="_course_registration_reminder_intro" />
        {daysLeft !== null && (
          <>
            {" "}
            <span className="text-brand-strong">
              ({daysLeft === 0
                ? translate("_course_registration_last_day")
                : translate("_course_registration_days_left", {
                    count: daysLeft,
                  })})
            </span>
          </>
        )}
        <Translate
          text="_course_registration_reminder_outro"
          components={{
            ladok: (
              <a
                href="https://student.ladok.se/student/app/studentwebb/start"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-brand-strong underline underline-offset-2"
              />
            ),
          }}
        />
      </p>
    </>
  );
};

export default RegistrationReminderMessage;
