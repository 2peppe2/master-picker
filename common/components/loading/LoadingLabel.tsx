import type { FC, ReactNode } from "react";
import LoadingDots from "./LoadingDots";

interface LoadingLabelProps {
  children: ReactNode;
}

const LoadingLabel: FC<LoadingLabelProps> = ({ children }) => (
  <span>
    {children}
    <LoadingDots />
  </span>
);

export default LoadingLabel;
