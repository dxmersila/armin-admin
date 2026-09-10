import { useCallback, useEffect, useState } from 'react'
import { Eye, Filter, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../i18n/useLanguage'
import Alert from '../../components/ui/feedback/Alert'
import Button from '../../components/ui/Button'
import IconButton from '../../components/ui/IconButton'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import FilterBar from '../../components/ui/FilterBar'
import Input from '../../components/ui/Input'
import Pagination from '../../components/ui/Pagination'
import Select from '../../components/ui/Select'
import Spinner from '../../components/ui/feedback/Spinner'
import Table from '../../components/ui/Table'
import { useAsync } from '../../hooks/useAsync'
import { getAdminOrders } from '../../services/orderService'
import type {
  AdminOrder,
  OrderStatus,
  PaymentStatus,
} from '../../types/order'
import {
  getOrderStatusLabelKey,
  getOrderTypeLabelKey,
} from '../../utils/orderLabels'
import type { PaginatedResponse } from '../../types/item'
import { formatDate, formatPrice } from '../../utils/format'

interface OrderFilters {
  status: OrderStatus | ''
  user_id: string
  payment_status: PaymentStatus | ''
}

const emptyFilters: OrderFilters = {
  status: '',
  user_id: '',
  payment_status: '',
}

export default function OrdersPage() {
  const { locale } = useLanguage()

  const navigate = useNavigate()
  const { t } = useTranslation()

  const orderStatusOptions: Array<{
    value: OrderStatus
    label: string
  }> = [
    { value: 'pending', label: t('orders.status.pending') },
    { value: 'paid', label: t('orders.status.paid') },
    { value: 'failed', label: t('orders.status.failed') },
    { value: 'cancelled', label: t('orders.status.cancelled') },
  ]

  const paymentStatusOptions: Array<{
    value: PaymentStatus
    label: string
  }> = [
    { value: 'pending', label: t('orders.paymentStatus.pending') },
    { value: 'paid', label: t('orders.paymentStatus.paid') },
    { value: 'failed', label: t('orders.paymentStatus.failed') },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] =
    useState<OrderFilters>(emptyFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<OrderFilters>(emptyFilters)

  const {
    data,
    error,
    isLoading,
    execute,
  } = useAsync<PaginatedResponse<AdminOrder>>()

  const loadOrders = useCallback(
    (page = currentPage, activeFilters = appliedFilters) =>
      execute(() =>
        getAdminOrders(page, {
          status: activeFilters.status || undefined,
          user_id: activeFilters.user_id
            ? Number(activeFilters.user_id)
            : undefined,
          payment_status:
            activeFilters.payment_status || undefined,
        }),
      ),
    [currentPage, appliedFilters, execute],
  )

  useEffect(() => {
    void loadOrders(currentPage, appliedFilters)
  }, [currentPage, appliedFilters, loadOrders])

  function handleFilterChange<K extends keyof OrderFilters>(
    field: K,
    value: OrderFilters[K],
  ) {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleApplyFilters() {
    setCurrentPage(1)
    setAppliedFilters(filters)
  }

  function handleClearFilters() {
    setCurrentPage(1)
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
  }

  return (
    <section className="space-y-6">
      <PageHeader
        icon={ShoppingCart}
        title={t('orders.title')}
        description={t('orders.description')}
      />

      <Card className="p-4 sm:p-6">
        <FilterBar>
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-muted-foreground" />

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {t('orders.filters.title')}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {t('orders.filters.description')}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Select
              id="order-status-filter"
              label={t('orders.filters.orderStatus')}
              value={filters.status}
              onChange={(event) =>
                handleFilterChange(
                  'status',
                  event.target.value as OrderStatus | '',
                )
              }
            >
              <option value="">{t('orders.filters.allStatuses')}</option>

              {orderStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Input
              id="order-user-id-filter"
              label={t('orders.filters.userId')}
              type="number"
              min={1}
              inputMode="numeric"
              placeholder={t('orders.filters.userIdPlaceholder')}
              value={filters.user_id}
              onChange={(event) =>
                handleFilterChange('user_id', event.target.value)
              }
            />

            <Select
              id="order-payment-status-filter"
              label={t('orders.filters.paymentStatus')}
              value={filters.payment_status}
              onChange={(event) =>
                handleFilterChange(
                  'payment_status',
                  event.target.value as PaymentStatus | '',
                )
              }
            >
              <option value="">{t('orders.filters.allPaymentStatuses')}</option>

              {paymentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClearFilters}
            >
              {t('common.clear')}
            </Button>

            <Button
              type="button"
              onClick={handleApplyFilters}
            >
              {t('common.apply')}
            </Button>
          </div>
        </FilterBar>
      </Card>

      {error !== null && (
        <Alert variant="error">
          {t('orders.feedback.loadError')}
        </Alert>
      )}

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table
            columns={[
              {
                key: 'id',
                header: t('orders.table.id'),
                render: (order) => `#${order.id}`,
              },
              {
                key: 'user',
                header: t('orders.table.user'),
                render: (order) =>
                  order.user?.name ?? t('orders.table.userFallback', { id: order.user_id }),
              },
              {
                key: 'type',
                header: t('orders.table.type'),
                render: (order) =>
                  t(getOrderTypeLabelKey(order.type)),
              },
              {
                key: 'status',
                header: t('orders.table.status'),
                render: (order) =>
                  t(getOrderStatusLabelKey(order.status)),
              },
              {
                key: 'total_price',
                header: t('orders.table.amount'),
                render: (order) =>
                  formatPrice(order.total_price, locale),
              },
              {
                key: 'created_at',
                header: t('orders.table.date'),
                render: (order) =>
                  formatDate(order.created_at, locale),
              },
              {
                key: 'actions',
                header: (
                  <span className="block text-center">
                    {t('orders.table.actions')}
                  </span>
                ),
                className: 'w-24 text-center',
                render: (order) => (
                  <div className="flex justify-center">
                    <IconButton
                      type="button"
                      onClick={() =>
                        navigate(`/admin/orders/${order.id}`)
                      }
                      title={t('common.view')}
                      aria-label={`${t('common.view')} order #${order.id}`}
                    >
                      <Eye className="size-4" />
                    </IconButton>
                  </div>
                ),
              },
            ]}
            data={data?.data ?? []}
            getRowKey={(order) => order.id}
            emptyMessage={t('orders.table.empty')}
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
