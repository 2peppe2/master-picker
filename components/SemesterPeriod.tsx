import semestersAtom from "@/app/semestersAtom";
import { useAtomValue } from "jotai";
import { range } from "lodash";
import { SemesterBlock } from "./SemesterBlock";

type SemesterPeriodProps = {
    semesterNumber: number;
    periodNumber: number;
}

export const SemesterPeriod = ({ semesterNumber, periodNumber }: SemesterPeriodProps) => {
    const semesters = useAtomValue(semestersAtom);
    const blocks = semesters[semesterNumber][periodNumber];
    const BLOCKS = range(0, blocks.length);
    return (
        <div className="flex justify-around gap-5">
            {BLOCKS.map((index: number) => (
                <SemesterBlock key={index} semesterNumber={semesterNumber} periodNumber={periodNumber} blockNumber={index} />
            ))
            }
        </div>
    )
}