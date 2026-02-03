import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { SemesterView } from "./SemesterView";
import { useAtomValue } from "jotai";
import { range } from "lodash";

const Schedule = () => {
  const schedules = useAtomValue(scheduleAtoms.schedulesAtom);

  return (
    <>
      {range(0, schedules.length).map((index) => (
        <SemesterView key={index} semesterNumber={index} />
      ))}
    </>
  );
};

export default Schedule;
