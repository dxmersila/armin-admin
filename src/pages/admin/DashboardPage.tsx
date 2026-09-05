import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FolderKanban,
  Package,
  Users,
} from 'lucide-react'
import Card from '../../components/ui/Card'
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
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {t('dashboard.title')}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {t('dashboard.welcome')}
        </p>
      </div>

      {error !== null && (
        <div className="space-y-3">
          <Alert variant="error">
            خطا در دریافت اطلاعات داشبورد.
          </Alert>

          <Button
            variant="secondary"
            onClick={() => void loadDashboard()}
          >
            تلاش مجدد
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
              title="کاربران"
              value={stats?.users_count ?? 0}
              icon={Users}
            />

            <DashboardCard
              title="محصولات"
              value={stats?.items_count ?? 0}
              icon={Package}
            />

            <DashboardCard
              title="دسته‌بندی‌ها"
              value={stats?.categories_count ?? 0}
              icon={FolderKanban}
            />
          </>
        )}
      </div>
    </section>
  )
}
