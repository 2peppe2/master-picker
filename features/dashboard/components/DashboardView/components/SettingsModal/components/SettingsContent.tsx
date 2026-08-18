"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { showBachelorYearsAtom } from "@/features/dashboard/state/preferences/atoms";
import LanguageSwitcher from "@/common/components/translate/LanguageSwitcher";
import { SectionHeader, ToggleSettingsOption } from "./SettingsRows";
import ScheduleLayoutOptions from "./ScheduleLayoutOptions";
import Translate from "@/common/components/translate/Translate";
import LanguageOptions from "./LanguageOptions";
import { useIsLandscapePhone } from "@/common/hooks/useResponsiveLayout";
import { FC, Suspense, useCallback } from "react";
import { useAtom } from "jotai";

interface SettingsContentProps {
  /** Phone sizing, plus the settings that only apply at that breakpoint. */
  phone?: boolean;
}

const SettingsContent: FC<SettingsContentProps> = ({ phone = false }) => {
  const [showBachelorYears, setShowBachelorYears] = useAtom(
    showBachelorYearsAtom,
  );
  const translate = useCommonTranslate();
  const isLandscapePhone = useIsLandscapePhone();

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

      {/*
       * The grid/carousel choice only changes the portrait phone schedule --
       * at landscape widths the sm: block sizing wins regardless -- so the
       * option is left out there rather than offered with no effect.
       */}
      {phone && !isLandscapePhone && (
        <>
          <SectionHeader phone>
            <Translate text="_schedule_layout" />
          </SectionHeader>

          <ScheduleLayoutOptions />
        </>
      )}

      <div className="block lg:hidden">
        <SectionHeader phone={phone}>
          <Translate text="language_settings" />
        </SectionHeader>

        {phone ? (
          <Suspense fallback={<div className="min-h-24" />}>
            <LanguageOptions />
          </Suspense>
        ) : (
          <div className="flex flex-col gap-3 px-4 py-3">
            <LanguageSwitcher />
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsContent;
