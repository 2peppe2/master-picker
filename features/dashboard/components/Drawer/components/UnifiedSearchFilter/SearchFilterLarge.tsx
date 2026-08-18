"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useSearchFilterState } from "./hooks/useSearchFilterState";
import MultiSelect from "@/components/ui/MultiSelect";
import { FC } from "react";

/** Desktop presentation: one combined multi-select, no overlay needed. */
const SearchFilterLarge: FC = () => {
  const { categoryLabels, groupedOptions, selectedValues, handleValuesChange } =
    useSearchFilterState();
  const translate = useCommonTranslate();

  return (
    <MultiSelect
      options={groupedOptions}
      value={selectedValues}
      onValueChange={handleValuesChange}
      categoryLabels={categoryLabels}
      backLabel={translate("back")}
      placeholder={translate("_filter_by_master_field_or_type")}
    />
  );
};

export default SearchFilterLarge;
