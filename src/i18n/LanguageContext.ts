import { createContext } from 'react'
import type { AppLocale } from '../config/app'

export interface LanguageContextValue {
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
}

export const LanguageContext =
  createContext<LanguageContextValue | null>(null)
