"use client";

import { useEffect, useState } from "react";

export type DashboardBannerSlide = "reminder" | "disclaimer";

// Midnight after October 10, 2026 in Europe/Stockholm (CEST, UTC+2).
export const REGISTRATION_REMINDER_END = Date.parse("2026-10-10T22:00:00Z");

const SLIDE_DURATION_MS: Record<DashboardBannerSlide, number> = {
  reminder: 25_000,
  disclaimer: 30_000,
};

export const useDashboardBannerSlide = (): DashboardBannerSlide => {
  const [slide, setSlide] = useState<DashboardBannerSlide>(() =>
    Date.now() < REGISTRATION_REMINDER_END ? "reminder" : "disclaimer",
  );

  useEffect(() => {
    const remaining = REGISTRATION_REMINDER_END - Date.now();
    if (remaining <= 0) {
      setSlide("disclaimer");
      return;
    }

    const rotation = window.setTimeout(() => {
      setSlide((current) => {
        if (Date.now() >= REGISTRATION_REMINDER_END) return "disclaimer";
        return current === "reminder" ? "disclaimer" : "reminder";
      });
    }, Math.min(SLIDE_DURATION_MS[slide], remaining));

    return () => window.clearTimeout(rotation);
  }, [slide]);

  return slide;
};
