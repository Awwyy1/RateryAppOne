import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import es from './locales/es';
import pt from './locales/pt';

// Detect saved language or browser language
const getSavedLanguage = (): string => {
  const saved = localStorage.getItem('ratery_language');
  if (saved && ['en', 'es', 'pt'].includes(saved)) return saved;

  // Auto-detect from browser
  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  if (browserLang === 'es') return 'es';
  if (browserLang === 'pt') return 'pt';
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    pt: { translation: pt },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('ratery_language', lng);
});

export default i18n;
