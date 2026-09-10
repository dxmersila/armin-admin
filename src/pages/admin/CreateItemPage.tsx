import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { PackagePlus } from 'lucide-react'
import BackButton from '../../components/ui/BackButton'
import { useNavigate } from 'react-router'
import Alert from '../../components/ui/feedback/Alert'
import Spinner from '../../components/ui/feedback/Spinner'
import PageHeader from '../../components/ui/PageHeader'
import { toast } from '../../components/ui/feedback/toast'
import ItemForm, {
  type ItemFormValues,
} from '../../components/items/ItemForm'
import PendingMediaSelector, {
  type PendingMedia,
} from '../../components/items/PendingMediaSelector'
import { useAsync } from '../../hooks/useAsync'
import { getAllCategories } from '../../services/categoryService'
import { createAdminItem } from '../../services/itemService'
import { uploadAdminMedia } from '../../services/mediaService'
import type { ItemCategory } from '../../types/item'

const initialValues: ItemFormValues = {
  title: '',
  slug: '',
  description: '',
  content: '',
  is_visible: false,
  access_type: 'free',
  price: '',
  categories: [],
  tags: [],
}

export default function CreateItemPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [values, setValues] =
    useState<ItemFormValues>(initialValues)

  const [categories, setCategories] = useState<ItemCategory[]>([])
  const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>([])

  const {
    error: categoriesError,
    isLoading: isLoadingCategories,
    execute: executeCategories,
  } = useAsync<ItemCategory[]>()

  const {
    error: submitError,
    isLoading: isSubmitting,
    execute: executeSubmit,
  } = useAsync()

  const loadCategories = useCallback(() => {
    return executeCategories(getAllCategories)
  }, [executeCategories])

  useEffect(() => {
    void loadCategories().then((result) => {
      if (result) {
        setCategories(result)
      }
    })
  }, [loadCategories])

  function handleChange<K extends keyof ItemFormValues>(
    field: K,
    value: ItemFormValues[K],
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

    const price =
      values.access_type === 'paid' && values.price !== ''
        ? Number(values.price)
        : 0

    await executeSubmit(async () => {
      const item = await createAdminItem({
        title: values.title.trim(),
        slug: values.slug.trim() || undefined,
        description: values.description || null,
        content: values.content || null,
        is_visible: values.is_visible,
        access_type: values.access_type,
        price,
        categories: values.categories,
        tags: values.tags,
      })

      let failedMediaCount = 0

      for (const [index, media] of pendingMedia.entries()) {
        try {
          await uploadAdminMedia(item.id, {
            file: media.file,
            isPrimary: media.isPrimary,
            sortOrder: index,
          })
        } catch (error) {
          failedMediaCount += 1

          console.error(
            `Media upload failed for ${media.file.name}:`,
            error,
          )
        }
      }

      if (failedMediaCount > 0) {
        await toast.error(
          `${t('items.create.mediaUploadPartial', { count: failedMediaCount })}`,
        )
      } else {
        await toast.success(t('items.create.success'))
      }

      navigate(`/admin/items/${item.id}`, {
        replace: true,
      })

      return item
    })
  }

  if (isLoadingCategories) {
    return (
      <section className="space-y-6">
        <PageHeader
          icon={PackagePlus}
          title={t('items.create.title')}
          description={t('items.create.description')}
        />

        <div className="flex min-h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <PageHeader
        icon={PackagePlus}
        title={t('items.create.title')}
        description={t('items.create.description')}
        actions={
          <BackButton to="/admin/items">
            {t('items.create.back')}
          </BackButton>
        }
      />

      {categoriesError !== null && (
        <Alert variant="error">
          {t('items.create.categoriesError')}
        </Alert>
      )}

      {submitError !== null && (
        <Alert variant="error">
          {t('items.create.submitError')}
        </Alert>
      )}

      <ItemForm
        values={values}
        categories={categories}
        isSubmitting={isSubmitting}
        submitLabel={t('items.create.title')}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/items')}
        mediaSection={
          <PendingMediaSelector
            value={pendingMedia}
            onChange={setPendingMedia}
            disabled={isSubmitting}
          />
        }
      />
    </section>
  )
}
