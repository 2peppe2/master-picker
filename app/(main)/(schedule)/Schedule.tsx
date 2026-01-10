import { SemesterView } from "./SemesterView";
import { range } from "lodash";
import semestersAtom from "../../atoms/semestersAtom";
import { useAtomValue } from "jotai";


export default function SchedulePage() {
    const semesters = useAtomValue(semestersAtom);
    

    const SEMESTERS = range(0, semesters.length);

    return (
        <>
            {SEMESTERS.map((index) => (
                <SemesterView
                    key={index}
                    semesterNumber={index}
                />
            ))}
        </>
    )
}