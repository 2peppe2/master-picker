"use client";

import GenericCombobox, { ComboboxDisplay } from "./GenericComboBox";
import { useSearchParams } from "@/common/hooks/useSearchParams";
import { LandingPageProgram } from "../LandingClientPage"; // Ensure this matches the new { years: [...] } type
import { FC, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import LoadingDots from "./LoadingDots";

const DISPLAY_STATES = {
  placeholder: "Select master",
  empty: "No masters found.",
} satisfies ComboboxDisplay;

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
      label: m.name ?? "Unknown master",
      value: m.program,
    }));
  }, [activeProgram, yearParam]);

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
        displayStates={DISPLAY_STATES}
      />
      <Button
        variant="link"
        onClick={onPickLater}
        disabled={isLoading || !yearParam}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? (
          <LoadingDots text="Loading dashboard" />
        ) : (
          "Pick master later"
        )}
      </Button>
    </div>
  );
};

export default MasterSelector;
