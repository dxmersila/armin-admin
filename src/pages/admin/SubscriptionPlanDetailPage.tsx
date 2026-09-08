import { Pencil, BadgeCheck } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { useCallback, useEffect } from 'react'
import BackButton from '../../components/ui/BackButton'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/feedback/Spinner'
import { useAsync } from '../../hooks/useAsync'
import { getAdminSubscriptionPlan } from '../../services/subscriptionPlanService'
import type { AdminSubscriptionPlan } from '../../types/subscriptionPlan'
import {
  formatDateTime,
  formatPrice,
} from '../../utils/format'

export default function SubscriptionPlanDetailPage() {
  const { id } = useParams()

  const {
    data: plan,
    error,
    isLoading,
    execute,
  } = useAsync<AdminSubscriptionPlan>()

  const loadPlan = useCallback(() => {
    if (!id) {
      return Promise.resolve(undefined)
    }

    const planId = Number(id)

    if (!Number.isInteger(planId) || planId <= 0) {
      return Promise.resolve(undefined)
    }

    return execute(() => getAdminSubscriptionPlan(planId))
  }, [execute, id])

  useEffect(() => {
    void loadPlan()
  }, [loadPlan])

  if (isLoading) {
    return (
      <section className="flex min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </section>
    )
  }

  if (
    !id ||
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0
  ) {
    return (
      <section className="space-y-4">
        <PageHeader
          icon={BadgeCheck}
          title="جزئیات اشتراک"
          description="شناسه اشتراک نامعتبر است."
        />

        <BackButton to="/admin/subscription-plans">
          بازگشت به اشتراک‌ها
        </BackButton>
      </section>
    )
  }

  if (error !== null || !plan) {
    return (
      <section className="space-y-4">
        <PageHeader
          icon={BadgeCheck}
          title="جزئیات اشتراک"
          description="دریافت اطلاعات اشتراک انجام نشد."
        />

        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => void loadPlan()}
          >
            تلاش مجدد
          </Button>

          <BackButton to="/admin/subscription-plans">
            بازگشت
          </BackButton>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <PageHeader
        icon={BadgeCheck}
        title={plan.name}
        description={`اشتراک #${plan.id}`}
        actions={
          <>
            <BackButton to="/admin/subscription-plans">
              بازگشت به اشتراک‌ها
            </BackButton>

            <Link
              to={`/admin/subscription-plans/${plan.id}/edit`}
            >
              <Button
                variant="secondary"
                size="sm"
                aria-label={`ویرایش ${plan.name}`}
              >
                <Pencil className="size-4" />
                ویرایش
              </Button>
            </Link>
          </>
        }
      />

      <Card className="p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <BadgeCheck className="size-5 text-muted-foreground" />

          <h2 className="font-semibold text-foreground">
            اطلاعات اشتراک
          </h2>
        </div>

        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">
              نام
            </dt>

            <dd className="mt-1 font-medium text-foreground">
              {plan.name}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              وضعیت
            </dt>

            <dd className="mt-2">
              {plan.is_active ? (
                <Badge variant="success">
                  فعال
                </Badge>
              ) : (
                <Badge variant="neutral">
                  غیرفعال
                </Badge>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              مدت
            </dt>

            <dd className="mt-1 font-medium text-foreground">
              {plan.duration_months} ماه
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              قیمت
            </dt>

            <dd className="mt-1 font-medium text-foreground">
              {formatPrice(plan.price)}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              تاریخ ایجاد
            </dt>

            <dd className="mt-1 font-medium text-foreground">
              {formatDateTime(plan.created_at)}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              آخرین بروزرسانی
            </dt>

            <dd className="mt-1 font-medium text-foreground">
              {formatDateTime(plan.updated_at)}
            </dd>
          </div>
        </dl>
      </Card>
    </section>
  )
}
