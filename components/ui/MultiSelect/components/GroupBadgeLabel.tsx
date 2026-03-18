"use client";

import { ReactNode, FC } from "react";

interface GroupBadgeLabelProps {
  title: string;
  items: { node: ReactNode; sortKey: string }[];
  isProfile: boolean;
}

const GroupBadgeLabel: FC<GroupBadgeLabelProps> = ({
  title,
  items,
  isProfile,
}) => (
  <div className="flex flex-wrap items-center gap-x-1 max-w-full">
    <span className="font-bold text-xsm uppercase tracking-tighter opacity-50 whitespace-nowrap">
      {title}:
    </span>
    <div
      className={`flex flex-wrap items-center gap-y-1 ${
        isProfile ? "gap-x-0.5" : "gap-x-1"
      }`}
    >
      {items.map((item, idx) => (
        <span
          key={idx}
          className="inline-flex items-center text-xsm origin-left"
        >
          {item.node}
          {idx < items.length - 1 && !isProfile && (
            <span className="opacity-30 text-xsm ml-[0.5px]">,</span>
          )}
        </span>
      ))}
    </div>
  </div>
);

export default GroupBadgeLabel;
