"use client";

import { CreditsRequirement } from "@/app/dashboard/page";
import { FC } from "react";

interface CreditRowProps {
  requirement: CreditsRequirement;
  current?: number;
}

const CreditRow: FC<CreditRowProps> = ({ requirement, current = 0 }) => {
  const labels: Record<string, string> = {
    CREDITS_TOTAL: "total credits across all years",
    CREDITS_MASTER_TOTAL: "total credits for the Master's degree",
    CREDITS_PROFILE_TOTAL: "total credits within the profile",
    CREDITS_ADVANCED_PROFILE: "Advanced (A) level credits in profile",
    CREDITS_ADVANCED_MASTER: "Advanced (A) level credits total",
  };

  return (
    <span className="leading-snug">
      Have at least <b className="text-foreground font-bold">{current}</b>
      <span className="text-muted-foreground/60 mx-1">/</span>
      <b className="text-foreground">{requirement.credits} HP</b>{" "}
      {labels[requirement.type] || "credits"}.
    </span>
  );
};

export default CreditRow;
