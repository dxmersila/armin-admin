import { useCallback, useEffect, useState } from 'react'
import { Eye, Filter, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router'
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
  getOrderStatusLabel,
  getOrderTypeLabel,
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

const orderStatusOptions: Array<{
  value: OrderStatus
  label: string
}> = [
  { value: 'pending', label: 'در انتظار پرداخت' },
  { value: 'paid', label: 'پرداخت شده' },
  { value: 'failed', label: 'ناموفق' },
  { value: 'cancelled', label: 'لغو شده' },
]

const paymentStatusOptions: Array<{
  value: PaymentStatus
  label: string
}> = [
  { value: 'pending', label: 'در انتظار' },
  { value: 'paid', label: 'پرداخت شده' },
  { value: 'failed', label: 'ناموفق' },
]

export default function OrdersPage() {
  const navigate = useNavigate()

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
        title="سفارش‌ها"
        description="مدیریت و مشاهده سفارش‌های کاربران."
      />

      <Card className="p-4 sm:p-6">
        <FilterBar>
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-muted-foreground" />

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                فیلترها
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                سفارش‌ها را بر اساس وضعیت، کاربر و وضعیت پرداخت فیلتر کنید.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Select
              id="order-status-filter"
              label="وضعیت سفارش"
              value={filters.status}
              onChange={(event) =>
                handleFilterChange(
                  'status',
                  event.target.value as OrderStatus | '',
                )
              }
            >
              <option value="">همه وضعیت‌ها</option>

              {orderStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Input
              id="order-user-id-filter"
              label="شناسه کاربر"
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="مثلاً 12"
              value={filters.user_id}
              onChange={(event) =>
                handleFilterChange('user_id', event.target.value)
              }
            />

            <Select
              id="order-payment-status-filter"
              label="وضعیت پرداخت"
              value={filters.payment_status}
              onChange={(event) =>
                handleFilterChange(
                  'payment_status',
                  event.target.value as PaymentStatus | '',
                )
              }
            >
              <option value="">همه وضعیت‌های پرداخت</option>

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
              پاک کردن
            </Button>

            <Button
              type="button"
              onClick={handleApplyFilters}
            >
              اعمال فیلتر
            </Button>
          </div>
        </FilterBar>
      </Card>

      {error !== null && (
        <Alert variant="error">
          دریافت سفارش‌ها انجام نشد.
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
                header: 'شناسه',
                render: (order) => `#${order.id}`,
              },
              {
                key: 'user',
                header: 'کاربر',
                render: (order) =>
                  order.user?.name ?? `کاربر #${order.user_id}`,
              },
              {
                key: 'type',
                header: 'نوع',
                render: (order) =>
                  getOrderTypeLabel(order.type),
              },
              {
                key: 'status',
                header: 'وضعیت',
                render: (order) =>
                  getOrderStatusLabel(order.status),
              },
              {
                key: 'total_price',
                header: 'مبلغ',
                render: (order) =>
                  formatPrice(order.total_price),
              },
              {
                key: 'created_at',
                header: 'تاریخ',
                render: (order) =>
                  formatDate(order.created_at),
              },
              {
                key: 'actions',
                header: (
                  <span className="block text-center">
                    عملیات
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
                      title="مشاهده"
                      aria-label={`مشاهده سفارش #${order.id}`}
                    >
                      <Eye className="size-4" />
                    </IconButton>
                  </div>
                ),
              },
            ]}
            data={data?.data ?? []}
            getRowKey={(order) => order.id}
            emptyMessage="سفارشی برای نمایش وجود ندارد."
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
