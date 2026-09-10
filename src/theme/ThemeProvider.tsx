import { useLayoutEffect, useState } from 'react'
import { appConfig, type AppTheme } from '../config/app'
import {
  getStoredTheme,
  setStoredTheme,
} from '../utils/preferences'
import { ThemeContext } from './ThemeContext'

interface ThemeProviderProps {
  children: React.ReactNode
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function resolveTheme(theme: AppTheme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme
}

function applyTheme(theme: AppTheme): void {
  const resolvedTheme = resolveTheme(theme)

  document.documentElement.classList.toggle(
    'dark',
    resolvedTheme === 'dark',
  )

  document.documentElement.style.colorScheme = resolvedTheme
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<AppTheme>(
    getStoredTheme() ?? appConfig.defaultTheme,
  )

  useLayoutEffect(() => {
    applyTheme(theme)
    setStoredTheme(theme)

    if (theme !== 'system') {
      return
    }

    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    )

    const handleChange = () => {
      applyTheme('system')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  function setTheme(nextTheme: AppTheme): void {
    setThemeState(nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
