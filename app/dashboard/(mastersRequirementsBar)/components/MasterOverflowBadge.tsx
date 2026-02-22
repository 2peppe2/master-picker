"use client";

import { Badge } from "@/components/ui/badge";
import { ProcessedMaster } from "../types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { FC } from "react";

interface MasterOverflowBadgeProps {
  minWidth: number;
  masters: ProcessedMaster[];
  count: number;
}

export const MasterOverflowBadge: FC<MasterOverflowBadgeProps> = ({
  minWidth,
  masters,
  count,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          style={{ minWidth }}
          className="h-8 w-full shrink-0 cursor-default flex items-center justify-center border-dashed"
        >
          +{count} more
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-h-80 overflow-y-auto">
        <div className="flex flex-col gap-1 p-1">
          {masters.map((m) => (
            <div
              key={m.master}
              className="text-xs py-1 border-b last:border-0 whitespace-nowrap"
            >
              {m.name}{" "}
              <span className="text-muted-foreground ml-2">{m.progress}%</span>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
