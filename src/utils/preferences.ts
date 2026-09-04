import type { AppLocale, AppTheme } from '../config/app'

const LOCALE_KEY = 'armin_admin_locale'
const THEME_KEY = 'armin_admin_theme'

export function getStoredLocale(): AppLocale | null {
  const value = localStorage.getItem(LOCALE_KEY)

  return value === 'fa' || value === 'en' ? value : null
}

export function setStoredLocale(locale: AppLocale): void {
  localStorage.setItem(LOCALE_KEY, locale)
}

export function getStoredTheme(): AppTheme | null {
  const value = localStorage.getItem(THEME_KEY)

  return value === 'light' || value === 'dark' || value === 'system'
    ? value
    : null
}

export function setStoredTheme(theme: AppTheme): void {
  localStorage.setItem(THEME_KEY, theme)
}
