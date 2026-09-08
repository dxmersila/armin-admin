import { useCallback, useEffect } from 'react'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { Link, useParams } from 'react-router'
import BackButton from '../../components/ui/BackButton'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/feedback/Spinner'
import { useAsync } from '../../hooks/useAsync'
import { getAdminOrder } from '../../services/orderService'
import type { AdminOrder } from '../../types/order'
import { formatDateTime, formatPrice } from '../../utils/format'
import {
  getOrderStatusLabel,
  getOrderTypeLabel,
  getPaymentStatusLabel,
} from '../../utils/orderLabels'

export default function OrderDetailPage() {
  const { id } = useParams()

  const {
    data: order,
    error,
    isLoading,
    execute,
  } = useAsync<AdminOrder>()

  const loadOrder = useCallback(() => {
    if (!id) {
      return Promise.resolve(undefined)
    }

    const orderId = Number(id)

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return Promise.resolve(undefined)
    }

    return execute(() => getAdminOrder(orderId))
  }, [execute, id])

  useEffect(() => {
    void loadOrder()
  }, [loadOrder])

  if (
    !id ||
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0
  ) {
    return (
      <section className="space-y-4">
        <PageHeader
          icon={ShoppingCart}
          title="جزئیات سفارش"
          description="شناسه سفارش نامعتبر است."
        />

        <BackButton to="/admin/orders">
          بازگشت به سفارش‌ها
        </BackButton>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="flex min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </section>
    )
  }

  if (error !== null || !order) {
    return (
      <section className="space-y-4">
        <PageHeader
          icon={ShoppingCart}
          title="جزئیات سفارش"
          description="دریافت اطلاعات سفارش انجام نشد."
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void loadOrder()}
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          >
            تلاش مجدد
          </button>

          <BackButton to="/admin/orders">
            بازگشت به سفارش‌ها
          </BackButton>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <PageHeader
        icon={ShoppingCart}
        title={`سفارش #${order.id}`}
        description="جزئیات کامل سفارش و پرداخت."
        actions={
          <BackButton to="/admin/orders">
            بازگشت به سفارش‌ها
          </BackButton>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5 p-4 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              اطلاعات سفارش
            </h2>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">
                شناسه
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                #{order.id}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">
                نوع
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                {getOrderTypeLabel(order.type)}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">
                وضعیت
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                {getOrderStatusLabel(order.status)}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">
                مبلغ کل
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                {formatPrice(order.total_price)}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">
                تاریخ ایجاد
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                {formatDateTime(order.created_at)}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">
                آخرین بروزرسانی
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                {formatDateTime(order.updated_at)}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="space-y-5 p-4 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              کاربر
            </h2>
          </div>

          {order.user ? (
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">
                  نام
                </dt>
                <dd className="mt-1 font-medium text-foreground">
                  {order.user.name}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-muted-foreground">
                  ایمیل
                </dt>
                <dd className="mt-1 break-all font-medium text-foreground">
                  {order.user.email}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              اطلاعات کاربر در دسترس نیست.
            </p>
          )}
        </Card>
      </div>

      {order.items && order.items.length > 0 && (
        <Card className="space-y-5 p-4 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              آیتم‌های سفارش
            </h2>
          </div>

          <div className="space-y-3">
            {order.items.map((orderItem) => (
              <div
                key={orderItem.id}
                className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {orderItem.item.title}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {orderItem.item.slug}
                  </p>
                </div>

                <div className="shrink-0 font-medium text-foreground">
                  {formatPrice(orderItem.price)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {order.subscription_plan && (
        <Card className="space-y-5 p-4 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              پلن اشتراک
            </h2>
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-muted-foreground">
                نام
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                {order.subscription_plan.name}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">
                مدت
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                {order.subscription_plan.duration_months} ماه
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">
                قیمت
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                {formatPrice(order.subscription_plan.price)}
              </dd>
            </div>
          </dl>
        </Card>
      )}

      {order.payments && order.payments.length > 0 && (
        <Card className="space-y-5 p-4 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              پرداخت‌ها
            </h2>
          </div>

          <div className="space-y-3">
            {order.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col gap-2 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">
                    پرداخت #{payment.id}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDateTime(payment.created_at)}
                  </p>
                </div>

                <div className="text-sm">
                  <span className="font-medium text-foreground">
                    {formatPrice(payment.amount)}
                  </span>

                  <span className="mx-2 text-muted-foreground">
                    •
                  </span>

                  <span className="text-muted-foreground">
                    {getPaymentStatusLabel(payment.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-start">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowRight className="size-4" />
          بازگشت به لیست سفارش‌ها
        </Link>
      </div>
    </section>
  )
}
