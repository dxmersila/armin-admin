import { useEffect, useState } from 'react'
import i18n from 'i18next'
import { appConfig, type AppLocale } from '../config/app'
import {
  getStoredLocale,
  setStoredLocale,
} from '../utils/preferences'
import { LanguageContext } from './LanguageContext'

interface LanguageProviderProps {
  children: React.ReactNode
}

function applyLocale(locale: AppLocale): void {
  document.documentElement.lang = locale
  document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr'
}

export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<AppLocale>(
    getStoredLocale() ?? appConfig.defaultLocale,
  )

  useEffect(() => {
    void i18n.changeLanguage(locale)
    applyLocale(locale)
    setStoredLocale(locale)
  }, [locale])

  function setLocale(nextLocale: AppLocale): void {
    setLocaleState(nextLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}
