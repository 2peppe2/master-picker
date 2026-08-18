"use client";

import Translate from "@/common/components/translate/Translate";
import { usePrefersSheet } from "@/common/hooks/useResponsiveLayout";
import ModuleSelectorSmall from "./ModuleSelectorSmall";
import ModuleSelectorLarge from "./ModuleSelectorLarge";
import { ModuleSelectorProps } from "./types";
import { Label } from "@/components/ui/label";
import { FC, useCallback, useState } from "react";

const ModuleSelector: FC<ModuleSelectorProps> = (props) => {
  const prefersSheet = usePrefersSheet();
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

  const setVisibleCount = useCallback(
    (code: string, count: number) =>
      setVisibleCounts((current) => ({ ...current, [code]: count })),
    [],
  );

  return (
    <div className="space-y-2" data-no-swipe="true">
      <Label className="text-sm font-medium text-foreground">
        <Translate text="_examination_history" />
      </Label>

      {prefersSheet ? (
        <ModuleSelectorSmall
          {...props}
          visibleCounts={visibleCounts}
          setVisibleCount={setVisibleCount}
        />
      ) : (
        <ModuleSelectorLarge
          {...props}
          visibleCounts={visibleCounts}
          setVisibleCount={setVisibleCount}
        />
      )}
    </div>
  );
};

export default ModuleSelector;
