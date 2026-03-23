"use client";

import { LucideIcon } from "lucide-react";
import { FC } from "react";

interface OverviewDetailRowProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

const OverviewDetailRow: FC<OverviewDetailRowProps> = ({
  label,
  value,
  icon: Icon,
}) => (
  <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 py-2.5 text-sm">
    <div className="text-muted-foreground inline-flex items-center gap-1.5">
      <Icon className="size-3.5 shrink-0" />
      <span>{label}</span>
    </div>
    <p className="text-foreground break-words">{value}</p>
  </div>
);

export default OverviewDetailRow;
