import { useEffect, useState } from "react";

export type Platform = "mac" | "windows" | "linux" | "unknown";

const detectPlatform = (): Platform => {
  if (typeof window === "undefined") return "unknown";

  const platform = window.navigator.platform.toLowerCase();

  if (platform.includes("mac")) return "mac";
  if (platform.includes("win")) return "windows";
  if (platform.includes("linux")) return "linux";

  return "unknown";
};

export const usePlatform = () => {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  return {
    platform,
    isMac: platform === "mac",
    isWindows: platform === "windows",
    isLinux: platform === "linux",
  };
};
