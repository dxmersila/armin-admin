import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

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

      await toast.success(t('categories.create.success'))

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
        title={t('categories.create.title')}
        description={t('categories.create.description')}
        actions={
          <BackButton to="/admin/categories">
            {t('common.back')}
          </BackButton>
        }
      />

      {submitError !== null && (
        <Alert variant="error">
          {t('categories.create.submitError')}
        </Alert>
      )}

      <CategoryForm
        values={values}
        isSubmitting={isSubmitting}
        submitLabel={t('categories.create.submit')}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/categories')}
      />
    </section>
  )
}
