import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Pencil } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import Alert from '../../components/ui/feedback/Alert'
import BackButton from '../../components/ui/BackButton'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/feedback/Spinner'
import SubscriptionPlanForm from '../../components/subscriptionPlans/SubscriptionPlanForm'
import type { SubscriptionPlanFormValues } from '../../types/subscriptionPlan'
import { toast } from '../../components/ui/feedback/toast'
import { useAsync } from '../../hooks/useAsync'
import {
  getAdminSubscriptionPlan,
  updateAdminSubscriptionPlan,
} from '../../services/subscriptionPlanService'
import type { AdminSubscriptionPlan } from '../../types/subscriptionPlan'

function mapPlanToFormValues(
  plan: AdminSubscriptionPlan,
): SubscriptionPlanFormValues {
  return {
    name: plan.name,
    duration_months: String(plan.duration_months),
    price: String(plan.price),
    is_active: plan.is_active,
  }
}

export default function EditSubscriptionPlanPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [values, setValues] =
    useState<SubscriptionPlanFormValues | null>(null)

  const {
    data: plan,
    error: loadError,
    isLoading: isLoadingPlan,
    execute: executeLoad,
  } = useAsync<AdminSubscriptionPlan>()

  const {
    error: submitError,
    isLoading: isSubmitting,
    execute: executeSubmit,
  } = useAsync<AdminSubscriptionPlan>()

  const loadPlan = useCallback(() => {
    if (!id) {
      return Promise.resolve(undefined)
    }

    const planId = Number(id)

    if (!Number.isInteger(planId) || planId <= 0) {
      return Promise.resolve(undefined)
    }

    return executeLoad(() =>
      getAdminSubscriptionPlan(planId),
    )
  }, [executeLoad, id])

  useEffect(() => {
    void loadPlan()
  }, [loadPlan])

  const formValues =
    values ?? (plan ? mapPlanToFormValues(plan) : null)

  function handleChange<
    K extends keyof SubscriptionPlanFormValues,
  >(
    field: K,
    value: SubscriptionPlanFormValues[K],
  ) {
    setValues((current) => ({
      ...(current ??
        (plan
          ? mapPlanToFormValues(plan)
          : {
              name: '',
              duration_months: '',
              price: '',
              is_active: false,
            })),
      [field]: value,
    }))
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!plan || !formValues) {
      return
    }

    const result = await executeSubmit(() =>
      updateAdminSubscriptionPlan(plan.id, {
        name: formValues.name.trim(),
        duration_months: formValues.duration_months,
        price: formValues.price,
        is_active: formValues.is_active,
      }),
    )

    if (result) {
      await toast.success(
        'اشتراک با موفقیت بروزرسانی شد.',
      )

      navigate(`/admin/subscription-plans/${result.id}`)
    }
  }

  if (
    !id ||
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0
  ) {
    return (
      <section className="space-y-4">
        <PageHeader
          icon={Pencil}
          title="ویرایش اشتراک"
          description="شناسه اشتراک نامعتبر است."
        />

        <BackButton to="/admin/subscription-plans">
          بازگشت به اشتراک‌ها
        </BackButton>
      </section>
    )
  }

  if (isLoadingPlan) {
    return (
      <section className="flex min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </section>
    )
  }

  if (loadError || !plan || !formValues) {
    return (
      <section className="space-y-4">
        <PageHeader
          icon={Pencil}
          title="ویرایش اشتراک"
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
        icon={Pencil}
        title="ویرایش اشتراک"
        description="اطلاعات اشتراک را ویرایش کنید."
        actions={
          <BackButton
            to={`/admin/subscription-plans/${plan.id}`}
          >
            بازگشت به اشتراک
          </BackButton>
        }
      />

      {submitError !== null && (
        <Alert variant="error">
          بروزرسانی اشتراک انجام نشد. اطلاعات واردشده را بررسی کنید.
        </Alert>
      )}

      <SubscriptionPlanForm
        values={formValues}
        isSubmitting={isSubmitting}
        submitLabel="ذخیره تغییرات"
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() =>
          navigate(`/admin/subscription-plans/${plan.id}`)
        }
      />
    </section>
  )
}
