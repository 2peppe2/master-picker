"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks whether a scroll container has more content below the fold, so a
 * bottom gradient ("scroll fade") can signal that there is more to scroll.
 * Attach `scrollRef` and `onScroll={handleScroll}` to the scroll container and
 * render `{showFade && <BottomFade />}` as its last child.
 *
 * Pass values in `deps` (e.g. the rendered content) that should trigger a
 * re-measure when they change.
 */
/** Reports whether a scroll container still has content below its viewport. */
export const useBottomScrollFade = <T extends HTMLElement = HTMLDivElement>(
  deps: unknown[] = [],
) => {
  const scrollRef = useRef<T>(null);
  const [showFade, setShowFade] = useState(false);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowFade(scrollHeight > clientHeight + scrollTop + 2);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    handleScroll();
    const observer = new ResizeObserver(handleScroll);
    observer.observe(container);
    const content = container.firstElementChild;
    if (content) observer.observe(content);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleScroll, ...deps]);

  return { scrollRef, showFade, handleScroll };
};
