"use client";

import GenericCombobox, { ComboboxDisplay } from "./GenericComboBox";
import { useSearchParams } from "@/common/hooks/useSearchParams";
import { LandingPageProgram } from "../LandingClientPage";
import { FC, useEffect, useMemo, useState } from "react";

const DISPLAY_STATES = {
  placeholder: "Select starting year",
  empty: "No years found.",
} satisfies ComboboxDisplay;

interface YearSelectorProps {
  activeProgram: LandingPageProgram | null;
}

const YearSelector: FC<YearSelectorProps> = ({ activeProgram }) => {
  const { searchParams, setSearchParams } = useSearchParams();
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
      displayStates={DISPLAY_STATES}
    />
  );
};

export default YearSelector;
