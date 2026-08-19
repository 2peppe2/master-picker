"use client";

import type {
  MultiSelectGroup,
  MultiSelectSection,
} from "@/components/ui/MultiSelect/types";
import { useMemo, useState } from "react";

interface DrilldownState {
  heading: string;
  sectionKey?: string;
}

export const useCourseFilterDrilldown = (groups: MultiSelectGroup[]) => {
  const [drilldown, setDrilldown] = useState<DrilldownState | null>(null);

  const activeGroup = useMemo(
    () => groups.find((group) => group.heading === drilldown?.heading) ?? null,
    [groups, drilldown],
  );
  const activeSection = useMemo(
    () =>
      activeGroup?.sections?.find(
        (section) => section.key === drilldown?.sectionKey,
      ) ?? null,
    [activeGroup, drilldown],
  );

  const goBack = () =>
    setDrilldown(drilldown?.sectionKey ? { heading: drilldown.heading } : null);
  const selectGroup = (group: MultiSelectGroup) => {
    setDrilldown({ heading: group.heading });
  };
  const selectSection = (
    group: MultiSelectGroup,
    section: MultiSelectSection,
  ) => {
    setDrilldown({ heading: group.heading, sectionKey: section.key });
  };

  return {
    activeGroup,
    activeSection,
    title: activeSection?.headerLabel ?? activeGroup?.heading ?? null,
    goBack,
    selectGroup,
    selectSection,
  };
};
