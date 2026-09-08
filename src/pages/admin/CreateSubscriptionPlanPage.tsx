import { useState } from 'react'
import type { FormEvent } from 'react'
import { BadgeCheck } from 'lucide-react'
import { useNavigate } from 'react-router'
import Alert from '../../components/ui/feedback/Alert'
import BackButton from '../../components/ui/BackButton'
import PageHeader from '../../components/ui/PageHeader'
import SubscriptionPlanForm from '../../components/subscriptionPlans/SubscriptionPlanForm'
import type { SubscriptionPlanFormValues } from '../../types/subscriptionPlan'
import { toast } from '../../components/ui/feedback/toast'
import { useAsync } from '../../hooks/useAsync'
import { createAdminSubscriptionPlan } from '../../services/subscriptionPlanService'

const initialValues: SubscriptionPlanFormValues = {
  name: '',
  duration_months: '',
  price: '',
  is_active: false,
}

export default function CreateSubscriptionPlanPage() {
  const navigate = useNavigate()

  const [values, setValues] =
    useState<SubscriptionPlanFormValues>(initialValues)

  const {
    error: submitError,
    isLoading: isSubmitting,
    execute: executeSubmit,
  } = useAsync()

  function handleChange<
    K extends keyof SubscriptionPlanFormValues,
  >(
    field: K,
    value: SubscriptionPlanFormValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    await executeSubmit(async () => {
      const plan =
        await createAdminSubscriptionPlan({
          name: values.name.trim(),
          duration_months: values.duration_months,
          price: values.price,
          is_active: values.is_active,
        })

      await toast.success(
        'اشتراک با موفقیت ایجاد شد.',
      )

      navigate(
        `/admin/subscription-plans/${plan.id}`,
        { replace: true },
      )

      return plan
    })
  }

  return (
    <section className="space-y-6">
      <PageHeader
        icon={BadgeCheck}
        title="ایجاد اشتراک"
        description="اطلاعات اشتراک جدید را وارد کنید."
        actions={
          <BackButton to="/admin/subscription-plans">
            بازگشت به اشتراک‌ها
          </BackButton>
        }
      />

      {submitError !== null && (
        <Alert variant="error">
          ایجاد اشتراک انجام نشد. اطلاعات واردشده را بررسی کنید.
        </Alert>
      )}

      <SubscriptionPlanForm
        values={values}
        isSubmitting={isSubmitting}
        submitLabel="ایجاد اشتراک"
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() =>
          navigate('/admin/subscription-plans')
        }
      />
    </section>
  )
}
