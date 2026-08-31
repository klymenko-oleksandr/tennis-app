import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../locales/en.json';
import uk from '../locales/uk.json';

// Real users (Kyiv) default to Ukrainian; English stays available for
// demoing to English-speaking recruiters, per DR.md §7.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uk: { translation: uk },
    },
    fallbackLng: 'uk',
    supportedLngs: ['en', 'uk'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'tennis-app.lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
