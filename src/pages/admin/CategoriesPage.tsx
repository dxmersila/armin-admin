import { useCallback, useEffect, useState } from 'react'
import {
  Eye,
  FolderTree,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import Alert from '../../components/ui/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Pagination from '../../components/ui/Pagination'
import Table, {
  type TableColumn,
} from '../../components/ui/Table'
import { confirm } from '../../components/ui/feedback/confirm'
import { toast } from '../../components/ui/feedback/toast'
import { useAsync } from '../../hooks/useAsync'
import {
  deleteAdminCategory,
  getAdminCategories,
} from '../../services/categoryService'
import type { AdminCategory } from '../../types/category'
import type { PaginatedResponse } from '../../types/item'

interface CategoryActionsProps {
  category: AdminCategory
  onDelete: (category: AdminCategory) => void
}

function CategoryActions({
  category,
  onDelete,
}: CategoryActionsProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => navigate(`/admin/categories/${category.id}`)}
        title="مشاهده"
        aria-label={`مشاهده ${category.name}`}
        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Eye className="size-4" />
      </button>

      <button
        type="button"
        onClick={() =>
          navigate(`/admin/categories/${category.id}/edit`)
        }
        title="ویرایش"
        aria-label={`ویرایش ${category.name}`}
        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Pencil className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => onDelete(category)}
        title="حذف"
        aria-label={`حذف ${category.name}`}
        className="inline-flex size-8 items-center justify-center rounded-md text-danger transition hover:bg-danger/10 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

interface CategoriesTableProps {
  categories: AdminCategory[]
  onDelete: (category: AdminCategory) => void
}

function CategoriesTable({
  categories,
  onDelete,
}: CategoriesTableProps) {
  const columns: TableColumn<AdminCategory>[] = [
    {
      key: 'name',
      header: 'نام',
      className: 'w-56 max-w-56',
      render: (category) => (
        <div className="w-56 max-w-full">
          <p
            className="truncate font-medium"
            title={category.name}
          >
            {category.name}
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: (
        <span className="block text-center">
          عملیات
        </span>
      ),
      className: 'w-32 text-center',
      render: (category) => (
        <CategoryActions
          category={category}
          onDelete={onDelete}
        />
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={categories}
      getRowKey={(category) => category.id}
      emptyMessage="دسته‌بندی‌ای برای نمایش وجود ندارد."
    />
  )
}

export default function CategoriesPage() {
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [deletingCategoryId, setDeletingCategoryId] =
    useState<number | null>(null)

  const {
    data,
    error,
    isLoading,
    execute,
  } = useAsync<PaginatedResponse<AdminCategory>>()

  const loadCategories = useCallback(
    (page = currentPage) =>
      execute(() => getAdminCategories(page)),
    [currentPage, execute],
  )

  useEffect(() => {
    void loadCategories(currentPage)
  }, [currentPage, loadCategories])

  async function handleDelete(category: AdminCategory) {
    const accepted = await confirm({
      title: `حذف «${category.name}»؟`,
      text: 'این عملیات قابل بازگشت نیست.',
      confirmText: 'حذف',
      cancelText: 'لغو',
      danger: true,
    })

    if (!accepted) {
      return
    }

    setDeletingCategoryId(category.id)

    try {
      await deleteAdminCategory(category.id)
      await toast.success('دسته‌بندی با موفقیت حذف شد.')

      const isLastCategoryOnPage =
        data?.data.length === 1 && currentPage > 1

      if (isLastCategoryOnPage) {
        setCurrentPage((page) => page - 1)
        return
      }

      await loadCategories(currentPage)
    } catch {
      await toast.error('حذف دسته‌بندی انجام نشد.')
    } finally {
      setDeletingCategoryId(null)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <FolderTree className="size-6 shrink-0" />
            <span>دسته‌بندی‌ها</span>
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            مدیریت دسته‌بندی‌ها
          </p>
        </div>

        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate('/admin/categories/create')}
        >
          <Plus className="size-4" />
          افزودن دسته‌بندی
        </Button>
      </div>

      <Card className="p-3 sm:p-4 md:p-6">
        {error !== null && (
          <div className="mb-6">
            <Alert variant="error">
              خطا در دریافت یا حذف دسته‌بندی.
            </Alert>

            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={() => void loadCategories(currentPage)}
              >
                تلاش مجدد
              </Button>
            </div>
          </div>
        )}

        {deletingCategoryId !== null ? (
          <div className="mb-4 text-sm text-muted-foreground">
            در حال حذف دسته‌بندی...
          </div>
        ) : null}

        {isLoading ? (
          <Table
            columns={[]}
            data={[]}
            getRowKey={() => 'loading'}
            loading
          />
        ) : (
          <CategoriesTable
            categories={data?.data ?? []}
            onDelete={(category) => {
              void handleDelete(category)
            }}
          />
        )}

        {data && (
          <div className="mt-6 overflow-x-auto border-t border-border pt-4">
            <Pagination
              currentPage={data.meta.current_page}
              lastPage={data.meta.last_page}
              onPageChange={setCurrentPage}
              disabled={
                isLoading || deletingCategoryId !== null
              }
            />
          </div>
        )}
      </Card>
    </section>
  )
}
