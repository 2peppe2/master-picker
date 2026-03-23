"use client";

import { FC, useState, useEffect } from "react";

const LoadingDots: FC = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return <>{dots}</>;
};

export default LoadingDots;
