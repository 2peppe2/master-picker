"use client";

import GenericCombobox, { ComboboxDisplay } from "./GenericComboBox";
import { useSearchParams } from "@/common/hooks/useSearchParams";
import { LandingPageProgram } from "../LandingClientPage";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import { FC, useEffect, useMemo, useState } from "react";

interface YearSelectorProps {
  activeProgram: LandingPageProgram | null;
}

const YearSelector: FC<YearSelectorProps> = ({ activeProgram }) => {
  const t = useCommonTranslate();
  const { searchParams, setSearchParams } = useSearchParams();

  const displayStates = useMemo(
    () =>
      ({
        placeholder: t("select_starting_year"),
        empty: t("no_years_found"),
      }) satisfies ComboboxDisplay,
    [t],
  );
  const [local, setLocal] = useState(searchParams.get("year"));

  useEffect(() => {
    setLocal(searchParams.get("year"));
  }, [searchParams]);

  const items = useMemo(() => {
    if (!activeProgram?.years) return [];

    return activeProgram.years.map((y) => ({
      label: String(y.year),
      value: String(y.year),
    }));
  }, [activeProgram]);

  return (
    <GenericCombobox
      options={items}
      value={items.find((i) => i.value === local) ?? null}
      onValueChange={(item) => {
        const next = item?.value || null;
        setLocal(next);
        setSearchParams({ year: next, master: null });
      }}
      displayStates={displayStates}
    />
  );
};

export default YearSelector;
