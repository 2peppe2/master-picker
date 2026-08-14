import {
  buildTimeEditSemesterUrl,
  resolveTimeEditCourseObjectIds,
} from "@/lib/timeEdit";
import { NextRequest, NextResponse } from "next/server";

const isSemester = (value: string | null): value is "HT" | "VT" =>
  value === "HT" || value === "VT";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const semester = searchParams.get("semester");
  const year = Number(searchParams.get("year"));
  const courseCodes = searchParams
    .getAll("course")
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  if (!isSemester(semester) || !Number.isInteger(year)) {
    return NextResponse.json(
      { error: "Missing or invalid semester/year." },
      { status: 400 },
    );
  }

  if (courseCodes.length === 0) {
    return NextResponse.json(
      { error: "No course codes were provided." },
      { status: 400 },
    );
  }

  const { objectIds } = await resolveTimeEditCourseObjectIds(courseCodes);

  if (objectIds.length === 0) {
    return NextResponse.json(
      { error: "No TimeEdit course objects could be resolved." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    url: buildTimeEditSemesterUrl({ objectIds, semester, year }),
  });
};
