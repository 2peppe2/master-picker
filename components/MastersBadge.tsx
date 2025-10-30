import { FC, ReactNode } from "react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { masterColors, masterIcons, masterNames } from "./MasterHelper";

type MastersBadgeProps = {
  master: string;
  text?: string;
  tooltip?: string | ReactNode;
};

export const MastersBadge: FC<MastersBadgeProps> = ({
  master,
  text,
  tooltip,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Badge variant={"outline"} className={`mr-2 ${masterColors[master]}`}>
        {masterIcons[master]} {text}
      </Badge>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      {tooltip ?? masterNames[master]}
    </TooltipContent>
  </Tooltip>
);
