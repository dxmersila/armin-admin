import type { FormEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import TagInput from '../ui/TagInput'
import type { ItemCategory } from '../../types/item'

export interface ItemFormValues {
  title: string
  slug: string
  description: string
  content: string
  is_visible: boolean
  access_type: 'free' | 'paid'
  price: string
  categories: number[]
  tags: string[]
}

interface ItemFormProps {
  values: ItemFormValues
  categories: ItemCategory[]
  isSubmitting?: boolean
  submitLabel: string
  onChange: <K extends keyof ItemFormValues>(
    field: K,
    value: ItemFormValues[K],
  ) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  mediaSection?: ReactNode
}

export default function ItemForm({
  values,
  categories,
  isSubmitting = false,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
  mediaSection,
}: ItemFormProps) {
  const { t } = useTranslation()

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="space-y-5 p-4 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t('items.form.mainInfo')}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {t('items.form.mainInfoDescription')}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            id="item-title"
            label={t('items.form.title')}
            value={values.title}
            onChange={(event) =>
              onChange('title', event.target.value)
            }
            required
          />

          <Input
            id="item-slug"
            label={t('items.form.slug')}
            value={values.slug}
            hint={t('items.form.slugHint')}
            onChange={(event) =>
              onChange('slug', event.target.value)
            }
          />
        </div>

        <Textarea
          id="item-description"
          label={t('items.form.description')}
          value={values.description}
          onChange={(event) =>
            onChange('description', event.target.value)
          }
        />

        <Textarea
          id="item-content"
          label={t('items.form.content')}
          value={values.content}
          rows={8}
          onChange={(event) =>
            onChange('content', event.target.value)
          }
        />
      </Card>

      <Card className="space-y-5 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">
          {t('items.form.accessSettings')}
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Select
            id="item-access-type"
            label={t('items.form.accessType')}
            value={values.access_type}
            onChange={(event) =>
              onChange(
                'access_type',
                event.target.value as 'free' | 'paid',
              )
            }
          >
            <option value="free">{t('items.form.free')}</option>
            <option value="paid">{t('items.form.paid')}</option>
          </Select>

          <Input
            id="item-price"
            type="number"
            min={0}
            step={1}
            label={t('items.form.price')}
            value={values.price}
            disabled={values.access_type === 'free'}
            hint={
              values.access_type === 'free'
                ? t('items.form.freePriceHint')
                : t('items.form.paidPriceHint')
            }
            onChange={(event) =>
              onChange('price', event.target.value)
            }
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={values.is_visible}
            onChange={(event) =>
              onChange('is_visible', event.target.checked)
            }
            className="size-4 rounded border-input accent-primary"
          />

          <span className="text-sm font-medium text-foreground">
            {t('items.form.visible')}
          </span>
        </label>
      </Card>

      <Card className="space-y-5 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">
          {t('items.form.categoriesAndTags')}
        </h2>

        <Select
          id="item-categories"
          label={t('items.form.categories')}
          multiple
          value={values.categories.map(String)}
          onChange={(event) => {
            const ids = Array.from(
              event.target.selectedOptions,
              (option) => Number(option.value),
            )

            onChange('categories', ids)
          }}
          className="min-h-36"
        >
          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </Select>

        <TagInput
          value={values.tags}
          onChange={(tags) => onChange('tags', tags)}
        />
      </Card>

      {mediaSection}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t('items.form.cancel')}
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
