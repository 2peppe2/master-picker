"use client";

import MasterProgressBadgeContent from "./MasterProgressBadgeContent";
import MasterRequirementTooltip from "./MasterRequirementTooltip";
import { MasterProgressBadgeProps } from "./MasterProgressBadge.types";
import { useMasterAtom } from "@/common/state/catalog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FC } from "react";

const MasterProgressBadgeLarge: FC<MasterProgressBadgeProps> = ({
  master,
  onHover,
  tooltipOpen,
  onTooltipOpenChange,
}) => {
  const masterMeta = useMasterAtom()[master.master];
  const progressPercentage = Math.round(
    Math.max(0, Math.min(100, master.progress)),
  );

  return (
    <div className="w-full">
      <MasterRequirementTooltip
        master={master}
        open={tooltipOpen}
        disableHoverableContent
        onOpenChange={onTooltipOpenChange}
        className="p-0 border-none bg-transparent shadow-none data-[state=instant-open]:!animate-none data-[state=delayed-open]:!animate-none data-[state=closed]:!animate-none"
        trigger={
          <Badge
            variant="outline"
            data-master-progress-badge={master.master}
            onMouseEnter={onHover}
            className={cn(
              "min-w-[80px] h-8 w-full flex items-center justify-center relative transition-all duration-200 cursor-default overflow-hidden px-2 hover:bg-muted/50",
              masterMeta?.style,
            )}
          >
            <MasterProgressBadgeContent
              iconName={masterMeta.icon}
              progressPercentage={progressPercentage}
            />
          </Badge>
        }
      />
    </div>
  );
};

export default MasterProgressBadgeLarge;
