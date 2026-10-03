"use client";

import { AnimatePresence } from "framer-motion";
import { FC } from "react";
import { DisclaimerMessage } from "./Disclaimer";
import BannerSlide from "./BannerSlide";
import RegistrationReminderMessage from "./RegistrationReminderMessage";
import { useDashboardBannerSlide } from "../hooks/useDashboardBannerSlide";
import { cn } from "@/lib/utils";

interface DashboardBannerProps {
  compact?: boolean;
  dense?: boolean;
}

const DashboardBanner: FC<DashboardBannerProps> = ({
  compact = false,
  dense = false,
}) => {
  const slide = useDashboardBannerSlide();

  return (
    <div
      aria-live="off"
      className={cn(
        "relative w-full shrink-0 overflow-hidden border-b border-brand/20 bg-brand/25 dark:bg-brand/10",
        compact ? "h-14" : "h-9",
        dense && "h-14",
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {slide === "reminder" ? (
          <BannerSlide key="reminder">
            <RegistrationReminderMessage />
          </BannerSlide>
        ) : (
          <BannerSlide key="disclaimer">
            <DisclaimerMessage />
          </BannerSlide>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardBanner;
