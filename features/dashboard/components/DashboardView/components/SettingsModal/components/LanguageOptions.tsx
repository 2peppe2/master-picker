"use client";

import {
  LANGUAGES,
  LANGUAGE_LABEL_KEYS,
  useLanguageSelection,
} from "@/common/components/translate/hooks/useLanguageSelection";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { ChoiceSettingsOption } from "./SettingsRows";
import { FC } from "react";

/**
 * Phone-only: every language as its own row. The sheet has the height for it,
 * where the popover has to make do with the compact toggle.
 *
 * Must be rendered inside a Suspense boundary -- `useLanguageSelection` reads
 * search params.
 */
const LanguageOptions: FC = () => {
  const { language, setLanguage } = useLanguageSelection();
  const translate = useCommonTranslate();

  return (
    <div
      className="px-5 landscape-phone:px-0"
      role="radiogroup"
      aria-label={translate("language_settings")}
    >
      {LANGUAGES.map((option) => (
        <ChoiceSettingsOption
          key={option}
          phone
          selected={language === option}
          onSelect={() => setLanguage(option)}
          label={translate(LANGUAGE_LABEL_KEYS[option])}
        />
      ))}
    </div>
  );
};

export default LanguageOptions;
