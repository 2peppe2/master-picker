"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMasterAtom } from "@/common/state/catalog";
import { MasterIcon } from "./MasterIcon";
import { FC, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={`mr-2 ${master.style} ${style}`}>
          <MasterIcon iconName={master.icon} />{" "}
          {title ? <CourseTranslate text={masterName} /> : text}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={5}>
        {tooltip ? (
          tooltip({ masterName })
        ) : (
          <CourseTranslate text={masterName} />
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export default MasterBadge;
