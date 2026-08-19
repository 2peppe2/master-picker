"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useCourseTranslate } from "@/common/components/translate/hooks/useCourseTranslate";
import GenericCombobox, { ComboboxDisplay } from "./GenericComboBox";
import { LandingPageProgram } from "../LandingClientPage";
import { FC, useMemo } from "react";

interface ProgramSelectorProps {
  programs: LandingPageProgram[];
  value: string | null;
  onValueChange: (value: string | null) => void;
}

const ProgramSelector: FC<ProgramSelectorProps> = ({
  programs,
  value,
  onValueChange,
}) => {
  const translateCourse = useCourseTranslate();
  const translate = useCommonTranslate();
  const displayStates = useMemo(
    () =>
      ({
        placeholder: translate("_select_program"),
        empty: translate("_no_programs_found"),
      }) satisfies ComboboxDisplay,
    [translate],
  );
  const items = useMemo(
    () =>
      programs.map((program) => ({
        label: `${program.shortname} - ${translateCourse(program.name)}`,
        value: program.program,
      })),
    [programs, translateCourse],
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

export default ProgramSelector;
