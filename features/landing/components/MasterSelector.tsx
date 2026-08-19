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
  const translate = useCommonTranslate();
  const courseTranslate = useCourseTranslate();
  const displayStates = useMemo(
    () =>
      ({
        placeholder: translate("_select_master"),
        empty: translate("_no_masters_found"),
      }) satisfies ComboboxDisplay,
    [translate],
  );
  const items = useMemo(() => {
    const selectedYear = activeProgram?.years.find(
      (item) => String(item.year) === year,
    );
    return (
      selectedYear?.masters.map((master) => ({
        label: master.name
          ? courseTranslate(master.name)
          : translate("_unknown_master"),
        value: master.program,
      })) ?? []
    );
  }, [activeProgram, courseTranslate, translate, year]);

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <GenericCombobox
        options={items}
        value={items.find((item) => item.value === value) ?? null}
        onValueChange={(item) => onValueChange(item?.value ?? null)}
        displayStates={displayStates}
      />
      <fieldset disabled={isLoading || !year} className="contents">
        <Button variant="link" onClick={onPickLater}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? (
            <LoadingDots text={translate("_loading_dashboard")} />
          ) : (
            <Translate text="_pick_master_later" />
          )}
        </Button>
      </fieldset>
    </div>
  );
};

export default MasterSelector;
