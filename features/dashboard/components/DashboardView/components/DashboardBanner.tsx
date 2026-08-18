"use client";

import { AnimatePresence } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { DisclaimerMessage } from "./Disclaimer";
import BannerSlide from "./BannerSlide";
import NewsMessage from "./NewsMessage";

type Slide = "news" | "disclaimer";

const SLIDE_DURATION_MS: Record<Slide, number> = {
  news: 10_000,
  disclaimer: 30_000,
};

const DashboardBanner: FC = () => {
  const [slide, setSlide] = useState<Slide>("news");

  useEffect(() => {
    const timeout = setTimeout(
      () => setSlide((current) => (current === "news" ? "disclaimer" : "news")),
      SLIDE_DURATION_MS[slide],
    );

    return () => clearTimeout(timeout);
  }, [slide]);

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
