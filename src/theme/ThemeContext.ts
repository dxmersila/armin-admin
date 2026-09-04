import { createContext } from 'react'
import type { AppTheme } from '../config/app'

export interface ThemeContextValue {
  theme: AppTheme
  setTheme: (theme: AppTheme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
