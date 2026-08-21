import {
  resolveTimeEditCourseObjectIds,
  TimeEditCourseRequest,
} from "@/lib/timeEdit";
import { NextResponse } from "next/server";

const isSemester = (value: string | null): value is "HT" | "VT" =>
  value === "HT" || value === "VT";

/**
 * Each `course` value is `<period>:<code>`, so a course that runs as a separate
 * period 1 and period 2 occasion in TimeEdit resolves to the occasion matching
 * where it actually sits in the schedule. A bare `<code>` stays valid and means
 * "anywhere this semester".
 */
const parseCourseRequest = (value: string): TimeEditCourseRequest | null => {
  const [first, second] = value.split(":");
  const courseCode = (second ?? first).trim();
  if (!courseCode) return null;

  const period = second === undefined ? NaN : Number(first);

  return {
    courseCode,
    periods: Number.isInteger(period) ? [period] : [],
  };
};

interface ResolvedSemesterRequest {
  objectIds: string[];
  unresolvedCourseCodes: string[];
  semester: "HT" | "VT";
  year: number;
}

/**
 * Parses and validates the shared `?semester=&year=&course=` query used by the
 * TimeEdit routes, and resolves the course requests to TimeEdit object ids.
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
  const courseRequests = searchParams
    .getAll("course")
    .flatMap((value) => value.split(","))
    .map(parseCourseRequest)
    .filter((request): request is TimeEditCourseRequest => request !== null);

  if (!isSemester(semester) || !Number.isInteger(year)) {
    return {
      error: NextResponse.json(
        { error: "Missing or invalid semester/year." },
        { status: 400 },
      ),
    };
  }

  if (courseRequests.length === 0) {
    return {
      error: NextResponse.json(
        { error: "No course codes were provided." },
        { status: 400 },
      ),
    };
  }

  const { objectIds, unresolvedCourseCodes } =
    await resolveTimeEditCourseObjectIds(courseRequests, { semester, year });

  if (objectIds.length === 0) {
    return {
      error: NextResponse.json(
        { error: "No TimeEdit course objects could be resolved." },
        { status: 404 },
      ),
    };
  }

  return { data: { objectIds, unresolvedCourseCodes, semester, year } };
};
