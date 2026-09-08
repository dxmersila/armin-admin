import { useCallback, useEffect, useState } from 'react'
import {
  Eye,
  Filter,
  FolderTree,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import Alert from '../../components/ui/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import FilterBar from '../../components/ui/FilterBar'
import Input from '../../components/ui/Input'
import Pagination from '../../components/ui/Pagination'
import Select from '../../components/ui/Select'
import Spinner from '../../components/ui/feedback/Spinner'
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

interface CategoryFilters {
  search: string
  sort: 'latest' | 'oldest' | 'name'
}

const emptyFilters: CategoryFilters = {
  search: '',
  sort: 'name',
}

const sortOptions: Array<{
  value: CategoryFilters['sort']
  label: string
}> = [
  { value: 'latest', label: 'جدیدترین' },
  { value: 'oldest', label: 'قدیمی‌ترین' },
  { value: 'name', label: 'نام' },
]

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
  const [filters, setFilters] =
    useState<CategoryFilters>(emptyFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<CategoryFilters>(emptyFilters)
  const [deletingCategoryId, setDeletingCategoryId] =
    useState<number | null>(null)

  const {
    data,
    error,
    isLoading,
    execute,
  } = useAsync<PaginatedResponse<AdminCategory>>()

  const loadCategories = useCallback(
    (page = currentPage, activeFilters = appliedFilters) =>
      execute(() =>
        getAdminCategories(page, {
          search: activeFilters.search.trim() || undefined,
          sort: activeFilters.sort,
        }),
      ),
    [currentPage, appliedFilters, execute],
  )

  useEffect(() => {
    void loadCategories(currentPage, appliedFilters)
  }, [currentPage, appliedFilters, loadCategories])

  function handleFilterChange<K extends keyof CategoryFilters>(
    field: K,
    value: CategoryFilters[K],
  ) {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleApplyFilters() {
    setCurrentPage(1)
    setAppliedFilters(filters)
  }

  function handleClearFilters() {
    setCurrentPage(1)
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
  }

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

      await loadCategories(currentPage, appliedFilters)
    } catch {
      await toast.error('حذف دسته‌بندی انجام نشد.')
    } finally {
      setDeletingCategoryId(null)
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        icon={FolderTree}
        title="دسته‌بندی‌ها"
        description="مدیریت دسته‌بندی‌ها"
        actions={
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate('/admin/categories/create')}
          >
            <Plus className="size-4" />
            افزودن دسته‌بندی
          </Button>
        }
      />

      <Card className="p-4 sm:p-6">
        <FilterBar>
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-muted-foreground" />

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                فیلترها
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                دسته‌بندی‌ها را بر اساس جستجو و ترتیب نمایش فیلتر کنید.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="category-search-filter"
              label="جستجو"
              placeholder="نام یا slug دسته‌بندی"
              value={filters.search}
              onChange={(event) =>
                handleFilterChange(
                  'search',
                  event.target.value,
                )
              }
            />

            <Select
              id="category-sort-filter"
              label="مرتب‌سازی"
              value={filters.sort}
              onChange={(event) =>
                handleFilterChange(
                  'sort',
                  event.target.value as CategoryFilters['sort'],
                )
              }
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClearFilters}
            >
              پاک کردن
            </Button>

            <Button
              type="button"
              onClick={handleApplyFilters}
            >
              اعمال فیلتر
            </Button>
          </div>
        </FilterBar>
      </Card>

      <Card className="overflow-hidden">
        {error !== null && (
          <div className="p-4 sm:p-6">
            <Alert variant="error">
              خطا در دریافت یا حذف دسته‌بندی.
            </Alert>

            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={() =>
                  void loadCategories(
                    currentPage,
                    appliedFilters,
                  )
                }
              >
                تلاش مجدد
              </Button>
            </div>
          </div>
        )}

        {deletingCategoryId !== null ? (
          <div className="border-b border-border px-4 py-3 text-sm text-muted-foreground sm:px-6">
            در حال حذف دسته‌بندی...
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <CategoriesTable
            categories={data?.data ?? []}
            onDelete={(category) => {
              void handleDelete(category)
            }}
          />
        )}

        {data && (
          <div className="border-t border-border px-4 py-4">
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
