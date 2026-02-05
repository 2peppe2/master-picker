import { coursesAtom } from "@/app/atoms/coursesAtom";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { scheduleSyncEffect } from "@/app/atoms/schedule/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useEffect } from "react";

const ScheduleSync: FC = () => {
  const schedules = useAtomValue(scheduleAtoms.schedulesAtom);
  const sync = useSetAtom(scheduleSyncEffect);
  const courses = useAtomValue(coursesAtom);

  useEffect(() => {
    if (Object.keys(courses).length > 0) {
      sync("READ");
    }
  }, [courses, sync]);

  useEffect(() => {
    sync("WRITE");
  }, [schedules, sync]);

  return null;
};

export default ScheduleSync;
