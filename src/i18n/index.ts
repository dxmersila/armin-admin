import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fa from './locales/fa'
import en from './locales/en'

export const resources = {
  fa: {
    translation: fa,
  },
  en: {
    translation: en,
  },
} as const

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fa',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
