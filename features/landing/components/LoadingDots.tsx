"use client";

import LoadingIndicator from "@/common/components/loading/LoadingDots";
import { FC } from "react";

interface LoadingDotsProps {
  text: string;
}

const LoadingDots: FC<LoadingDotsProps> = ({ text }) => {
  return (
    <span>
      {text}
      <LoadingIndicator />
    </span>
  );
};

export default LoadingDots;
