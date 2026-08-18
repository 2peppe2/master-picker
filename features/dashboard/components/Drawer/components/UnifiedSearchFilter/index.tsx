"use client";

import { useIsCompact } from "@/common/hooks/useResponsiveLayout";
import SearchFilterSmall from "./SearchFilterSmall";
import SearchFilterLarge from "./SearchFilterLarge";
import { FC } from "react";

const UnifiedSearchFilter: FC = () => {
  const isCompact = useIsCompact();

  return (
    <div data-slot="course-filter" className="w-full">
      {isCompact ? <SearchFilterSmall /> : <SearchFilterLarge />}
    </div>
  );
};

export default UnifiedSearchFilter;
