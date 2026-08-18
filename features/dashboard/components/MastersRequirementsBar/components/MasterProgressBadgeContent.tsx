import { MasterIcon } from "@/common/components/MasterIcon";
import { FC } from "react";

interface MasterProgressBadgeContentProps {
  iconName: string | null;
  progressPercentage: number;
}

const MasterProgressBadgeContent: FC<MasterProgressBadgeContentProps> = ({
  iconName,
  progressPercentage,
}) => (
  <>
    <div className="flex items-center justify-center min-w-0">
      <MasterIcon iconName={iconName} className="shrink-0" />
      {progressPercentage > 0 && (
        <span className="ml-1 text-2xs font-bold whitespace-nowrap">
          {progressPercentage}%
        </span>
      )}
    </div>
    {progressPercentage > 0 && progressPercentage < 100 && (
      <div
        aria-hidden="true"
        style={{ width: `${progressPercentage}%` }}
        className="absolute bottom-0 left-0 h-[3px] bg-current transition-all duration-500 opacity-30"
      />
    )}
  </>
);

export default MasterProgressBadgeContent;
