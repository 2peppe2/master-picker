"use client";

import { useEffect, useState } from "react";

export type DashboardBannerSlide = "news" | "disclaimer";

const SLIDE_DURATION_MS: Record<DashboardBannerSlide, number> = {
  news: 10_000,
  disclaimer: 30_000,
};

export const useDashboardBannerSlide = (): DashboardBannerSlide => {
  const [slide, setSlide] = useState<DashboardBannerSlide>("news");

  useEffect(() => {
    const timeout = setTimeout(
      () => setSlide((current) => (current === "news" ? "disclaimer" : "news")),
      SLIDE_DURATION_MS[slide],
    );

    return () => clearTimeout(timeout);
  }, [slide]);

  return slide;
};
