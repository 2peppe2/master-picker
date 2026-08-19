"use client";

import DisclaimerMessage from "./DisclaimerMessage";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface DisclaimerProps {
  dense?: boolean;
}

const Disclaimer: FC<DisclaimerProps> = ({ dense = false }) => (
  <div
    className={cn(
      "flex items-center gap-2 px-4 bg-brand/25 dark:bg-brand/10",
      "border-b border-brand/20 w-full justify-center overflow-hidden",
      dense ? "py-(--density-y)" : "py-2",
    )}
  >
    <DisclaimerMessage />
  </div>
);

export default Disclaimer;
export { default as DisclaimerMessage } from "./DisclaimerMessage";
