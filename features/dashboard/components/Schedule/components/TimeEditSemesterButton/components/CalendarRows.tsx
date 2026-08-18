"use client";

import { Apple, CalendarDays, ExternalLink } from "lucide-react";
import Translate from "@/common/components/translate/Translate";
import { CalendarLinks } from "../types";
import CalendarRow from "./CalendarRow";
import { FC, memo } from "react";

interface CalendarRowsProps {
  links: CalendarLinks | null;
  isLoading: boolean;
  phone?: boolean;
}

/**
 * The rows are always mounted so the surface never resizes once the links
 * resolve -- they just turn from placeholders into links.
 */
const CalendarRowsComponent: FC<CalendarRowsProps> = ({
  links,
  isLoading,
  phone = false,
}) => (
  <>
    <CalendarRow
      href={links?.googleUrl}
      target="_blank"
      icon={<CalendarDays className="size-4" />}
      label={<Translate text="_calendar_google" />}
      hint={<Translate text="_calendar_google_hint" />}
      loading={isLoading}
      phone={phone}
    />
    <CalendarRow
      href={links?.webcalUrl}
      icon={<Apple className="size-4" />}
      label={<Translate text="_calendar_apple" />}
      hint={<Translate text="_calendar_apple_hint" />}
      loading={isLoading}
      phone={phone}
    />
    <CalendarRow
      href={links?.timeEditUrl}
      target="_blank"
      icon={<ExternalLink className="size-4" />}
      label={<Translate text="_timeedit_open_semester" />}
      hint={<Translate text="_timeedit_open_hint" />}
      loading={isLoading}
      phone={phone}
    />
  </>
);

const CalendarRows = memo(CalendarRowsComponent);

CalendarRows.displayName = "CalendarRows";

export default CalendarRows;
