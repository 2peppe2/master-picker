"use client";

import { CreditsRequirement } from "@/app/dashboard/page";
import { FC } from "react";

const LABELS: Record<string, string> = {
  CREDITS_TOTAL: "total credits across all years",
  CREDITS_MASTER_TOTAL: "total credits for the Master's degree",
  CREDITS_PROFILE_TOTAL: "total credits within the profile",
  CREDITS_ADVANCED_PROFILE: "Advanced (A) level credits in profile",
  CREDITS_ADVANCED_MASTER: "Advanced (A) level credits total",
};

interface CreditRowProps {
  requirement: CreditsRequirement;
}

const CreditRow: FC<CreditRowProps> = ({ requirement }) => {
  return (
    <span className="leading-snug">
      At least{" "}
      <b className="text-foreground font-semibold">{requirement.credits} HP</b>{" "}
      {LABELS[requirement.type]}.
    </span>
  );
};

export default CreditRow;
