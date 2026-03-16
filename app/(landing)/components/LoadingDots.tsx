"use client";

import { useState, useEffect, FC } from "react";

interface LoadingDotsProps {
  text: string;
}

const LoadingDots: FC<LoadingDotsProps> = ({ text }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev + 1) % 4);
    }, 300);

    return () => clearInterval(interval);
  }, [setCount]);

  return (
    <span>
      {text}
      <span className="inline-block w-6 text-left">{".".repeat(count)}</span>
    </span>
  );
};

export default LoadingDots;
