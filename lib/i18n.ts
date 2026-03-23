"use client";

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

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
