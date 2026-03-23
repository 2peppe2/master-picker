import { useState, useEffect } from "react";

/**
 * A hook that provides a key that increments after the first frame.
 * Useful for triggering animations on component mount or dependency changes.
 *
 * @param dependencies Optional list of dependencies to trigger a re-animation.
 * @returns The current animation key.
 */
export const useAnimationKey = (dependencies: any[] = []) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimationKey((prev) => prev + 1);
    });

    return () => cancelAnimationFrame(frame);
  }, dependencies);

  return animationKey;
};
