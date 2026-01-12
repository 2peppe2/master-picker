import { FC, memo, ReactNode, useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { getMasterInfo } from "@/app/actions/getMasterInfo";
import { Master } from "@/app/(main)/page";
import { MasterIcon } from "./MasterIcon";


type MasterBadgeWithMastersProps = {
  master: Master;
  text?: string;
  tooltip?: string | ReactNode;
}
export const MasterBadgeGivenMaster: FC<MasterBadgeWithMastersProps> = ({
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
    <TooltipContent side="bottom">
      {tooltip ?? master.name}
    </TooltipContent>
  </Tooltip>
);



type MastersBadgeProps = {
  masterID: string;
  text?: string;
  tooltip?: string | ReactNode;
};

const MastersBadgeInner: FC<MastersBadgeProps> = ({
  masterID,
  text,
  tooltip,
}) => {
  const [master, setMaster] = useState<Master|null>(null);
  useEffect(() => {
    getMasterInfo(masterID).then(setMaster);
  }, [masterID]);
  if (!master) {
    return null;
  }
  return (
    <MasterBadgeGivenMaster master={master} text={text} tooltip={tooltip} />
  )
};

export const MastersBadge = memo(MastersBadgeInner);


