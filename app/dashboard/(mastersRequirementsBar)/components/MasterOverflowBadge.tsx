import { Badge } from "@/components/ui/badge";
import { ProcessedMaster } from "../types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { FC } from "react";

interface MasterOverflowBadgeProps {
  count: number;
  width: number;
  masters: ProcessedMaster[];
}

export const MasterOverflowBadge: FC<MasterOverflowBadgeProps> = ({
  count,
  width,
  masters,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Badge
        variant="outline"
        style={{ width }}
        className="h-8 shrink-0 cursor-default flex items-center justify-center"
      >
        +{count}
      </Badge>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="max-h-80 overflow-y-auto">
      <div className="flex flex-col gap-1 p-1">
        {masters.map((master) => (
          <div
            key={master.master}
            className="text-xs py-1 border-b last:border-0 whitespace-nowrap"
          >
            {master.name}{" "}
            <span className="text-muted-foreground ml-2">
              {master.progress}%
            </span>
          </div>
        ))}
      </div>
    </TooltipContent>
  </Tooltip>
);
