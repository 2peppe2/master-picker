import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Master } from "@/app/(main)/page";
import { MasterIcon } from "./MasterIcon";
import { FC, ReactNode } from "react";
import { Badge } from "./ui/badge";

interface MasterBadgeProps {
  master: Master;
  text?: string;
  tooltip?: string | ReactNode;
}

export const MasterBadge: FC<MasterBadgeProps> = ({
  master,
  text,
  tooltip,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Badge variant={"outline"} className={`mr-2 ${master.style}`}>
        <MasterIcon iconName={master.icon} /> {text}
      </Badge>
    </TooltipTrigger>
    <TooltipContent side="bottom">{tooltip ?? master.name}</TooltipContent>
  </Tooltip>
);
