import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Pencil } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import Alert from '../../components/ui/feedback/Alert'
import BackButton from '../../components/ui/BackButton'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/feedback/Spinner'
import CategoryForm, {
  type CategoryFormValues,
} from '../../components/categories/CategoryForm'
import { toast } from '../../components/ui/feedback/toast'
import { useAsync } from '../../hooks/useAsync'
import {
  getAdminCategory,
  updateAdminCategory,
} from '../../services/categoryService'
import type { AdminCategory } from '../../types/category'

function mapCategoryToFormValues(
  category: AdminCategory,
): CategoryFormValues {
  return {
    name: category.name,
    slug: category.slug,
  }
}

export default function EditCategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [values, setValues] =
    useState<CategoryFormValues | null>(null)

  const {
    data: category,
    error: loadError,
    isLoading: isLoadingCategory,
    execute: executeLoad,
  } = useAsync<AdminCategory>()

  const {
    error: submitError,
    isLoading: isSubmitting,
    execute: executeSubmit,
  } = useAsync<AdminCategory>()

  const loadCategory = useCallback(() => {
    if (!id) {
      return Promise.resolve(undefined)
    }

    const categoryId = Number(id)

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return Promise.resolve(undefined)
    }

    return executeLoad(() => getAdminCategory(categoryId))
  }, [executeLoad, id])

  useEffect(() => {
    void loadCategory()
  }, [loadCategory])

  const formValues =
    values ?? (category ? mapCategoryToFormValues(category) : null)

  function handleChange<K extends keyof CategoryFormValues>(
    field: K,
    value: CategoryFormValues[K],
  ) {
    setValues((current) => ({
      ...(current ??
        (category
          ? mapCategoryToFormValues(category)
          : { name: '', slug: '' })),
      [field]: value,
    }))
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!category || !formValues) {
      return
    }

    const result = await executeSubmit(() =>
      updateAdminCategory(category.id, {
        name: formValues.name.trim(),
        slug: formValues.slug.trim() || undefined,
      }),
    )

    if (result) {
      await toast.success(
        'دسته‌بندی با موفقیت بروزرسانی شد.',
      )

      navigate(`/admin/categories/${result.id}`)
    }
  }

  if (
    !id ||
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0
  ) {
    return (
      <section className="space-y-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Pencil className="size-6 shrink-0" />
            <span>ویرایش دسته‌بندی</span>
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            شناسه دسته‌بندی نامعتبر است.
          </p>
        </div>

        <BackButton to="/admin/categories">
          بازگشت به دسته‌بندی‌ها
        </BackButton>
      </section>
    )
  }

  if (isLoadingCategory) {
    return (
      <section className="flex min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </section>
    )
  }

  if (loadError || !category || !formValues) {
    return (
      <section className="space-y-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Pencil className="size-6 shrink-0" />
            <span>ویرایش دسته‌بندی</span>
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            دریافت اطلاعات دسته‌بندی انجام نشد.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => void loadCategory()}
          >
            تلاش مجدد
          </Button>

          <BackButton to="/admin/categories">
            بازگشت
          </BackButton>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Pencil className="size-6 shrink-0" />
            <span>ویرایش دسته‌بندی</span>
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            اطلاعات دسته‌بندی را ویرایش کنید.
          </p>
        </div>

        <BackButton to="/admin/categories">
          بازگشت به دسته‌بندی‌ها
        </BackButton>
      </div>

      {submitError !== null && (
        <Alert variant="error">
          بروزرسانی دسته‌بندی انجام نشد. اطلاعات واردشده را بررسی کنید.
        </Alert>
      )}

      <CategoryForm
        values={formValues}
        isSubmitting={isSubmitting}
        submitLabel="ذخیره تغییرات"
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() =>
          navigate(`/admin/categories/${category.id}`)
        }
      />
    </section>
  )
}
