import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import hi from './locales/hi.json';
import ml from './locales/ml.json';
import kn from './locales/kn.json';
import bn from './locales/bn.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import pa from './locales/pa.json';
import or from './locales/or.json';
import ur from './locales/ur.json';
import { LANGUAGES, getLanguageDirection } from './utils/languages';

const resources = {
  en: { translation: en },
  ta: { translation: ta },
  te: { translation: te },
  hi: { translation: hi },
  ml: { translation: ml },
  kn: { translation: kn },
  bn: { translation: bn },
  mr: { translation: mr },
  gu: { translation: gu },
  pa: { translation: pa },
  or: { translation: or },
  ur: { translation: ur },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: LANGUAGES.map((l) => l.code),
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'nammafix_lang',
    },
  });

const applyLangDirection = (lng) => {
  const code = lng ? lng.split('-')[0] : 'en';
  document.documentElement.lang = code;
  document.documentElement.dir = getLanguageDirection(code);
};

applyLangDirection(i18n.language);

i18n.on('languageChanged', (lng) => {
  applyLangDirection(lng);
});

export default i18n;
