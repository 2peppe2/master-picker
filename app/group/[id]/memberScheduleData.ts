import { getMastersWithRequirements } from "@/app/actions/getMasters";
import { Course } from "@/app/dashboard/page";
import { courseWithDetailsArgs, normalizeCourse } from "@/app/courseNormalizer";
import { prisma } from "@/lib/prisma";
import { GroupMemberSchedule } from "@/prisma/generated/groups-client/client";
import { decodeGroupSchedulePayload } from "./scheduleCodec";

const SCHEDULE_URL_BASE = "https://www.masterpicker.se";
const MASTER_PERIOD = { start: 7, end: 10 };

export interface GroupMemberCardData {
  id: string;
  name: string;
  scheduleUrl: string;
  program: string | null;
  year: number | null;
  courseCount: number;
  scheduledMasterCourses: {
    code: string;
    name: string;
    semester: number;
    period: number;
    block: number;
  }[];
  selectedCourses: Pick<
    Course,
    "code" | "name" | "credits" | "level" | "mainField" | "CourseMaster"
  >[];
  selectedMasterCourses: Pick<
    Course,
    "code" | "name" | "credits" | "level" | "mainField" | "CourseMaster"
  >[];
  mastersWithRequirements: Awaited<ReturnType<typeof getMastersWithRequirements>>;
}

const parseScheduleUrl = (scheduleUrl: string) => {
  try {
    const url = new URL(scheduleUrl, SCHEDULE_URL_BASE);
    const program = url.searchParams.get("program");
    const yearParam = url.searchParams.get("year");
    const year = yearParam ? Number(yearParam) : null;
    const scheduleParam = url.searchParams.get("schedule");

    return {
      program,
      year: year !== null && !Number.isNaN(year) ? year : null,
      scheduleParam,
    };
  } catch {
    return {
      program: null,
      year: null,
      scheduleParam: null,
    };
  }
};

type DecodedGroupSchedulePayload = NonNullable<
  ReturnType<typeof decodeGroupSchedulePayload>
>;

const getCourseCodeFromScheduleEntry = (
  payload: DecodedGroupSchedulePayload,
  entry: DecodedGroupSchedulePayload["d"][number],
  courseKeys: string[],
) => {
  const codeOrIndex = entry[3];

  if (payload.v === "v2") {
    return typeof codeOrIndex === "string" ? codeOrIndex : null;
  }

  return typeof codeOrIndex === "number" &&
    codeOrIndex >= 0 &&
    codeOrIndex < courseKeys.length
    ? courseKeys[codeOrIndex]
    : null;
};

export async function getGroupMemberCardData(
  members: GroupMemberSchedule[],
): Promise<GroupMemberCardData[]> {
  const parsedMembers = members.map((member) => ({
    member,
    ...parseScheduleUrl(member.scheduleUrl),
  }));
  const uniquePrograms = [
    ...new Set(
      parsedMembers
        .map((entry) => entry.program)
        .filter((program): program is string => Boolean(program)),
    ),
  ];

  const uniqueProgramYears = [
    ...new Set(
      parsedMembers
        .filter(
          (entry): entry is typeof entry & { program: string; year: number } =>
            Boolean(entry.program) && entry.year !== null,
        )
        .map((entry) => `${entry.program}:${entry.year}`),
    ),
  ];

  const coursesByProgramYear = new Map<
    string,
    Record<string, ReturnType<typeof normalizeCourse>>
  >();
  const mastersByProgramYear = new Map<
    string,
    Awaited<ReturnType<typeof getMastersWithRequirements>>
  >();
  const programShortnames = new Map<string, string>();

  if (uniquePrograms.length > 0) {
    const programs = await prisma.program.findMany({
      where: {
        program: {
          in: uniquePrograms,
        },
      },
      select: {
        program: true,
        shortname: true,
      },
    });

    programs.forEach((program) => {
      programShortnames.set(program.program, program.shortname);
    });
  }

  await Promise.all(
    uniqueProgramYears.map(async (programYearKey) => {
      const [program, year] = programYearKey.split(":");
      const [courses, masters] = await Promise.all([
        prisma.course.findMany({
          where: {
            ProgramCourse: {
              program,
              startYear: Number(year),
            },
          },
          ...courseWithDetailsArgs,
        }),
        getMastersWithRequirements(Number(year), program),
      ]);

      coursesByProgramYear.set(
        programYearKey,
        Object.fromEntries(
          courses.map((course) => {
            const normalized = normalizeCourse(course);
            return [normalized.code, normalized];
          }),
        ),
      );
      mastersByProgramYear.set(programYearKey, masters);
    }),
  );

  return parsedMembers.map(({ member, program, year, scheduleParam }) => {
    const programYearKey =
      program && year !== null ? `${program}:${year}` : null;
    const courseMap = programYearKey
      ? coursesByProgramYear.get(programYearKey) ?? {}
      : {};
    const courseKeys = Object.keys(courseMap).sort();
    const payload = scheduleParam
      ? decodeGroupSchedulePayload(scheduleParam)
      : null;
    const courseCodes = payload
      ? [
          ...new Set(
            payload.d.flatMap((entry) => {
              const courseCode = getCourseCodeFromScheduleEntry(
                payload,
                entry,
                courseKeys,
              );

              return courseCode ? [courseCode] : [];
            }),
          ),
        ]
      : [];
    const scheduledMasterCourses = payload
      ? payload.d.flatMap((entry) => {
          const [semesterIndex, periodIndex, blockIndex] = entry;
          const semesterNumber = semesterIndex + 1;
          const isMasterPeriod =
            semesterNumber >= MASTER_PERIOD.start &&
            semesterNumber <= MASTER_PERIOD.end;

          if (!isMasterPeriod) {
            return [];
          }

          const courseCode = getCourseCodeFromScheduleEntry(
            payload,
            entry,
            courseKeys,
          );
          const course = courseCode ? courseMap[courseCode] : null;

          if (!course) {
            return [];
          }

          return [
            {
              code: course.code,
              name: course.name,
              semester: semesterNumber,
              period: periodIndex + 1,
              block: blockIndex + 1,
            },
          ];
        })
      : [];
    const masterCourseCodes = new Set(
      scheduledMasterCourses.map((course) => course.code),
    );
    const allCourses = courseCodes
      .map((courseCode) => courseMap[courseCode])
      .filter((course): course is NonNullable<typeof courseMap[string]> =>
        Boolean(course),
      );
    const masterCourses = allCourses.filter((course) =>
      masterCourseCodes.has(course.code),
    );
    return {
      id: member.id,
      name: member.name,
      scheduleUrl: member.scheduleUrl,
      program: program ? programShortnames.get(program) ?? program : null,
      year,
      courseCount: allCourses.length,
      scheduledMasterCourses,
      selectedCourses: allCourses,
      selectedMasterCourses: masterCourses,
      mastersWithRequirements: programYearKey
        ? mastersByProgramYear.get(programYearKey) ?? []
        : [],
    };
  });
}
