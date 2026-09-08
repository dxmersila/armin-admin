import { useCallback, useEffect, useState } from 'react'
import {
  CircleDollarSign,
  Eye,
  EyeOffIcon,
  Filter,
  Gift,
  Package,
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
  deleteAdminItem,
  getAdminItems,
} from '../../services/itemService'
import { getAllCategories } from '../../services/categoryService'
import type {
  AdminItem,
  ItemCategory,
  PaginatedResponse,
} from '../../types/item'
import { formatPrice } from '../../utils/format'

interface ItemFilters {
  search: string
  is_visible: 'all' | 'visible' | 'hidden'
  access_type: 'all' | 'free' | 'paid'
  category_id: string
  sort: 'latest' | 'oldest' | 'title'
}

const emptyFilters: ItemFilters = {
  search: '',
  is_visible: 'all',
  access_type: 'all',
  category_id: '',
  sort: 'latest',
}

const sortOptions: Array<{
  value: ItemFilters['sort']
  label: string
}> = [
  { value: 'latest', label: 'جدیدترین' },
  { value: 'oldest', label: 'قدیمی‌ترین' },
  { value: 'title', label: 'عنوان' },
]

interface ItemActionsProps {
  item: AdminItem
  onDelete: (item: AdminItem) => void
}

function ItemActions({
  item,
  onDelete,
}: ItemActionsProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => navigate(`/admin/items/${item.id}`)}
        title="مشاهده"
        aria-label={`مشاهده ${item.title}`}
        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Eye className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => navigate(`/admin/items/${item.id}/edit`)}
        title="ویرایش"
        aria-label={`ویرایش ${item.title}`}
        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Pencil className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => onDelete(item)}
        title="حذف"
        aria-label={`حذف ${item.title}`}
        className="inline-flex size-8 items-center justify-center rounded-md text-danger transition hover:bg-danger/10 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

interface ItemsTableProps {
  items: AdminItem[]
  onDelete: (item: AdminItem) => void
}

