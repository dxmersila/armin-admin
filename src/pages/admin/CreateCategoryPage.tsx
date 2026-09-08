import { useState } from 'react'
import type { FormEvent } from 'react'
import { FolderPlus } from 'lucide-react'
import { useNavigate } from 'react-router'
import Alert from '../../components/ui/feedback/Alert'
import PageHeader from '../../components/ui/PageHeader'
import BackButton from '../../components/ui/BackButton'
import CategoryForm, {
  type CategoryFormValues,
} from '../../components/categories/CategoryForm'
import { toast } from '../../components/ui/feedback/toast'
import { useAsync } from '../../hooks/useAsync'
import { createAdminCategory } from '../../services/categoryService'

const initialValues: CategoryFormValues = {
  name: '',
  slug: '',
}

export default function CreateCategoryPage() {
  const navigate = useNavigate()

  const [values, setValues] =
    useState<CategoryFormValues>(initialValues)

  const {
    error: submitError,
    isLoading: isSubmitting,
    execute: executeSubmit,
  } = useAsync()

  function handleChange<K extends keyof CategoryFormValues>(
    field: K,
    value: CategoryFormValues[K],
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
      const category = await createAdminCategory({
        name: values.name.trim(),
        slug: values.slug.trim() || undefined,
      })

      await toast.success(
        'دسته‌بندی با موفقیت ایجاد شد.',
      )

      navigate(`/admin/categories/${category.id}`, {
        replace: true,
      })

      return category
    })
  }

  return (
    <section className="space-y-6">
      <PageHeader
        icon={FolderPlus}
        title="ایجاد دسته‌بندی"
        description="اطلاعات دسته‌بندی جدید را وارد کنید."
        actions={
          <BackButton to="/admin/categories">
            بازگشت به دسته‌بندی‌ها
          </BackButton>
        }
      />

      {submitError !== null && (
        <Alert variant="error">
          ایجاد دسته‌بندی انجام نشد. اطلاعات واردشده را بررسی کنید.
        </Alert>
      )}

      <CategoryForm
        values={values}
        isSubmitting={isSubmitting}
        submitLabel="ایجاد دسته‌بندی"
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/categories')}
      />
    </section>
  )
}
