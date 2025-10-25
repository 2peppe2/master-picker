'use client';


import { UniqueIdentifier } from "@dnd-kit/core";
import { Droppable } from "./Dropable";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { useAtomValue } from "jotai";
import semestersStore from "@/app/semesterStore";
import { COURSES } from "@/app/courses";
import { CourseCard } from "./CourseCard";
import { SemesterBlock } from "./SemesterBlock";
import { range } from "lodash";
import { SemesterPeriod } from "./SemesterPeriod";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "./ui/collapsible";
import { ChevronRightIcon } from "lucide-react";

type SemesterViewProps = {
    semesterNumber: number;
}



export const SemesterView = ({ semesterNumber }: SemesterViewProps) => {
    const semesters = useAtomValue(semestersStore);
    const periods = semesters[semesterNumber];

    const PERIODS = range(0, periods.length);

    return (
        <Card className="w-full p-4 ">
            <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                    <CardTitle className="flex gap-3">
                        Semester {semesterNumber + 7}  - Credits: {periods.flat().reduce((acc, block) => {
                            if (block === null) return acc;
                            const course = COURSES[block];
                            return acc + course.credits;
                        }, 0)} / 30
                        <ChevronRightIcon className='size-4 transition-transform [[data-state=open]_&]:rotate-90' />
                    </CardTitle>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        <div className="flex flex-col gap-4 pt-5">
                            {PERIODS.map((index) => (
                                <SemesterPeriod key={index} semesterNumber={semesterNumber} periodNumber={index} />
                            ))}
                        </div>

                    </CardContent>
                </CollapsibleContent>
            </Collapsible>

        </Card>
    )
}