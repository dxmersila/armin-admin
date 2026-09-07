import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../i18n/useLanguage'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const { t } = useTranslation()

  function toggleLanguage() {
    setLocale(locale === 'fa' ? 'en' : 'fa')
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t('common.language')}
      title={`${t('common.language')}: ${locale === 'fa' ? 'فارسی' : 'English'}`}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      <Globe className="size-5" />
    </button>
  )
}
