"use client";

import { cn } from "@/lib/utils";

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
  <div
    className={cn(
      "grid grid-cols-1 gap-1 py-2.5 text-sm",
      "min-[360px]:grid-cols-[7rem_minmax(0,1fr)]",
      "min-[360px]:gap-3",
    )}
  >
    <div className="text-muted-foreground inline-flex items-center gap-1.5">
      <Icon className="size-3.5 shrink-0" />
      <span>{label}</span>
    </div>
    <p className="text-foreground break-words">{value}</p>
  </div>
);

export default OverviewDetailRow;
