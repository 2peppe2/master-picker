"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FC, ReactNode, useEffect, useState } from "react";
import { DisclaimerMessage } from "./Disclaimer";
import { Smartphone } from "lucide-react";

type Slide = "news" | "disclaimer";

const SLIDE_DURATION_MS: Record<Slide, number> = {
  news: 10_000,
  disclaimer: 30_000,
};

/**
 * Desktop dashboard header bar. Rotates between the mobile-support news and the
 * third-party disclaimer, starting on the news.
 */
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

interface BannerSlideProps {
  children: ReactNode;
}

const BannerSlide: FC<BannerSlideProps> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const offset = prefersReducedMotion ? 0 : 16;

  return (
    <motion.div
      initial={{ y: offset, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -offset, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="absolute inset-0 flex items-center justify-center gap-2 px-4"
    >
      {children}
    </motion.div>
  );
};

const NewsMessage: FC = () => {
  const translate = useCommonTranslate();

  return (
    <>
      <Smartphone
        aria-hidden="true"
        className="size-4 shrink-0 text-[rgb(0,100,89)] dark:text-[rgb(0,200,179)]"
      />
      <p
        aria-label={translate("_mobile_support_announcement_title")}
        data-mobile-support-announcement
        className="text-center text-xs font-semibold leading-tight text-foreground"
      >
        {translate("_mobile_support_announcement_title")}{" "}
        <span className="font-normal text-muted-foreground">
          {translate("_mobile_support_announcement_body")}
        </span>
      </p>
    </>
  );
};
