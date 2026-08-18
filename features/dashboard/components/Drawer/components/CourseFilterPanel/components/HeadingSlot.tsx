import type { FC, ReactNode } from "react";

interface HeadingSlotProps {
  children?: ReactNode;
}

const HeadingSlot: FC<HeadingSlotProps> = ({ children }) => (
  <span
    aria-hidden
    className="flex size-6 shrink-0 items-center justify-center"
  >
    {children}
  </span>
);

export default HeadingSlot;
