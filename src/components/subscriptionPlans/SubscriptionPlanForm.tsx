import type { FormEvent } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import type { SubscriptionPlanFormValues } from '../../types/subscriptionPlan'

interface SubscriptionPlanFormProps {
  values: SubscriptionPlanFormValues
  isSubmitting?: boolean
  submitLabel: string
  onChange: <K extends keyof SubscriptionPlanFormValues>(
    field: K,
    value: SubscriptionPlanFormValues[K],
  ) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export default function SubscriptionPlanForm({
  values,
  isSubmitting = false,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: SubscriptionPlanFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="space-y-5 p-4 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            اطلاعات اشتراک
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            مشخصات اشتراک را وارد کنید.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            id="subscription-plan-name"
            label="نام اشتراک"
            value={values.name}
            onChange={(event) =>
              onChange('name', event.target.value)
            }
            required
          />

          <Input
            id="subscription-plan-duration"
            label="مدت اشتراک"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            hint="مدت را بر حسب ماه وارد کنید."
            value={values.duration_months}
            onChange={(event) =>
              onChange('duration_months', event.target.value)
            }
            required
          />

          <Input
            id="subscription-plan-price"
            label="قیمت"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            hint="قیمت را به تومان وارد کنید."
            value={values.price}
            onChange={(event) =>
              onChange('price', event.target.value)
            }
            required
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={values.is_active}
            onChange={(event) =>
              onChange('is_active', event.target.checked)
            }
            className="size-4 rounded border-input accent-primary"
          />

          <span className="text-sm font-medium text-foreground">
            اشتراک فعال باشد
          </span>
        </label>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          لغو
        </Button>

        <Button
          type="submit"
          loading={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
