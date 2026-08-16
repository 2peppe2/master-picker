"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useCallback, Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/lib/i18n";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcherInner: FC<LanguageSwitcherProps> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === "en" ? "sv" : "en";
    i18n.changeLanguage(newLang);

    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", newLang);
    router.replace(`${pathname}?${params.toString()}`);
  }, [i18n, pathname, router, searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayLanguage = (
    mounted ? i18n.language || "sv" : "sv"
  ).toUpperCase();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={cn("h-9 gap-2 px-4 text-sm font-medium", className)}
    >
      <Languages className="h-4 w-4" />
      {displayLanguage}
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
