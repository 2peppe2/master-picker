"use client";

import { useLayoutEffect, useRef, useState } from "react";

const COMPACT_CHART_WIDTH = 420;

export const useEvaluationChartWidth = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame = 0;
    const measure = () => {
      const nextWidth = Math.floor(container.getBoundingClientRect().width);
      if (Number.isFinite(nextWidth) && nextWidth > 0) {
        setChartWidth((currentWidth) =>
          currentWidth === nextWidth ? currentWidth : nextWidth,
        );
      }
    };
    const scheduleMeasure = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(measure);
    };

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(container);

    const tabPanel = container.closest('[role="tabpanel"]');
    const visibilityObserver = new MutationObserver(scheduleMeasure);
    if (tabPanel) {
      visibilityObserver.observe(tabPanel, {
        attributes: true,
        attributeFilter: ["class", "data-state", "hidden", "style"],
      });
    }

    window.addEventListener("resize", scheduleMeasure);
    measure();
    scheduleMeasure();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, []);

  return {
    containerRef,
    chartWidth,
    isCompactChart: chartWidth > 0 && chartWidth < COMPACT_CHART_WIDTH,
  };
};
