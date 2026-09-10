import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FolderKanban,
  LayoutDashboard,
  Package,
  Users,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/feedback/Spinner'
import Alert from '../../components/ui/feedback/Alert'
import Button from '../../components/ui/Button'
import { getDashboardStats } from '../../services/dashboardService'
import { useAsync } from '../../hooks/useAsync'
import type { DashboardStats } from '../../types/dashboard'

interface DashboardCardProps {
  title: string
  value: number | string
  icon: typeof Users
}

function DashboardCard({
  title,
  value,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { t } = useTranslation()

  const {
    data: stats,
    error,
    isLoading,
    execute,
  } = useAsync<DashboardStats>()

  const loadDashboard = useCallback(() => {
    return execute(getDashboardStats)
  }, [execute])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  return (
    <section className="space-y-6">
      <PageHeader
        icon={LayoutDashboard}
        title={t('dashboard.title')}
        description={t('dashboard.welcome')}
      />

      {error !== null && (
        <div className="space-y-3">
          <Alert variant="error">
            {t('dashboard.loadError')}
          </Alert>

          <Button
            variant="secondary"
            onClick={() => void loadDashboard()}
          >
            {t('dashboard.retry')}
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <Card className="flex min-h-32 items-center justify-center p-6 sm:col-span-2 lg:col-span-3">
            <Spinner size="lg" />
          </Card>
        ) : (
          <>
            <DashboardCard
              title={t('dashboard.users')}
              value={stats?.users_count ?? 0}
              icon={Users}
            />

            <DashboardCard
              title={t('dashboard.items')}
              value={stats?.items_count ?? 0}
              icon={Package}
            />

            <DashboardCard
              title={t('dashboard.categories')}
              value={stats?.categories_count ?? 0}
              icon={FolderKanban}
            />
          </>
        )}
      </div>
    </section>
  )
}
