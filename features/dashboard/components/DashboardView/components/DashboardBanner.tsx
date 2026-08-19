"use client";

import { AnimatePresence } from "framer-motion";
import { FC } from "react";
import { DisclaimerMessage } from "./Disclaimer";
import BannerSlide from "./BannerSlide";
import NewsMessage from "./NewsMessage";
import { useDashboardBannerSlide } from "../hooks/useDashboardBannerSlide";

const DashboardBanner: FC = () => {
  const slide = useDashboardBannerSlide();

  return (
    <div
      aria-live="off"
      className="relative h-9 w-full overflow-hidden border-b border-[rgb(0,200,179)]/20 bg-[rgb(0,200,179)]/25 dark:bg-[rgb(0,200,179)]/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        {slide === "news" ? (
          <BannerSlide key="news">
            <NewsMessage />
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
