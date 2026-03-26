"use client";

import { useTranslation } from "react-i18next";
import { useMemo, useState, useEffect } from "react";
import "@/lib/i18n";

/**
 * Custom hook that provides the translation function for the 'courses' namespace.
 */
export const useCourseTranslate = () => {
  const { t, i18n } = useTranslation("courses");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This is a hydration guard to ensure the initial render matches the server default (Swedish).
  return useMemo(() => {
    if (!mounted) {
      return ((key: string, options?: any) => {
        return i18n.t(key, { ...options, lng: "sv", ns: "courses" });
      }) as typeof t;
    }
    return t;
  }, [t, i18n, mounted]);
};
