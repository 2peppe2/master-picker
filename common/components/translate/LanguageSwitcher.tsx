"use client";

import { useLanguageSelection } from "./hooks/useLanguageSelection";
import { Button } from "@/components/ui/button";
import { FC, Suspense } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/lib/i18n";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcherInner: FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, setLanguage } = useLanguageSelection();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "sv" : "en")}
      className={cn("h-9 gap-2 px-4 text-sm font-medium", className)}
    >
      <Languages className="h-4 w-4" />
      {language.toUpperCase()}
    </Button>
  );
};

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ className }) => (
  <Suspense
    fallback={
      <Button
        variant="outline"
        size="sm"
        className={cn("h-9 gap-2 px-4 text-sm font-medium", className)}
      >
        <Languages className="h-4 w-4" />
        SV
      </Button>
    }
  >
    <LanguageSwitcherInner className={className} />
  </Suspense>
);

export default LanguageSwitcher;
