import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


import enCommon from '@/public/locales/en/common.json';
import svCommon from '@/public/locales/sv/common.json';

const resources = {
    en: {
        common: enCommon
    },
    sv: {
        common: svCommon
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;