"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { useMasterAtom } from "@/app/(store)/hooks/useMasterAtom";
import MasterBadge from "../MasterBadge";
import { CardFooter } from "../ui/card";
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

const CourseCardFooter: FC<CourseCardFooterProps> = ({ masterPrograms }) => {
  const moreThanThree = masterPrograms.length > 3;
  const masters = useMasterAtom();

  return (
    <CardFooter className="mt-auto text-foreground">
      <div
        className={`flex items-center justify-start ${
          moreThanThree ? "gap-1" : "gap-2"
        } w-full`}
      >
        {moreThanThree ? (
          <>
            {masterPrograms.slice(0, 2).map((program) => (
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
                  +{masterPrograms.length - 2}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="">
                <div className="flex flex-col gap-2">
                  {masterPrograms.slice(2).map((program) => (
                    <div key={program.master}>
                      <CourseTranslate
                        text={masters[program.master]?.name ?? program.master}
                      />
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
