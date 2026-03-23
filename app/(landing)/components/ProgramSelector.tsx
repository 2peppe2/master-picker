"use client";

import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import GenericCombobox, { ComboboxDisplay } from "./GenericComboBox";
import { useSearchParams } from "@/common/hooks/useSearchParams";
import { LandingPageProgram } from "../LandingClientPage";
import { FC, useEffect, useMemo, useState } from "react";

interface ProgramSelectorProps {
  programs: LandingPageProgram[];
}

const ProgramSelector: FC<ProgramSelectorProps> = ({ programs }) => {
  const translate = useCommonTranslate();
  const { searchParams, setSearchParams } = useSearchParams();

  const displayStates = useMemo(
    () =>
      ({
        placeholder: translate("select_program"),
        empty: translate("no_programs_found"),
      }) satisfies ComboboxDisplay,
    [translate],
  );
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
      displayStates={displayStates}
    />
  );
};

export default ProgramSelector;
