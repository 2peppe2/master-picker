"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import GenericCombobox, { ComboboxDisplay } from "./GenericComboBox";
import { LandingPageProgram } from "../LandingClientPage";
import { FC, useMemo } from "react";

interface YearSelectorProps {
  activeProgram: LandingPageProgram | null;
  value: string | null;
  onValueChange: (value: string | null) => void;
}

const YearSelector: FC<YearSelectorProps> = ({
  activeProgram,
  value,
  onValueChange,
}) => {
  const translate = useCommonTranslate();
  const displayStates = useMemo(
    () =>
      ({
        placeholder: translate("_select_starting_year"),
        empty: translate("_no_years_found"),
      }) satisfies ComboboxDisplay,
    [translate],
  );
  const items = useMemo(
    () =>
      activeProgram?.years.map(({ year }) => ({
        label: String(year),
        value: String(year),
      })) ?? [],
    [activeProgram],
  );

  return (
    <GenericCombobox
      options={items}
      value={items.find((item) => item.value === value) ?? null}
      onValueChange={(item) => onValueChange(item?.value ?? null)}
      displayStates={displayStates}
    />
  );
};

export default YearSelector;
