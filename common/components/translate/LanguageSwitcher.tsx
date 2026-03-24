"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useCallback, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import "@/lib/i18n";

const LanguageSwitcherInner: FC = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === "en" ? "sv" : "en";
    i18n.changeLanguage(newLang);

    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", newLang);
    router.replace(`${pathname}?${params.toString()}`);
  }, [i18n, pathname, router, searchParams]);

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

const LanguageSwitcher: FC = () => (
  <Suspense
    fallback={
      <Button
        variant="outline"
        size="sm"
        disabled
        className="gap-2 h-9 px-4 text-sm font-medium opacity-50"
      >
        <Languages className="h-4 w-4" />
        ...
      </Button>
    }
  >
    <LanguageSwitcherInner />
  </Suspense>
);

export default LanguageSwitcher;
