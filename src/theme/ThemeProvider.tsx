import { useEffect, useState } from 'react'
import type { AppTheme } from '../config/app'
import { appConfig } from '../config/app'
import { ThemeContext } from './ThemeContext'

interface ThemeProviderProps {
  children: React.ReactNode
}

function resolveTheme(theme: AppTheme): 'light' | 'dark' {
  if (theme !== 'system') {
    return theme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(theme: AppTheme) {
  const resolvedTheme = resolveTheme(theme)

  document.documentElement.classList.toggle(
    'dark',
    resolvedTheme === 'dark',
  )
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<AppTheme>(
    appConfig.defaultTheme,
  )

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function setTheme(nextTheme: AppTheme) {
    setThemeState(nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
