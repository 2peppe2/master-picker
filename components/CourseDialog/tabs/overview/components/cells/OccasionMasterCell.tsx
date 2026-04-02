"use client";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useMasterAtom } from "@/app/(store)/hooks/useMasterAtom";
import MasterBadge from "@/components/MasterBadge";
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FC } from "react";

interface OccasionMasterCellProps {
  recommendedMaster: { master: string }[];
}

const OccasionMasterCell: FC<OccasionMasterCellProps> = ({
  recommendedMaster,
}) => {
  const masters = useMasterAtom();
  const moreThanFour = recommendedMaster.length > 4;

  return (
    <TableCell>
      <div className="flex flex-wrap items-center gap-1">
        {moreThanFour ? (
          <>
            {recommendedMaster.slice(0, 3).map((m) => (
              <MasterBadge key={m.master} name={m.master} style="mr-0" />
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="h-5 w-8 rounded-full shrink-0">
                  +{recommendedMaster.length - 3}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="flex flex-col gap-2">
                  {recommendedMaster.slice(3).map((m) => (
                    <div key={m.master}>
                      <CourseTranslate
                        text={masters[m.master]?.name ?? m.master}
                      />
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </>
        ) : recommendedMaster.length > 0 ? (
          recommendedMaster.map((m) => (
            <MasterBadge key={m.master} name={m.master} style="mr-0" />
          ))
        ) : (
          "-"
        )}
      </div>
    </TableCell>
  );
};

export default OccasionMasterCell;
