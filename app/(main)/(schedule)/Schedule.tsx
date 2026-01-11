import { SemesterView } from "./SemesterView";
import { range } from "lodash";
import semesterScheduleAtom from "../../atoms/semestersAtom";
import { useAtomValue } from "jotai";

export default function Schedule() {
  const semesters = useAtomValue(semesterScheduleAtom);
  const SEMESTERS = range(0, semesters.length);

  return (
    <>
      {SEMESTERS.map((index) => (
        <SemesterView key={index} semesterNumber={index} />
      ))}
    </>
  );
}
