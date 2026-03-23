"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useMasterAtom } from "@/app/(store)/hooks/useMasterAtom";
import { MasterIcon } from "./MasterIcon";
import { FC, ReactNode } from "react";
import { Badge } from "./ui/badge";

interface TooltipFunctionArgs {
  masterName: string;
}

interface MasterBadgeProps {
  name: string;
  text?: string;
  title?: boolean;
  style?: string;
  tooltip?: (args: TooltipFunctionArgs) => string | ReactNode;
}

const MasterBadge: FC<MasterBadgeProps> = ({
  name,
  text,
  title = false,
  style = "",
  tooltip,
}) => {
  const masters = useMasterAtom();
  const master = masters[name];
  const masterName = master.name ?? "";
  text = title ? masterName : text;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={`mr-2 ${master.style} ${style}`}>
          <MasterIcon iconName={master.icon} /> {text}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {tooltip?.({ masterName }) ?? masterName}
      </TooltipContent>
    </Tooltip>
  );
};

export default MasterBadge;
