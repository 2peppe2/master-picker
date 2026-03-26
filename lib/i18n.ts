import LanguageDetector from "i18next-browser-languagedetector";
import enCourses from "@/public/locales/en/courses.json";
import svCourses from "@/public/locales/sv/courses.json";
import enCommon from "@/public/locales/en/common.json";
import svCommon from "@/public/locales/sv/common.json";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";

const resources = {
  en: {
    common: enCommon,
    courses: enCourses,
  },
  sv: {
    common: svCommon,
    courses: svCourses,
  },
};

const isClient = typeof window !== "undefined";

const i18nInstance = i18n.use(initReactI18next);

if (isClient) {
  i18nInstance.use(LanguageDetector);
}

i18nInstance.init({
  resources,
  fallbackLng: "sv",
  lng: isClient ? undefined : "sv",
  interpolation: {
    escapeValue: false,
  },
  detection: isClient
    ? {
        order: ["querystring", "localStorage", "cookie"],
        lookupQuerystring: "lang",
        caches: ["localStorage", "cookie"],
      }
    : undefined,
});

export default i18n;
