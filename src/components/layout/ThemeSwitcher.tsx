import { useTranslation } from 'react-i18next'
import { useTheme } from '../../theme/useTheme'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-gray-500">
        {t('common.theme')}
      </span>

      <select
        value={theme}
        onChange={(event) =>
          setTheme(event.target.value as 'light' | 'dark' | 'system')
        }
        className="rounded-md border border-border bg-surface px-2 py-1.5 text-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="system">{t('theme.system')}</option>
        <option value="light">{t('theme.light')}</option>
        <option value="dark">{t('theme.dark')}</option>
      </select>
    </label>
  )
}
