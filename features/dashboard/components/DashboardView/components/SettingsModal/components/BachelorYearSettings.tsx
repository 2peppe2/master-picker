"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { showBachelorYearsAtom } from "@/features/dashboard/state/preferences/atoms";
import { SectionHeader, ToggleSettingsOption } from "./SettingsRows";
import Translate from "@/common/components/translate/Translate";
import { FC, useCallback } from "react";
import { useAtom } from "jotai";

interface BachelorYearSettingsProps {
  phone?: boolean;
}

const BachelorYearSettings: FC<BachelorYearSettingsProps> = ({
  phone = false,
}) => {
  const [showBachelorYears, setShowBachelorYears] = useAtom(
    showBachelorYearsAtom,
  );
  const translate = useCommonTranslate();
  const handleToggleBachelorYears = useCallback(
    (state: boolean) => setShowBachelorYears(state),
    [setShowBachelorYears],
  );

  return (
    <>
      <SectionHeader phone={phone}>
        <Translate text="_layout_settings" />
      </SectionHeader>
      <div className={phone ? "px-5 landscape-phone:px-0" : "p-1"}>
        <ToggleSettingsOption
          phone={phone}
          value={showBachelorYears}
          onChange={handleToggleBachelorYears}
          label={translate("_show_bachelor_years")}
          description={translate("_semesters_1_to_6")}
        />
      </div>
    </>
  );
};

export default BachelorYearSettings;
