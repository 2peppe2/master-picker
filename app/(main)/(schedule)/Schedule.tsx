import { useScheduleStore } from "../../atoms/scheduleStore";
import { SemesterView } from "./SemesterView";
import { range } from "lodash";

const Schedule = () => {
  const { state } = useScheduleStore();

  return (
    <>
      {range(0, state.schedules.length).map((index) => (
        <SemesterView key={index} semesterNumber={index} />
      ))}
    </>
  );
};

export default Schedule;
