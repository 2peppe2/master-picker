"use client";

import { FC } from "react";

const LoadingDots: FC = () => (
  <span
    aria-hidden="true"
    className="inline-flex w-[3ch] justify-start motion-reduce:[&>span]:animate-none"
  >
    <span className="animate-pulse [animation-delay:-400ms]">.</span>
    <span className="animate-pulse [animation-delay:-200ms]">.</span>
    <span className="animate-pulse">.</span>
  </span>
);

export default LoadingDots;
