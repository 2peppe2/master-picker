"use client";

import GenericCombobox, { ComboboxDisplay } from "./GenericComboBox";
import { useSearchParams } from "@/common/hooks/useSearchParams";
import { FC, useEffect, useMemo, useState } from "react";
import { LandingPageProgram } from "../queries";

const DISPLAY_STATES = {
  placeholder: "Select program",
  empty: "No programs found.",
} satisfies ComboboxDisplay;

interface ProgramSelectorProps {
  programs: LandingPageProgram[];
}

const ProgramSelector: FC<ProgramSelectorProps> = ({ programs }) => {
  const { searchParams, setSearchParams } = useSearchParams();
  const [local, setLocal] = useState(searchParams.get("program"));

  useEffect(() => {
    setLocal(searchParams.get("program"));
  }, [searchParams]);

  const items = useMemo(
    () =>
      programs.map((p) => ({
        label: `${p.shortname} - ${p.name}`,
        value: p.program,
      })),
    [programs],
  );

  return (
    <GenericCombobox
      options={items}
      value={items.find((i) => i.value === local) ?? null}
      onValueChange={(item) => {
        const next = item?.value || null;
        setLocal(next);
        setSearchParams({ program: next, year: null, master: null });
      }}
      displayStates={DISPLAY_STATES}
    />
  );
};

export default ProgramSelector;
