import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { mastersAtom } from "@/app/atoms/mastersAtom";
import { MasterIcon } from "./MasterIcon";
import { FC, ReactNode } from "react";
import { useAtomValue } from "jotai";
import { Badge } from "./ui/badge";

interface TooltipFunctionArgs {
  masterName: string;
}

interface MasterBadgeProps {
  name: string;
  text?: string;
  tooltip?: (args: TooltipFunctionArgs) => string | ReactNode;
}

export const MasterBadge: FC<MasterBadgeProps> = ({ name, text, tooltip }) => {
  const masters = useAtomValue(mastersAtom);
  const master = masters[name];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={`mr-2 ${master.style}`}>
          <MasterIcon iconName={master.icon} /> {text}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {tooltip?.({ masterName: name }) ?? name}
      </TooltipContent>
    </Tooltip>
  );
};
