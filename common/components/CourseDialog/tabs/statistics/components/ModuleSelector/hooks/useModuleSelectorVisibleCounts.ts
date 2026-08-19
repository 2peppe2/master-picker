import { useCallback, useState } from "react";

export const useModuleSelectorVisibleCounts = () => {
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const setVisibleCount = useCallback(
    (code: string, count: number) =>
      setVisibleCounts((current) => ({ ...current, [code]: count })),
    [],
  );

  return { visibleCounts, setVisibleCount };
};
