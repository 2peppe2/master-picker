const TIME_EDIT_SCHEMA_BASE_URL =
  "https://cloud.timeedit.net/liu/web/schema";
const TIME_EDIT_SID = "3";
const TIME_EDIT_COURSE_TYPE_ID = "219";
const TIME_EDIT_NON_HISTORICAL_FILTER = "132.0";
const TIME_EDIT_PERIOD_WEEKS = {
  VT: [
    { startYearOffset: 0, startWeek: 4, endYearOffset: 0, endWeek: 13 },
    { startYearOffset: 0, startWeek: 14, endYearOffset: 0, endWeek: 23 },
  ],
  HT: [
    { startYearOffset: 0, startWeek: 36, endYearOffset: 0, endWeek: 43 },
    { startYearOffset: 0, startWeek: 44, endYearOffset: 1, endWeek: 2 },
  ],
} as const;

const buildTimeEditCourseSearchUrl = (
  courseCode: string,
  filters: string[] = [],
) => {
  const params = new URLSearchParams({
    max: "100",
    fr: "t",
    partajax: "t",
    im: "f",
    sid: TIME_EDIT_SID,
    search_text: courseCode,
    types: TIME_EDIT_COURSE_TYPE_ID,
  });
  filters.forEach((filter) => params.append("fe", filter));

  return `${TIME_EDIT_SCHEMA_BASE_URL}/objects.html?${params.toString()}`;
};

const parseTimeEditCourseObjectId = (
  html: string,
  courseCode: string,
) => {
  const normalizedCode = courseCode.trim().toUpperCase();

  for (const match of html.matchAll(/<div\b[^>]*\bsearchObject\b[^>]*>/g)) {
    const id = getHtmlAttribute(match[0], "data-id");
    const name = getHtmlAttribute(match[0], "data-name");
    if (!id || !name) continue;

    if (decodeHtmlAttribute(name).trim().toUpperCase().startsWith(`${normalizedCode},`)) {
      return id;
    }
  }

  return null;
};

const objectIdCache = new Map<string, string>();

export const resolveTimeEditCourseObjectIds = async (courseCodes: string[]) => {
  const uniqueCourseCodes = Array.from(
    new Set(courseCodes.map((code) => code.trim().toUpperCase()).filter(Boolean)),
  );

  const results = await Promise.all(
    uniqueCourseCodes.map(async (courseCode) => {
      const cached = objectIdCache.get(courseCode);
      if (cached !== undefined) return { objectId: cached };

      const objectId =
        (await resolveTimeEditCourseObjectId(courseCode)) ??
        (await resolveTimeEditCourseObjectId(courseCode, [
          TIME_EDIT_NON_HISTORICAL_FILTER,
        ]));

      // Only cache hits: a miss may just mean the course is not published yet.
      if (objectId !== null) objectIdCache.set(courseCode, objectId);

      return { objectId };
    }),
  );

  return {
    objectIds: results
      .map((result) => result.objectId)
      .filter((objectId): objectId is string => objectId !== null),
  };
};

const resolveTimeEditCourseObjectId = async (
  courseCode: string,
  filters: string[] = [],
) => {
  const response = await fetch(buildTimeEditCourseSearchUrl(courseCode, filters), {
    cache: "no-store",
  });
  if (!response.ok) return null;

  return parseTimeEditCourseObjectId(await response.text(), courseCode);
};

interface TimeEditSemesterOptions {
  objectIds: string[];
  semester: "HT" | "VT";
  year: number;
}

const buildTimeEditSemesterParams = ({
  objectIds,
  semester,
  year,
}: TimeEditSemesterOptions) => {
  const range = getTimeEditSemesterRange({ semester, year });

  return new URLSearchParams({
    h: "t",
    sid: TIME_EDIT_SID,
    p: `${range.start}.x,${range.end}.x`,
    objects: objectIds.join(","),
  }).toString();
};

export const buildTimeEditSemesterUrl = (options: TimeEditSemesterOptions) =>
  `${TIME_EDIT_SCHEMA_BASE_URL}/ri.html?${buildTimeEditSemesterParams(options)}`;

export const buildTimeEditSemesterIcsUrl = (options: TimeEditSemesterOptions) =>
  `${TIME_EDIT_SCHEMA_BASE_URL}/ri.ics?${buildTimeEditSemesterParams(options)}`;

/**
 * Builds every link needed to either view the semester in TimeEdit or
 * subscribe to it from a calendar app. The subscription targets point at
 * TimeEdit directly so the feed keeps working independently of this app, and
 * they cover the whole semester -- both study periods.
 */
export const buildTimeEditCalendarLinks = (
  options: TimeEditSemesterOptions,
) => {
  const feedUrl = buildTimeEditSemesterIcsUrl(options);
  const webcalUrl = feedUrl.replace(/^https?:/, "webcal:");

  return {
    timeEditUrl: buildTimeEditSemesterUrl(options),
    icsUrl: feedUrl,
    webcalUrl,
    googleUrl: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`,
  };
};

const getHtmlAttribute = (html: string, attribute: string) => {
  const match = html.match(new RegExp(`${attribute}="([^"]*)"`, "i"));
  return match?.[1] ?? null;
};

const decodeHtmlAttribute = (value: string) =>
  value.replace(/&(?:amp|quot|#39|lt|gt);/g, (entity) => {
    const entities: Record<string, string> = {
      "&amp;": "&",
      "&quot;": '"',
      "&#39;": "'",
      "&lt;": "<",
      "&gt;": ">",
    };

    return entities[entity] ?? entity;
  });

const getTimeEditSemesterRange = ({
  semester,
  year,
}: {
  semester: "HT" | "VT";
  year: number;
}) => {
  const first = TIME_EDIT_PERIOD_WEEKS[semester][0];
  const last = TIME_EDIT_PERIOD_WEEKS[semester][1];

  return {
    start: formatIsoWeekDate(
      year + first.startYearOffset,
      first.startWeek,
      1,
    ),
    end: formatIsoWeekDate(year + last.endYearOffset, last.endWeek, 7),
  };
};

const formatIsoWeekDate = (year: number, week: number, day: number) => {
  const date = isoWeekDate(year, week, day);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");

  return `${yyyy}${mm}${dd}`;
};

const isoWeekDate = (year: number, week: number, day: number) => {
  const januaryFourth = new Date(Date.UTC(year, 0, 4));
  const januaryFourthDay = januaryFourth.getUTCDay() || 7;
  const mondayOfWeekOne = new Date(januaryFourth);
  mondayOfWeekOne.setUTCDate(januaryFourth.getUTCDate() - januaryFourthDay + 1);
  mondayOfWeekOne.setUTCDate(
    mondayOfWeekOne.getUTCDate() + (week - 1) * 7 + day - 1,
  );

  return mondayOfWeekOne;
};
