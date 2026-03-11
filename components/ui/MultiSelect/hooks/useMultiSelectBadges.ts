"use client";

import GroupBadgeLabel from "../components/GroupBadgeLabel";
import { BadgeData, MultiSelectOption } from "../types";
import React, { useMemo } from "react";

interface UseMultiSelectBadgesArgs {
  selected: string[];
  allOptionsFlat: MultiSelectOption[];
  categoryLabels: Record<string, string>;
  searchValue: string;
}

export const useMultiSelectBadges = ({
  selected,
  allOptionsFlat,
  categoryLabels,
  searchValue,
}: UseMultiSelectBadgesArgs) =>
  useMemo(() => {
    const groups: Record<string, { node: React.ReactNode; sortKey: string }[]> =
      {};
    const uniqueItems: { label: React.ReactNode; value: string }[] = [];

    selected.forEach((val) => {
      if (val.startsWith("search:")) {
        const content = val.replace("search:", "");
        if (content !== searchValue) {
          uniqueItems.push({ label: `"${content}"`, value: val });
        }
        return;
      }

      if (val.includes(":")) {
        const [prefix, ...rest] = val.split(":");
        const content = rest.join(":");
        const opt = allOptionsFlat.find((o) => o.value === val);
        groups[prefix] = [
          ...(groups[prefix] || []),
          { node: opt?.label || content, sortKey: opt?.searchKey || content },
        ];
      } else {
        const opt = allOptionsFlat.find((o) => o.value === val);
        uniqueItems.push({ label: opt?.label || val, value: val });
      }
    });

    const badges: BadgeData[] = [];
    const order = ["semester", "block", "period", "master"];
    const sortedEntries = Object.entries(groups).sort(
      (a, b) => order.indexOf(a[0]) - order.indexOf(b[0]),
    );

    sortedEntries.forEach(([prefix, items]) => {
      const isProfile = prefix === "master";
      const title = categoryLabels[prefix] || prefix;
      const sortedItems = items.sort((a, b) =>
        a.sortKey.localeCompare(b.sortKey, undefined, { numeric: true }),
      );

      badges.push({
        label: React.createElement(GroupBadgeLabel, {
          title: title,
          items: sortedItems,
          isProfile: isProfile,
        }),
        value: prefix,
        isGroup: true,
        prefix: prefix,
      });
    });

    uniqueItems.forEach((item) =>
      badges.push({ label: item.label, value: item.value, isGroup: false }),
    );

    return badges;
  }, [selected, allOptionsFlat, categoryLabels, searchValue]);
