"use client";

import {
  readScheduleFromUrlAtom,
  writeScheduleToUrlAtom,
} from "@/app/atoms/schedule/utils";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { useSearchParams } from "./hooks/useSearchParams";
import { coursesAtom } from "@/app/atoms/coursesAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useEffect } from "react";

const ScheduleSync: FC = () => {
  const { searchParams, setSearchParam } = useSearchParams();

  const schedules = useAtomValue(scheduleAtoms.schedulesAtom);
  const courses = useAtomValue(coursesAtom);

  const readFromUrl = useSetAtom(readScheduleFromUrlAtom);
  const writeToUrl = useSetAtom(writeScheduleToUrlAtom);

  useEffect(() => {
    if (Object.keys(courses).length > 0) {
      readFromUrl(searchParams);
    }
  }, [courses, searchParams, readFromUrl]);

  useEffect(() => {
    writeToUrl({ searchParams, setSearchParam });
  }, [schedules, searchParams, setSearchParam, writeToUrl]);

  return null;
};

export default ScheduleSync;
