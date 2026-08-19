"use client";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useMasterAtom } from "@/common/state/catalog";
import MasterBadge from "@/common/components/MasterBadge";
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

  if (recommendedMaster.length === 0) {
    return <TableCell>-</TableCell>;
  }

  if (!moreThanFour) {
    return (
      <TableCell>
        <div className="flex flex-wrap items-center gap-1">
          {recommendedMaster.map((master) => (
            <MasterBadge
              key={master.master}
              name={master.master}
              style="mr-0"
            />
          ))}
        </div>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <div className="flex flex-wrap items-center gap-1">
        {recommendedMaster.slice(0, 3).map((master) => (
          <MasterBadge
            key={master.master}
            name={master.master}
            style="mr-0"
          />
        ))}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="h-5 w-8 rounded-full shrink-0">
              +{recommendedMaster.length - 3}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="flex flex-col gap-2">
              {recommendedMaster.slice(3).map((master) => (
                <div key={master.master}>
                  <CourseTranslate
                    text={masters[master.master]?.name ?? master.master}
                  />
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TableCell>
  );
};

export default OccasionMasterCell;
