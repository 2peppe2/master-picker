"use client";

import {
  useIsCompact,
  useIsLandscapePhone,
} from "@/common/hooks/useResponsiveLayout";
import SearchFilterSmall from "./SearchFilterSmall";
import SearchFilterLarge from "./SearchFilterLarge";
import { FC } from "react";

const UnifiedSearchFilter: FC = () => {
  const isCompact = useIsCompact();
  const isLandscapePhone = useIsLandscapePhone();

  return (
    <div data-slot="course-filter" className="w-full">
      {isCompact ? (
        <SearchFilterSmall sideSheet={isLandscapePhone} />
      ) : (
        <SearchFilterLarge />
      )}
    </div>
  );
};

export default UnifiedSearchFilter;
