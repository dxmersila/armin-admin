import { useTranslation } from 'react-i18next'

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <section>
      <h1 className="text-2xl font-semibold text-foreground">
        {t('dashboard.title')}
      </h1>

      <p className="mt-2 text-muted-foreground">
        {t('dashboard.welcome')}
      </p>
    </section>
  )
}
