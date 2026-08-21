const TIME_EDIT_SCHEMA_BASE_URL =
  "https://cloud.timeedit.net/liu/web/schema";
const TIME_EDIT_SID = "3";
const TIME_EDIT_COURSE_TYPE_ID = "219";
const TIME_EDIT_NON_HISTORICAL_FILTER = "132.0";
/**
 * The weeks each study period runs, matching how TimeEdit itself splits the
 * term: autumn period 1 keeps its exam week (36-44) and period 2 picks up at
 * 45, so an occasion named `2636-2644` is period 1 and `2645-2702` period 2.
 */
const TIME_EDIT_PERIOD_WEEKS = {
  VT: [
    { startYearOffset: 0, startWeek: 4, endYearOffset: 0, endWeek: 13 },
    { startYearOffset: 0, startWeek: 14, endYearOffset: 0, endWeek: 23 },
  ],
  HT: [
    { startYearOffset: 0, startWeek: 36, endYearOffset: 0, endWeek: 44 },
    { startYearOffset: 0, startWeek: 45, endYearOffset: 1, endWeek: 2 },
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

export interface TimeEditCourseOccasion {
  objectId: string;
  /** `YYYYMMDD` of the Monday the occasion starts, when the name carries it. */
  start: string | null;
  /** `YYYYMMDD` of the Sunday the occasion ends, when the name carries it. */
  end: string | null;
}

/**
 * TimeEdit names a course object after the weeks it runs, e.g.
 * `TDDD38, Avancerad programmering i C++, TDDD38 2636-2702`, where `2636-2702`
 * is week 36 of 2026 through week 2 of 2027. That range is the only thing
 * telling the semester's occasion apart from last year's, so parse it out.
 */
const parseOccasionWeekRange = (name: string, courseCode: string) => {
  const escapedCode = courseCode.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match =
    name.match(new RegExp(`${escapedCode}\\s+(\\d{2})(\\d{2})-(\\d{2})(\\d{2})`, "i")) ??
    name.match(/\b(\d{2})(\d{2})-(\d{2})(\d{2})\b/);
  if (!match) return { start: null, end: null };

  const [, startYear, startWeek, endYear, endWeek] = match.map(Number);

  return {
    start: formatIsoWeekDate(2000 + startYear, startWeek, 1),
    end: formatIsoWeekDate(2000 + endYear, endWeek, 7),
  };
};

export const parseTimeEditCourseOccasions = (
  html: string,
  courseCode: string,
): TimeEditCourseOccasion[] => {
  const normalizedCode = courseCode.trim().toUpperCase();
  const occasions: TimeEditCourseOccasion[] = [];

  for (const match of html.matchAll(/<div\b[^>]*\bsearchObject\b[^>]*>/g)) {
    const id = getHtmlAttribute(match[0], "data-id");
    const name = getHtmlAttribute(match[0], "data-name");
    if (!id || !name) continue;

    const decodedName = decodeHtmlAttribute(name).trim();
    if (!decodedName.toUpperCase().startsWith(`${normalizedCode},`)) continue;

    occasions.push({
      objectId: id,
      ...parseOccasionWeekRange(decodedName, normalizedCode),
    });
  }

  return occasions;
};

interface TimeEditSemester {
  semester: "HT" | "VT";
  year: number;
}

export interface TimeEditCourseRequest {
  courseCode: string;
  /** 1-based study periods the course sits in; empty means the whole term. */
  periods: number[];
}

/**
 * Keeps every occasion that overlaps a period the course is actually scheduled
 * in, but only one per distinct week range. A course scheduled in both study
 * periods legitimately needs both of TimeEdit's objects, whereas TEAE01 -- which
 * runs as a separate period 1 (`2636-2644`) and period 2 (`2645-2702`) occasion
 * -- must contribute only the one matching where it sits in the schedule.
 * Per-programme duplicates of a single period would otherwise pile the same
 * events into the calendar several times.
 */
export const selectOccasionsForSemester = (
  occasions: TimeEditCourseOccasion[],
  semester: TimeEditSemester,
  periods: number[] = [],
) => {
  const ranges = getTimeEditPeriodRanges(semester, periods);
  const seenRanges = new Set<string>();
  const selected: string[] = [];

  for (const occasion of occasions) {
    const { start, end } = occasion;
    if (start === null || end === null) continue;

    const overlaps = ranges.some(
      (range) => start <= range.end && end >= range.start,
    );
    if (!overlaps) continue;

    const rangeKey = `${start}-${end}`;
    if (seenRanges.has(rangeKey)) continue;

    seenRanges.add(rangeKey);
    selected.push(occasion.objectId);
  }

  return selected;
};

const objectIdCache = new Map<string, string[]>();

export const resolveTimeEditCourseObjectIds = async (
  requests: TimeEditCourseRequest[],
  semester: TimeEditSemester,
) => {
  const results = await Promise.all(
    mergeRequestsByCourseCode(requests).map(async ({ courseCode, periods }) => {
      const cacheKey = `${courseCode}|${semester.semester}${semester.year}|${periods.join("")}`;
      const cached = objectIdCache.get(cacheKey);
      if (cached !== undefined) return { courseCode, objectIds: cached };

      const occasions = await findTimeEditCourseOccasions(courseCode);
      const objectIds = selectOccasionsForSemester(occasions, semester, periods);

      // Only cache hits: a miss may just mean the course is not published yet.
      if (objectIds.length > 0) objectIdCache.set(cacheKey, objectIds);

      return { courseCode, objectIds };
    }),
  );

  return {
    objectIds: results.flatMap((result) => result.objectIds),
    unresolvedCourseCodes: results
      .filter((result) => result.objectIds.length === 0)
      .map((result) => result.courseCode),
  };
};

/**
 * A course occupying several blocks of the same period arrives once per slot,
 * and the two periods arrive as separate entries. Collapse them so each course
 * is searched for once, carrying every period it is scheduled in.
 */
const mergeRequestsByCourseCode = (requests: TimeEditCourseRequest[]) => {
  const merged = new Map<string, Set<number>>();

  for (const request of requests) {
    const courseCode = request.courseCode.trim().toUpperCase();
    if (!courseCode) continue;

    const periods = merged.get(courseCode) ?? new Set<number>();
    request.periods.forEach((period) => periods.add(period));
    merged.set(courseCode, periods);
  }

  return [...merged].map(([courseCode, periods]) => ({
    courseCode,
    periods: [...periods].sort(),
  }));
};

/**
 * TimeEdit's unfiltered search answers from whichever term it considers
 * current, so it happily hides the upcoming occasion behind an older one. Ask
 * both with and without the non-historical filter and let the caller pick the
 * occasion that actually matches the semester being exported.
 */
const findTimeEditCourseOccasions = async (courseCode: string) => {
  const [filtered, unfiltered] = await Promise.all([
    fetchTimeEditCourseOccasions(courseCode, [TIME_EDIT_NON_HISTORICAL_FILTER]),
    fetchTimeEditCourseOccasions(courseCode),
  ]);

  const seenObjectIds = new Set<string>();

  return [...filtered, ...unfiltered].filter((occasion) => {
    if (seenObjectIds.has(occasion.objectId)) return false;
    seenObjectIds.add(occasion.objectId);

    return true;
  });
};

const fetchTimeEditCourseOccasions = async (
  courseCode: string,
  filters: string[] = [],
) => {
  const response = await fetch(buildTimeEditCourseSearchUrl(courseCode, filters), {
    cache: "no-store",
  });
  if (!response.ok) return [];

  return parseTimeEditCourseOccasions(await response.text(), courseCode);
};

interface TimeEditSemesterOptions extends TimeEditSemester {
  objectIds: string[];
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

/**
 * The date ranges to match occasions against: one per study period the course
 * is scheduled in, or the whole semester when the caller has no period to go on.
 */
const getTimeEditPeriodRanges = (
  { semester, year }: TimeEditSemester,
  periods: number[],
) => {
  const weeks = TIME_EDIT_PERIOD_WEEKS[semester];
  const ranges = periods
    .map((period) => weeks[period - 1])
    .filter((week) => week !== undefined)
    .map((week) => ({
      start: formatIsoWeekDate(year + week.startYearOffset, week.startWeek, 1),
      end: formatIsoWeekDate(year + week.endYearOffset, week.endWeek, 7),
    }));

  return ranges.length > 0
    ? ranges
    : [getTimeEditSemesterRange({ semester, year })];
};

export const getTimeEditSemesterRange = ({ semester, year }: TimeEditSemester) => {
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
