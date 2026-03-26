"use client";

import Translate from "@/common/components/translate/Translate";
import { CreditsRequirement } from "@/app/dashboard/page";
import { FC, useMemo } from "react";

interface CreditRowProps {
  requirement: CreditsRequirement;
  current?: number;
}

const CreditRow: FC<CreditRowProps> = ({ requirement, current = 0 }) => {
  const typeToLabel: Record<string, string> = useMemo(
    () => ({
      CREDITS_TOTAL: "_dashboard_credits_total",
      CREDITS_MASTER_TOTAL: "_dashboard_credits_master_total",
      CREDITS_PROFILE_TOTAL: "_dashboard_credits_profile_total",
      CREDITS_ADVANCED_PROFILE: "_dashboard_credits_advanced_profile",
      CREDITS_ADVANCED_MASTER: "_dashboard_credits_advanced_master",
    }),
    [],
  );

  return (
    <span className="leading-snug">
      <Translate text="have_at_least" />{" "}
      <b className="text-foreground font-bold">{current}</b>
      <span className="text-muted-foreground/60 mx-1">/</span>
      <b className="text-foreground">{requirement.credits} HP</b>{" "}
      <Translate text={typeToLabel[requirement.type]} />.
    </span>
  );
};

export default CreditRow;
