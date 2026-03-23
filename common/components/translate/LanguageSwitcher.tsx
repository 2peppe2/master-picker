"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { FC, useCallback } from "react";
import "@/lib/i18n";

const LanguageSwitcher: FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = useCallback(
    () => i18n.changeLanguage(i18n.language === "en" ? "sv" : "en"),
    [i18n],
  );

  const displayLanguage = i18n.language.split("-")[0].toUpperCase();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 h-9 px-4 text-sm font-medium"
    >
      <Languages className="h-4 w-4" />
      {displayLanguage}
    </Button>
  );
};

export default LanguageSwitcher;
