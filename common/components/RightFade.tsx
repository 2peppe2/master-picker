import { cn } from "@/lib/utils";
import { FC } from "react";

interface RightFadeProps {
  className?: string;
}

/**
 * Gradient overlay pinned to the right of a horizontal scroll area to hint that
 * more content is available sideways. Render it as a sibling of the scroll
 * container, inside a `relative` wrapper that matches the visible scroll area
 * (NOT inside the scroll container itself, or it would scroll with the
 * content). Pair with {@link useRightScrollFade}.
 */
const RightFade: FC<RightFadeProps> = ({ className }) => (
  <div
    className={cn(
      "pointer-events-none absolute inset-y-0 right-0 w-8",
      "bg-gradient-to-l from-card via-card/60 to-transparent",
      className,
    )}
  />
);

export default RightFade;
