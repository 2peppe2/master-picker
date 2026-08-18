"use client";

import { usePhoneScheduleLayout } from "@/features/dashboard/state/preferences/hooks/usePhoneScheduleLayout";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { ChoiceSettingsOption } from "./SettingsRows";
import { FC } from "react";

/**
 * Phone-only: how a period arranges its blocks. Wider breakpoints have their
 * own fixed layouts, so the preference is offered where it takes effect.
 */
const ScheduleLayoutOptions: FC = () => {
  const { layout, setLayout } = usePhoneScheduleLayout();
  const translate = useCommonTranslate();

  return (
    <div
      className="px-5 landscape-phone:px-0"
      role="radiogroup"
      aria-label={translate("_schedule_layout")}
    >
      <ChoiceSettingsOption
        phone
        selected={layout === "grid"}
        onSelect={() => setLayout("grid")}
        label={translate("schedule_layout_grid")}
        description={translate("_schedule_layout_grid_description")}
      />
      <ChoiceSettingsOption
        phone
        selected={layout === "carousel"}
        onSelect={() => setLayout("carousel")}
        label={translate("schedule_layout_carousel")}
        description={translate("_schedule_layout_carousel_description")}
      />
    </div>
  );
};

export default ScheduleLayoutOptions;
