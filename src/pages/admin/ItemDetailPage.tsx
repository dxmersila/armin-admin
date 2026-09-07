import { useCallback, useEffect } from 'react'
import {
  Eye,
  EyeOff,
  FileText,
  Pencil,
  Tag,
  Trash2,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import Badge from '../../components/ui/Badge'
import BackButton from '../../components/ui/BackButton'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import MediaManager from '../../components/items/MediaManager'
import Alert from '../../components/ui/feedback/Alert'
import Spinner from '../../components/ui/feedback/Spinner'
import { confirm } from '../../components/ui/feedback/confirm'
import { toast } from '../../components/ui/feedback/toast'
import { useAsync } from '../../hooks/useAsync'
import {
  deleteAdminItem,
  getAdminItem,
} from '../../services/itemService'
import type { AdminItem } from '../../types/item'

function formatPrice(price: number | null): string {
  if (price === null) {
    return '—'
  }

  return `${price.toLocaleString('fa-IR')} تومان`
}

export default function ItemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    data: item,
    error,
    isLoading,
    execute,
  } = useAsync<AdminItem>()

  const loadItem = useCallback(() => {
    if (!id) {
      return Promise.resolve(undefined)
    }

    const itemId = Number(id)

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return Promise.resolve(undefined)
    }

    return execute(() => getAdminItem(itemId))
  }, [execute, id])

  useEffect(() => {
    void loadItem()
  }, [loadItem])

  if (isLoading) {
    return (
      <section className="flex min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </section>
    )
  }

  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
    return (
      <section className="space-y-4">
        <Alert variant="error">
          شناسه محصول نامعتبر است.
        </Alert>

        <BackButton to="/admin/items">
          بازگشت به محصولات
        </BackButton>
      </section>
    )
  }

  async function handleDelete() {
    const accepted = await confirm({
      title: `حذف «${item?.title ?? ''}»؟`,
      text: 'این عملیات قابل بازگشت نیست.',
      confirmText: 'حذف',
      cancelText: 'لغو',
      danger: true,
    })

    if (!accepted || !item) {
      return
    }

    try {
      await deleteAdminItem(item.id)
      await toast.success('محصول با موفقیت حذف شد.')
    } catch {
      await toast.error('حذف محصول انجام نشد.')
      return
    }

    navigate('/admin/items', {
      replace: true,
    })
  }

  if (error !== null || !item) {
    return (
      <section className="space-y-4">
        <Alert variant="error">
          خطا در دریافت اطلاعات محصول.
        </Alert>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => void loadItem()}
          >
            تلاش مجدد
          </Button>

          <BackButton to="/admin/items">
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
          <h1 className="text-2xl font-semibold text-foreground">
            {item.title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {item.slug}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <BackButton to="/admin/items">
            بازگشت به محصولات
          </BackButton>

          <div className="flex items-center gap-1">
            <Link
              to={`/admin/items/${item.id}/edit`}
              title="ویرایش"
              aria-label={`ویرایش ${item.title}`}
            >
              <Button
                variant="secondary"
                size="sm"
                aria-label={`ویرایش ${item.title}`}
              >
                <Pencil className="size-4" />
              </Button>
            </Link>

            <Button
              variant="danger"
              size="sm"
              onClick={() => void handleDelete()}
              title="حذف"
              aria-label={`حذف ${item.title}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="size-5 text-muted-foreground" />

            <h2 className="font-semibold text-foreground">
              اطلاعات اصلی
            </h2>
          </div>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">
                عنوان
              </dt>

              <dd className="mt-1 text-foreground">
                {item.title}
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground">
                Slug
              </dt>

              <dd className="mt-1 text-foreground">
                {item.slug}
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground">
                وضعیت نمایش
              </dt>

              <dd className="mt-2">
                {item.is_visible ? (
                  <Badge variant="success">
                    <Eye className="me-1 size-3.5" />
                    قابل نمایش
                  </Badge>
                ) : (
                  <Badge variant="neutral">
                    <EyeOff className="me-1 size-3.5" />
                    مخفی
                  </Badge>
                )}
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground">
                نوع دسترسی
              </dt>

              <dd className="mt-2">
                {item.access_type === 'paid' ? (
                  <Badge variant="warning">
                    پولی
                  </Badge>
                ) : (
                  <Badge variant="success">
                    رایگان
                  </Badge>
                )}
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground">
                قیمت
              </dt>

              <dd className="mt-1 text-foreground">
                {item.access_type === 'paid'
                  ? formatPrice(item.price)
                  : 'رایگان'}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Tag className="size-5 text-muted-foreground" />

            <h2 className="font-semibold text-foreground">
              دسته‌بندی و تگ‌ها
            </h2>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              دسته‌بندی‌ها
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {item.categories.length > 0 ? (
                item.categories.map((category) => (
                  <Badge key={category.id}>
                    {category.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  —
                </span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground">
              تگ‌ها
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {item.tags.length > 0 ? (
                item.tags.map((tag) => (
                  <Badge key={tag.id} variant="info">
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  —
                </span>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-foreground">
          توضیحات
        </h2>

        <div className="space-y-6 text-sm leading-7 text-foreground">
          <div>
            <p className="mb-2 text-muted-foreground">
              Description
            </p>

            <p className="whitespace-pre-wrap">
              {item.description || '—'}
            </p>
          </div>

          <div>
            <p className="mb-2 text-muted-foreground">
              Content
            </p>

            <p className="whitespace-pre-wrap">
              {item.content || '—'}
            </p>
          </div>
        </div>
      </Card>

      <MediaManager
        key={item.id}
        itemId={item.id}
        media={item.media}
      />

    </section>
  )
}
