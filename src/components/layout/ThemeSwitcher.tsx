import { Monitor, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../theme/useTheme'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  function toggleTheme() {
    if (theme === 'light') {
      setTheme('dark')
      return
    }

    if (theme === 'dark') {
      setTheme('system')
      return
    }

    setTheme('light')
  }

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  const themeLabel =
    theme === 'light'
      ? t('theme.light')
      : theme === 'dark'
        ? t('theme.dark')
        : t('theme.system')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t('common.theme')}
      title={`${t('common.theme')}: ${themeLabel}`}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      <Icon className="size-5" />
    </button>
  )
}
