import { FC, ReactNode } from "react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { masterColors, masterIcons, masterNames } from "./MastersHelper";

interface TooltipFunctionArgs {
  masterName: string;
}

interface MastersBadgeProps {
  master: string;
  text?: string;
  tooltip?: (args: TooltipFunctionArgs) => string | ReactNode;
}

export const MastersBadge: FC<MastersBadgeProps> = ({
  master,
  text,
  tooltip,
}) => {
  const [name, icon, color] = [
    masterNames[master],
    masterIcons[master],
    masterColors[master],
  ];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={`mr-2 ${color}`}>
          {icon} {text}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {tooltip?.({ masterName: name }) ?? name}
      </TooltipContent>
    </Tooltip>
  );
};
