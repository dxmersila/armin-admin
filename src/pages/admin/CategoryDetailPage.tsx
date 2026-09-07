import { useCallback, useEffect } from 'react'
import {
  FolderTree,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import Alert from '../../components/ui/feedback/Alert'
import BackButton from '../../components/ui/BackButton'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/feedback/Spinner'
import { confirm } from '../../components/ui/feedback/confirm'
import { toast } from '../../components/ui/feedback/toast'
import { useAsync } from '../../hooks/useAsync'
import {
  deleteAdminCategory,
  getAdminCategory,
} from '../../services/categoryService'
import type { AdminCategory } from '../../types/category'

export default function CategoryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    data: category,
    error,
    isLoading,
    execute,
  } = useAsync<AdminCategory>()

  const loadCategory = useCallback(() => {
    if (!id) {
      return Promise.resolve(undefined)
    }

    const categoryId = Number(id)

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return Promise.resolve(undefined)
    }

    return execute(() => getAdminCategory(categoryId))
  }, [execute, id])

  useEffect(() => {
    void loadCategory()
  }, [loadCategory])

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
          شناسه دسته‌بندی نامعتبر است.
        </Alert>

        <BackButton to="/admin/categories">
          بازگشت به دسته‌بندی‌ها
        </BackButton>
      </section>
    )
  }

  async function handleDelete() {
    const accepted = await confirm({
      title: `حذف «${category?.name ?? ''}»؟`,
      text: 'این عملیات قابل بازگشت نیست.',
      confirmText: 'حذف',
      cancelText: 'لغو',
      danger: true,
    })

    if (!accepted || !category) {
      return
    }

    try {
      await deleteAdminCategory(category.id)
      await toast.success(
        'دسته‌بندی با موفقیت حذف شد.',
      )
    } catch {
      await toast.error(
        'حذف دسته‌بندی انجام نشد.',
      )
      return
    }

    navigate('/admin/categories', {
      replace: true,
    })
  }

  if (error !== null || !category) {
    return (
      <section className="space-y-4">
        <Alert variant="error">
          خطا در دریافت اطلاعات دسته‌بندی.
        </Alert>

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
            <FolderTree className="size-6 shrink-0" />
            <span>{category.name}</span>
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {category.slug}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <BackButton to="/admin/categories">
            بازگشت به دسته‌بندی‌ها
          </BackButton>

          <div className="flex items-center gap-1">
            <Link
              to={`/admin/categories/${category.id}/edit`}
              title="ویرایش"
              aria-label={`ویرایش ${category.name}`}
            >
              <Button
                variant="secondary"
                size="sm"
                aria-label={`ویرایش ${category.name}`}
              >
                <Pencil className="size-4" />
              </Button>
            </Link>

            <Button
              variant="danger"
              size="sm"
              onClick={() => void handleDelete()}
              title="حذف"
              aria-label={`حذف ${category.name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <FolderTree className="size-5 text-muted-foreground" />

          <h2 className="font-semibold text-foreground">
            اطلاعات دسته‌بندی
          </h2>
        </div>

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">
              نام
            </dt>

            <dd className="mt-1 text-foreground">
              {category.name}
            </dd>
          </div>

          <div>
            <dt className="text-muted-foreground">
              Slug
            </dt>

            <dd className="mt-1 break-all text-foreground">
              {category.slug}
            </dd>
          </div>
        </dl>
      </Card>
    </section>
  )
}
