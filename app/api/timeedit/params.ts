import { resolveTimeEditCourseObjectIds } from "@/lib/timeEdit";
import { NextResponse } from "next/server";

const isSemester = (value: string | null): value is "HT" | "VT" =>
  value === "HT" || value === "VT";

interface ResolvedSemesterRequest {
  objectIds: string[];
  semester: "HT" | "VT";
  year: number;
}

/**
 * Parses and validates the shared `?semester=&year=&course=` query used by the
 * TimeEdit routes, and resolves the course codes to TimeEdit object ids.
 * Returns a NextResponse to send back as-is when the request cannot be served.
 */
export const resolveTimeEditSemesterRequest = async (
  searchParams: URLSearchParams,
): Promise<
  | { data: ResolvedSemesterRequest; error?: never }
  | { data?: never; error: NextResponse }
> => {
  const semester = searchParams.get("semester");
  const year = Number(searchParams.get("year"));
  const courseCodes = searchParams
    .getAll("course")
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  if (!isSemester(semester) || !Number.isInteger(year)) {
    return {
      error: NextResponse.json(
        { error: "Missing or invalid semester/year." },
        { status: 400 },
      ),
    };
  }

  if (courseCodes.length === 0) {
    return {
      error: NextResponse.json(
        { error: "No course codes were provided." },
        { status: 400 },
      ),
    };
  }

  const { objectIds } = await resolveTimeEditCourseObjectIds(courseCodes);

  if (objectIds.length === 0) {
    return {
      error: NextResponse.json(
        { error: "No TimeEdit course objects could be resolved." },
        { status: 404 },
      ),
    };
  }

  return { data: { objectIds, semester, year } };
};