function ItemsTable({
  items,
  onDelete,
}: ItemsTableProps) {
  const columns: TableColumn<AdminItem>[] = [
    {
      key: 'title',
      header: 'عنوان',
      className: 'w-56 max-w-56',
      render: (item) => (
        <div className="w-56 max-w-full">
          <p
            className="truncate font-medium"
            title={item.title}
          >
            {item.title}
          </p>

          <p
            className="mt-1 truncate text-xs text-muted-foreground"
            title={item.slug}
          >
            {item.slug}
          </p>
        </div>
      ),
    },
    {
      key: 'visibility',
      header: <span className="block text-center">وضعیت</span>,
      className: 'w-20 text-center',
      render: (item) =>
        item.is_visible ? (
          <span
            title="قابل نمایش"
            aria-label="قابل نمایش"
            className="mx-auto inline-flex size-9 items-center justify-center rounded-full text-success transition hover:bg-success/10 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Eye className="size-5" />
          </span>
        ) : (
          <span
            title="مخفی"
            aria-label="مخفی"
            className="mx-auto inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <EyeOffIcon className="size-5" />
          </span>
        ),
    },
    {
      key: 'access_type',
      header: <span className="block text-center">دسترسی</span>,
      className: 'w-20 text-center',
      render: (item) =>
        item.access_type === 'paid' ? (
          <button
            type="button"
            title={formatPrice(item.price)}
            aria-label={`محصول پولی - ${formatPrice(item.price)}`}
            className="mx-auto inline-flex size-9 items-center justify-center rounded-full text-warning transition hover:bg-warning/10 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <CircleDollarSign className="size-5" />
          </button>
        ) : (
          <button
            type="button"
            title="رایگان"
            aria-label="محصول رایگان"
            className="mx-auto inline-flex size-9 items-center justify-center rounded-full text-success transition hover:bg-success/10 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Gift className="size-5" />
          </button>
        ),
    },
    {
      key: 'actions',
      header: <span className="block text-center">عملیات</span>,
      className: 'w-32 text-center',
      render: (item) => (
        <ItemActions
          item={item}
          onDelete={onDelete}
        />
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={items}
      getRowKey={(item) => item.id}
      emptyMessage="محصولی برای نمایش وجود ندارد."
    />
  )
}

export default function ItemsPage() {
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] =
    useState<ItemFilters>(emptyFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<ItemFilters>(emptyFilters)
  const [categories, setCategories] = useState<ItemCategory[]>([])
  const [isCategoriesLoading, setIsCategoriesLoading] =
    useState(true)
  const [deletingItemId, setDeletingItemId] =
    useState<number | null>(null)

  const {
    data,
    error,
    isLoading,
    execute,
  } = useAsync<PaginatedResponse<AdminItem>>()

  const loadItems = useCallback(
    (page = currentPage, activeFilters = appliedFilters) =>
      execute(() =>
        getAdminItems(page, {
          search: activeFilters.search.trim() || undefined,
          is_visible:
            activeFilters.is_visible === 'all'
              ? undefined
              : activeFilters.is_visible === 'visible',
          access_type:
            activeFilters.access_type === 'all'
              ? undefined
              : activeFilters.access_type,
          category_id: activeFilters.category_id
            ? Number(activeFilters.category_id)
            : undefined,
          sort: activeFilters.sort,
        }),
      ),
    [currentPage, appliedFilters, execute],
  )

  useEffect(() => {
    void loadItems(currentPage, appliedFilters)
  }, [currentPage, appliedFilters, loadItems])

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      try {
        const result = await getAllCategories()

        if (!cancelled) {
          setCategories(result)
        }
      } catch {
        if (!cancelled) {
          await toast.error(
            'دریافت دسته‌بندی‌ها برای فیلتر انجام نشد.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsCategoriesLoading(false)
        }
      }
    }

    void loadCategories()

    return () => {
      cancelled = true
    }
  }, [])

  function handleFilterChange<K extends keyof ItemFilters>(
    field: K,
    value: ItemFilters[K],
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

  async function handleDelete(item: AdminItem) {
    const accepted = await confirm({
      title: `حذف «${item.title}»؟`,
      text: 'این عملیات قابل بازگشت نیست.',
      confirmText: 'حذف',
      cancelText: 'لغو',
      danger: true,
    })

    if (!accepted) {
      return
    }

    setDeletingItemId(item.id)

    try {
      await deleteAdminItem(item.id)
      await toast.success('محصول با موفقیت حذف شد.')

      const isLastItemOnPage =
        data?.data.length === 1 && currentPage > 1

      if (isLastItemOnPage) {
        setCurrentPage((page) => page - 1)
        return
      }

      await loadItems(currentPage, appliedFilters)
    } catch {
      await toast.error('حذف محصول انجام نشد.')
    } finally {
      setDeletingItemId(null)
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        icon={Package}
        title="محصولات"
        description="مدیریت محصولات"
        actions={
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate('/admin/items/create')}
          >
            <Plus className="size-4" />
            افزودن محصول
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
                محصولات را بر اساس جستجو، وضعیت، دسترسی، دسته‌بندی و ترتیب نمایش فیلتر کنید.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input
              id="item-search-filter"
              label="جستجو"
              placeholder="عنوان یا slug محصول"
              value={filters.search}
              onChange={(event) =>
                handleFilterChange(
                  'search',
                  event.target.value,
                )
              }
            />

            <Select
              id="item-visibility-filter"
              label="وضعیت نمایش"
              value={filters.is_visible}
              onChange={(event) =>
                handleFilterChange(
                  'is_visible',
                  event.target.value as ItemFilters['is_visible'],
                )
              }
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="visible">قابل نمایش</option>
              <option value="hidden">مخفی</option>
            </Select>

            <Select
              id="item-access-type-filter"
              label="نوع دسترسی"
              value={filters.access_type}
              onChange={(event) =>
                handleFilterChange(
                  'access_type',
                  event.target.value as ItemFilters['access_type'],
                )
              }
            >
              <option value="all">همه انواع دسترسی</option>
              <option value="free">رایگان</option>
              <option value="paid">پولی</option>
            </Select>

            <Select
              id="item-category-filter"
              label="دسته‌بندی"
              value={filters.category_id}
              disabled={isCategoriesLoading}
              onChange={(event) =>
                handleFilterChange(
                  'category_id',
                  event.target.value,
                )
              }
            >
              <option value="">
                {isCategoriesLoading
                  ? 'در حال دریافت دسته‌بندی‌ها...'
                  : 'همه دسته‌بندی‌ها'}
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </Select>

            <Select
              id="item-sort-filter"
              label="مرتب‌سازی"
              value={filters.sort}
              onChange={(event) =>
                handleFilterChange(
                  'sort',
                  event.target.value as ItemFilters['sort'],
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
              خطا در دریافت یا حذف محصول.
            </Alert>

            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={() =>
                  void loadItems(currentPage, appliedFilters)
                }
              >
                تلاش مجدد
              </Button>
            </div>
          </div>
        )}

        {deletingItemId !== null ? (
          <div className="border-b border-border px-4 py-3 text-sm text-muted-foreground sm:px-6">
            در حال حذف محصول...
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <ItemsTable
            items={data?.data ?? []}
            onDelete={(item) => {
              void handleDelete(item)
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
                isLoading || deletingItemId !== null
              }
            />
          </div>
        )}
      </Card>
    </section>
  )
}
