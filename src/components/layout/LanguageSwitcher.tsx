import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../i18n/useLanguage'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const { t } = useTranslation()

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-gray-500">
        {t('common.language')}
      </span>

      <select
        value={locale}
        onChange={(event) =>
          setLocale(event.target.value as 'fa' | 'en')
        }
        className="rounded-md border border-border bg-surface px-2 py-1.5 text-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="fa">فارسی</option>
        <option value="en">English</option>
      </select>
    </label>
  )
}
