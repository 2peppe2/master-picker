"use client";

import MasterProgressBadgeContent from "./MasterProgressBadgeContent";
import MasterRequirementSheet from "./MasterRequirementSheet";
import { MasterProgressBadgeProps } from "./MasterProgressBadge.types";
import { useCourseTranslate } from "@/common/components/translate/hooks/useCourseTranslate";
import { useMasterAtom } from "@/features/catalog/hooks/useMasterAtom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FC } from "react";

const MasterProgressBadgeSmall: FC<MasterProgressBadgeProps> = ({ master }) => {
  const translateCourse = useCourseTranslate();
  const masterMeta = useMasterAtom()[master.master];
  const progressPercentage = Math.round(
    Math.max(0, Math.min(100, master.progress)),
  );

  return (
    <div className="w-full">
      <MasterRequirementSheet
        master={master}
        trigger={
          <Badge asChild variant="outline">
            <button
              type="button"
              aria-label={translateCourse(master.name)}
              data-master-progress-badge={master.master}
              onClick={(event) => event.stopPropagation()}
              className={cn(
                "min-w-[80px] h-8 w-full flex items-center justify-center relative transition-all duration-200 cursor-pointer overflow-hidden px-2 hover:bg-muted/50",
                masterMeta?.style,
              )}
            >
              <MasterProgressBadgeContent
                iconName={masterMeta.icon}
                progressPercentage={progressPercentage}
              />
            </button>
          </Badge>
        }
      />
    </div>
  );
};

export default MasterProgressBadgeSmall;
