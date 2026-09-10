import { BadgeCheck, Eye, Pencil, Plus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import { useLanguage } from '../../i18n/useLanguage'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import IconButton from '../../components/ui/IconButton'
import PageHeader from '../../components/ui/PageHeader'
import Pagination from '../../components/ui/Pagination'
import Spinner from '../../components/ui/feedback/Spinner'
import Alert from '../../components/ui/feedback/Alert'
import Table, {
  type TableColumn,
} from '../../components/ui/Table'
import { useAsync } from '../../hooks/useAsync'
import { getAdminSubscriptionPlans } from '../../services/subscriptionPlanService'
import type { AdminSubscriptionPlan } from '../../types/subscriptionPlan'
import { formatDate, formatPrice } from '../../utils/format'
import type { PaginatedResponse } from '../../types/item'

export default function SubscriptionPlansPage() {
  const { locale } = useLanguage()
  const { t } = useTranslation()

  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data,
    error,
    isLoading,
    execute,
  } = useAsync<PaginatedResponse<AdminSubscriptionPlan>>()

  const loadPlans = useCallback(
    (page = currentPage) =>
      execute(() => getAdminSubscriptionPlans(page)),
    [currentPage, execute],
  )

  useEffect(() => {
    void loadPlans(currentPage)
  }, [currentPage, loadPlans])

  const columns: TableColumn<AdminSubscriptionPlan>[] = [
    {
      key: 'id',
      header: t('subscriptionPlans.table.id'),
      render: (plan) => `#${plan.id}`,
    },
    {
      key: 'name',
      header: t('subscriptionPlans.table.name'),
      render: (plan) => plan.name,
    },
    {
      key: 'duration_months',
      header: t('subscriptionPlans.table.duration'),
      render: (plan) => `${plan.duration_months} ${t('subscriptionPlans.table.months')}`,
    },
    {
      key: 'price',
      header: t('subscriptionPlans.table.price'),
      render: (plan) => formatPrice(plan.price, locale),
    },
    {
      key: 'is_active',
      header: t('subscriptionPlans.table.status'),
      render: (plan) =>
        plan.is_active ? (
          <Badge variant="success">
            {t('subscriptionPlans.table.active')}
          </Badge>
        ) : (
          <Badge variant="neutral">
            {t('subscriptionPlans.table.inactive')}
          </Badge>
        ),
    },
    {
      key: 'created_at',
      header: t('subscriptionPlans.table.createdAt'),
      render: (plan) => formatDate(plan.created_at, locale),
    },
    {
      key: 'actions',
      header: (
        <span className="block text-center">
          {t('subscriptionPlans.table.actions')}
        </span>
      ),
      className: 'w-24 text-center',
      render: (plan) => (
        <div className="flex justify-center gap-1">
          <IconButton
            type="button"
            title={t('subscriptionPlans.table.view')}
            aria-label={`${t('subscriptionPlans.table.view')} ${plan.name}`}
            onClick={() =>
              navigate(`/admin/subscription-plans/${plan.id}`)
            }
          >
            <Eye className="size-4" />
          </IconButton>

          <IconButton
            type="button"
            title={t('subscriptionPlans.table.edit')}
            aria-label={`${t('subscriptionPlans.table.edit')} ${plan.name}`}
            onClick={() =>
              navigate(
                `/admin/subscription-plans/${plan.id}/edit`,
              )
            }
          >
            <Pencil className="size-4" />
          </IconButton>
        </div>
      ),
    },
  ]

  return (
    <section className="space-y-6">
      <PageHeader
        icon={BadgeCheck}
        title={t('subscriptionPlans.title')}
        description={t('subscriptionPlans.description')}
        actions={
          <Button
            className="w-full sm:w-auto"
            onClick={() =>
              navigate('/admin/subscription-plans/create')
            }
          >
            <Plus className="size-4" />
            {t('subscriptionPlans.add')}
          </Button>
        }
      />

      {error !== null && (
        <Alert variant="error">
          {t('subscriptionPlans.feedback.loadError')}
        </Alert>
      )}

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={data?.data ?? []}
            getRowKey={(plan) => plan.id}
            emptyMessage={t('subscriptionPlans.table.empty')}
          />
        )}

        {!isLoading && data && data.meta.last_page > 1 && (
          <div className="border-t border-border px-4 py-4">
            <Pagination
              currentPage={data.meta.current_page}
              lastPage={data.meta.last_page}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>
    </section>
  )
}
