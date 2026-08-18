"use client";

import { useLanguageSelection } from "../../hooks/useLanguageSelection";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FC } from "react";

export interface LanguageSwitcherProps {
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

export default LanguageSwitcherInner;
