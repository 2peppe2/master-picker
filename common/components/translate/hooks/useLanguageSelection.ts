"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export const LANGUAGES = ["sv", "en"] as const;

export type Language = (typeof LANGUAGES)[number];

/** Translation keys for each language's name, resolved in the active locale. */
export const LANGUAGE_LABEL_KEYS: Record<Language, string> = {
  sv: "language_swedish",
  en: "language_english",
};

/**
 * Reads and writes the active language, keeping the `lang` query parameter in
 * sync so a shared link opens in the same language.
 *
 * Callers must sit inside a Suspense boundary -- `useSearchParams` suspends
 * during static rendering.
 */
export const useLanguageSelection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setLanguage = useCallback(
    (language: Language) => {
      if (language === i18n.language) return;

      i18n.changeLanguage(language);

      const params = new URLSearchParams(searchParams.toString());
      params.set("lang", language);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [i18n, pathname, router, searchParams],
  );

  // Hydration guard: the detector only resolves on the client, so report the
  // server default until mount rather than flashing the wrong selection.
  const language: Language =
    mounted && i18n.language === "en" ? "en" : "sv";

  return { language, setLanguage };
};
