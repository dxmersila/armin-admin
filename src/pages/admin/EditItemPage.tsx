import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Pencil } from 'lucide-react'
import BackButton from '../../components/ui/BackButton'
import { useNavigate, useParams } from 'react-router'
import ItemForm, {
  type ItemFormValues,
} from '../../components/items/ItemForm'
import MediaManager from '../../components/items/MediaManager'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/feedback/Spinner'
import { toast } from '../../components/ui/feedback/toast'
import { useAsync } from '../../hooks/useAsync'
import { getAllCategories } from '../../services/categoryService'
import { getAdminItem, updateAdminItem } from '../../services/itemService'
import { setAdminMediaPrimary } from '../../services/mediaService'
import type { AdminItem, ItemCategory } from '../../types/item'

function mapItemToFormValues(item: AdminItem): ItemFormValues {
  return {
    title: item.title,
    slug: item.slug,
    description: item.description ?? '',
    content: item.content ?? '',
    is_visible: item.is_visible,
    access_type: item.access_type,
    price: String(item.price ?? 0),
    categories: item.categories.map((category) => category.id),
    tags: item.tags.map((tag) => tag.name),
  }
}

interface EditItemFormProps {
  item: AdminItem
  categories: ItemCategory[]
}

function EditItemForm({
  item,
  categories,
}: EditItemFormProps) {
  const navigate = useNavigate()

  const [values, setValues] = useState<ItemFormValues>(() =>
    mapItemToFormValues(item),
  )

  const [currentMedia, setCurrentMedia] =
    useState<AdminItem['media']>(item.media)

  const [pendingPrimaryMediaId, setPendingPrimaryMediaId] =
    useState<number | null>(
      () => item.media.find((media) => media.is_primary)?.id ?? null,
    )

  const {
    isLoading: isSaving,
    execute: executeSave,
  } = useAsync<AdminItem>()

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

    const result = await executeSave(async () => {
      const updatedItem = await updateAdminItem(item.id, {
        title: values.title,
        slug: values.slug || undefined,
        description: values.description || null,
        content: values.content || null,
        is_visible: values.is_visible,
        access_type: values.access_type,
        price,
        categories: values.categories,
        tags: values.tags,
      })

      const originalPrimaryMediaId =
        item.media.find((media) => media.is_primary)?.id ?? null

      if (
        pendingPrimaryMediaId !== null &&
        pendingPrimaryMediaId !== originalPrimaryMediaId &&
        currentMedia.some(
          (media) => media.id === pendingPrimaryMediaId,
        )
      ) {
        await setAdminMediaPrimary(
          item.id,
          pendingPrimaryMediaId,
        )
      }

      return updatedItem
    })

    if (result) {
      await toast.success('آیتم با موفقیت بروزرسانی شد.')
      navigate(`/admin/items/${result.id}`)
    }
  }

  return (
    <ItemForm
      values={values}
      categories={categories}
      isSubmitting={isSaving}
      submitLabel="ذخیره تغییرات"
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/admin/items/${item.id}`)}
      mediaSection={
        <MediaManager
          itemId={item.id}
          media={currentMedia}
          deferPrimaryChange
          onMediaChange={setCurrentMedia}
          onPrimaryChange={setPendingPrimaryMediaId}
        />
      }
    />
  )
}

export default function EditItemPage() {
  const { id } = useParams()

  const {
    data: item,
    error: itemError,
    isLoading: isItemLoading,
    execute: executeItem,
  } = useAsync<AdminItem>()

  const {
    data: categories,
    error: categoriesError,
    isLoading: areCategoriesLoading,
    execute: executeCategories,
  } = useAsync<ItemCategory[]>()

  const loadData = useCallback(async () => {
    if (!id) {
      return
    }

    const numericId = Number(id)

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return
    }

    await Promise.all([
      executeItem(() => getAdminItem(numericId)),
      executeCategories(getAllCategories),
    ])
  }, [id, executeItem, executeCategories])

  useEffect(() => {
    void loadData()
  }, [loadData])

  if (
    !id ||
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0
  ) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Pencil className="size-6 shrink-0" />
            <span>ویرایش محصول</span>
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            شناسه آیتم نامعتبر است.
          </p>
        </div>

        <BackButton to="/admin/items">
          بازگشت به محصولات
        </BackButton>
      </div>
    )
  }

  if (isItemLoading || areCategoriesLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (
    itemError ||
    categoriesError ||
    !item ||
    !categories
  ) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Pencil className="size-6 shrink-0" />
            <span>ویرایش محصول</span>
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            دریافت اطلاعات آیتم انجام نشد.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => void loadData()}
        >
          تلاش مجدد
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Pencil className="size-6 shrink-0" />
            <span>ویرایش محصول</span>
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            اطلاعات محصول و رسانه‌های آن را ویرایش کنید.
          </p>
        </div>

        <BackButton to="/admin/items">
          بازگشت به محصولات
        </BackButton>
      </div>

      <EditItemForm
        key={item.id}
        item={item}
        categories={categories}
      />
    </div>
  )
}
