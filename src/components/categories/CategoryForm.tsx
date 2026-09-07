import type { FormEvent } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'

export interface CategoryFormValues {
  name: string
  slug: string
}

interface CategoryFormProps {
  values: CategoryFormValues
  isSubmitting?: boolean
  submitLabel: string
  onChange: <K extends keyof CategoryFormValues>(
    field: K,
    value: CategoryFormValues[K],
  ) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export default function CategoryForm({
  values,
  isSubmitting = false,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="space-y-5 p-4 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            اطلاعات دسته‌بندی
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            نام و Slug دسته‌بندی را وارد کنید.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            id="category-name"
            label="نام"
            value={values.name}
            onChange={(event) =>
              onChange('name', event.target.value)
            }
            required
          />

          <Input
            id="category-slug"
            label="Slug"
            value={values.slug}
            hint="در صورت خالی بودن، backend آن را از نام می‌سازد."
            onChange={(event) =>
              onChange('slug', event.target.value)
            }
          />
        </div>
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
