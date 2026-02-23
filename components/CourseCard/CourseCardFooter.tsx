"use client";

import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { mastersAtom } from "@/app/atoms/mastersAtom";
import { MasterBadge } from "../MasterBadge";
import { CardFooter } from "../ui/card";
import { useAtomValue } from "jotai";
import { Badge } from "../ui/badge";
import { FC } from "react";

interface MasterProgram {
  courseCode: string;
  programCourseID: number;
  master: string;
  masterProgram: string;
}

interface CourseCardFooterProps {
  masterPrograms: MasterProgram[];
}

// TODO: Make this more response and make it align with the text above it
const CourseCardFooter: FC<CourseCardFooterProps> = ({ masterPrograms }) => {
  const moreThanThree = masterPrograms.length > 3;
  const moreThanFour = masterPrograms.length > 4;
  const masters = useAtomValue(mastersAtom);

  return (
    <CardFooter className="mt-auto text-foreground">
      <div
        className={`flex items-center justify-center ${
          moreThanThree ? "gap-1" : "gap-2"
        } w-full`}
      >
        {moreThanFour ? (
          <>
            {masterPrograms.slice(0, 3).map((program) => (
              <MasterBadge
                name={program.master}
                key={program.master}
                style="mr-0"
              />
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="h-5 w-8 rounded-full shrink-0"
                >
                  +{masterPrograms.length - 3}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="">
                <div className="flex flex-col gap-2">
                  {masterPrograms.slice(3).map((program) => (
                    <div key={program.master}>
                      {masters[program.master]?.name ?? program.master}
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </>
        ) : (
          masterPrograms.map((program) => (
            <MasterBadge
              name={program.master}
              key={program.master}
              style="mr-0"
            />
          ))
        )}
      </div>
    </CardFooter>
  );
};

export default CourseCardFooter;
