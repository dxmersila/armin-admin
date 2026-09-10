import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="space-y-5 p-4 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t('categories.form.title')}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {t('categories.form.description')}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            id="category-name"
            label={t('categories.form.name')}
            value={values.name}
            onChange={(event) =>
              onChange('name', event.target.value)
            }
            required
          />

          <Input
            id="category-slug"
            label={t('categories.form.slug')}
            value={values.slug}
            hint={t('categories.form.slugHint')}
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
          {t('categories.form.cancel')}
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
