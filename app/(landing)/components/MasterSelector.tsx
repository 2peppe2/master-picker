"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useCourseTranslate } from "@/common/components/translate/hooks/useCourseTranslate";
import GenericCombobox, { ComboboxDisplay } from "./GenericComboBox";
import { useSearchParams } from "@/common/hooks/useSearchParams";
import Translate from "@/common/components/translate/Translate";
import { LandingPageProgram } from "../LandingClientPage";
import { FC, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingDots from "./LoadingDots";
import { Loader2 } from "lucide-react";

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
  const { searchParams, setSearchParams } = useSearchParams();
  const courseTranslate = useCourseTranslate();
  const translate = useCommonTranslate();

  const displayStates = useMemo(
    () =>
      ({
        placeholder: translate("select_master"),
        empty: translate("no_masters_found"),
      }) satisfies ComboboxDisplay,
    [translate],
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
      label: m.name ? courseTranslate(m.name) : translate("unknown_master"),
      value: m.program,
    }));
  }, [activeProgram, yearParam, translate]);

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
          <LoadingDots text={translate("loading_dashboard")} />
        ) : (
          <Translate text="pick_master_later" />
        )}
      </Button>
    </div>
  );
};

export default MasterSelector;
