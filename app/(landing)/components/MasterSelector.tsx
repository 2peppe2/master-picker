"use client";

import GenericCombobox, { ComboboxDisplay } from "./GenericComboBox";
import { useSearchParams } from "@/common/hooks/useSearchParams";
import { LandingPageProgram } from "../LandingClientPage"; 
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import { FC, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import LoadingDots from "./LoadingDots";

interface MasterSelectorProps {
  activeProgram: LandingPageProgram | null;
  onPickLater: () => void;
  isLoading: boolean;
}

const MasterSelector: FC<MasterSelectorProps> = ({
  activeProgram,
  onPickLater,
  isLoading,
}) => {
  const t = useCommonTranslate();
  const { searchParams, setSearchParams } = useSearchParams();

  const displayStates = useMemo(
    () =>
      ({
        placeholder: t("select_master"),
        empty: t("no_masters_found"),
      }) satisfies ComboboxDisplay,
    [t],
  );
  const masterParam = searchParams.get("master");
  const yearParam = searchParams.get("year");

  const [local, setLocal] = useState(masterParam);

  useEffect(() => {
    setLocal(searchParams.get("master"));
  }, [searchParams]);

  const items = useMemo(() => {
    if (!activeProgram || !yearParam) return [];

    const selectedYearData = activeProgram.years.find(
      (y) => String(y.year) === yearParam,
    );

    if (!selectedYearData) return [];

    return selectedYearData.masters.map((m) => ({
      label: m.name ?? t("unknown_master"),
      value: m.program,
    }));
  }, [activeProgram, yearParam, t]);

  return (
    <div className="flex flex-col items-center gap-2">
      <GenericCombobox
        options={items}
        value={items.find((i) => i.value === local) ?? null}
        onValueChange={(item) => {
          const next = item?.value || null;
          setLocal(next);
          setSearchParams({ master: next });
        }}
        displayStates={displayStates}
      />
      <Button
        variant="link"
        onClick={onPickLater}
        disabled={isLoading || !yearParam}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? (
          <LoadingDots text={t("loading_dashboard")} />
        ) : (
          t("pick_master_later")
        )}
      </Button>
    </div>
  );
};

export default MasterSelector;
