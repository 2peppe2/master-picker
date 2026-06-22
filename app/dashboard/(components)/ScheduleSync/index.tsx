"use client";

import { readCustomCoursesFromUrlAtom, serializeCustomCourses } from "../../(store)/customCourses/utils";
import { readScheduleFromUrlAtom, serializeSchedule } from "../../(store)/schedule/utils";
import { customCoursesAtoms } from "../../(store)/customCourses/atoms";
import { useSearchParams } from "@/common/hooks/useSearchParams";
import { scheduleAtoms } from "../../(store)/schedule/atoms";
import { coursesAtom } from "../../(store)/store";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useEffect, Suspense } from "react";

const ScheduleSyncInner: FC = () => {
  const { searchParams, setSearchParams } = useSearchParams();

  const schedules = useAtomValue(scheduleAtoms.schedulesAtom);
  const courses = useAtomValue(coursesAtom);
  const customCourses = useAtomValue(customCoursesAtoms.customCoursesAtom);

  const readFromUrl = useSetAtom(readScheduleFromUrlAtom);
  const readCustomFromUrl = useSetAtom(readCustomCoursesFromUrlAtom);

  useEffect(() => {
    if (Object.keys(courses).length > 0) {
      readCustomFromUrl({ searchParams });
      readFromUrl({ searchParams });
    }
  }, [courses, searchParams, readFromUrl, readCustomFromUrl]);

  useEffect(() => {
    const customCompressed = serializeCustomCourses(customCourses);
    const scheduleCompressed = serializeSchedule(courses, schedules);

    setSearchParams({
      custom: customCompressed,
      schedule: scheduleCompressed,
    });
  }, [schedules, customCourses, courses, setSearchParams]);

  return null;
};

const ScheduleSync: FC = () => (
  <Suspense fallback={null}>
    <ScheduleSyncInner />
  </Suspense>
);

export default ScheduleSync;
