import { resolveTimeEditSemesterRequest } from "@/app/api/timeedit/params";
import { buildTimeEditCalendarLinks } from "@/lib/timeEdit";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { data, error } = await resolveTimeEditSemesterRequest(
    request.nextUrl.searchParams,
  );
  if (error) return error;

  const links = buildTimeEditCalendarLinks(data);

  return NextResponse.json({
    ...links,
    // Kept for backwards compatibility with the original response shape.
    url: links.timeEditUrl,
  });
};
