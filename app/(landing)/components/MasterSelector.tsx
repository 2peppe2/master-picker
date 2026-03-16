"use client";

import GenericCombobox, { ComboboxDisplay } from "./GenericComboBox";
import { useSearchParams } from "@/common/hooks/useSearchParams";
import { FC, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LandingPageProgram } from "../queries";
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
  const [local, setLocal] = useState(searchParams.get("master"));

  useEffect(() => {
    setLocal(searchParams.get("master"));
  }, [searchParams]);

  const items = useMemo(
    () =>
      activeProgram?.masters.map((m) => ({
        label: m.name ?? m.master,
        value: m.master,
      })) ?? [],
    [activeProgram],
  );

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
      <Button variant="link" onClick={onPickLater} disabled={isLoading}>
        {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
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
