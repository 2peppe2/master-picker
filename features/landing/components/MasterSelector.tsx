"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useCourseTranslate } from "@/common/components/translate/hooks/useCourseTranslate";
import GenericCombobox, { ComboboxDisplay } from "./GenericComboBox";
import Translate from "@/common/components/translate/Translate";
import { LandingPageProgram } from "../LandingClientPage";
import { FC, useMemo } from "react";
import { Button } from "@/components/ui/button";
import LoadingDots from "./LoadingDots";
import { Loader2 } from "lucide-react";

interface MasterSelectorProps {
  activeProgram: LandingPageProgram | null;
  year: string | null;
  value: string | null;
  onValueChange: (value: string | null) => void;
  onPickLater: () => void;
  isLoading: boolean;
}

const MasterSelector: FC<MasterSelectorProps> = ({
  activeProgram,
  year,
  value,
  onValueChange,
  onPickLater,
  isLoading,
}) => {
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
  const items = useMemo(() => {
    if (!activeProgram || !year) return [];

    const selectedYearData = activeProgram.years.find(
      (y) => String(y.year) === year,
    );

    if (!selectedYearData) return [];

    return selectedYearData.masters.map((m) => ({
      label: m.name ? courseTranslate(m.name) : translate("unknown_master"),
      value: m.program,
    }));
  }, [activeProgram, year, translate, courseTranslate]);

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <GenericCombobox
        options={items}
        value={items.find((item) => item.value === value) ?? null}
        onValueChange={(item) => onValueChange(item?.value ?? null)}
        displayStates={displayStates}
      />
      <Button
        variant="link"
        onClick={onPickLater}
        disabled={isLoading || !year}
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
