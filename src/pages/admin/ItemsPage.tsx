import { useCallback, useEffect, useState } from 'react'
import {
  CircleDollarSign,
  Eye,
  Package,
  EyeOffIcon,
  Gift,
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
  deleteAdminItem,
  getAdminItems,
} from '../../services/itemService'
import type {
  AdminItem,
  PaginatedResponse,
} from '../../types/item'

function formatPrice(price: number | null) {
  if (price === null) {
    return '—'
  }

  return `${price.toLocaleString('fa-IR')} تومان`
}

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
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null)

  const {
    data,
    error,
    isLoading,
    execute,
  } = useAsync<PaginatedResponse<AdminItem>>()

  const loadItems = useCallback(
    (page = currentPage) => execute(() => getAdminItems(page)),
    [currentPage, execute],
  )

  useEffect(() => {
    void loadItems(currentPage)
  }, [currentPage, loadItems])

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

      await loadItems(currentPage)
    } catch {
      await toast.error('حذف محصول انجام نشد.')
    } finally {
      setDeletingItemId(null)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Package className="size-6 shrink-0" />
            <span>محصولات</span>
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            مدیریت محصولات
          </p>
        </div>

        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate('/admin/items/create')}
        >
          <Plus className="size-4" />
          افزودن محصول
        </Button>
      </div>

      <Card className="p-3 sm:p-4 md:p-6">
        {error !== null && (
          <div className="mb-6">
            <Alert variant="error">
              خطا در دریافت یا حذف محصول.
            </Alert>

            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={() => void loadItems(currentPage)}
              >
                تلاش مجدد
              </Button>
            </div>
          </div>
        )}

        {deletingItemId !== null ? (
          <div className="mb-4 text-sm text-muted-foreground">
            در حال حذف محصول...
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
          <ItemsTable
            items={data?.data ?? []}
            onDelete={(item) => {
              void handleDelete(item)
            }}
          />
        )}

        {data && (
          <div className="mt-6 overflow-x-auto border-t border-border pt-4">
            <Pagination
              currentPage={data.meta.current_page}
              lastPage={data.meta.last_page}
              onPageChange={setCurrentPage}
              disabled={isLoading || deletingItemId !== null}
            />
          </div>
        )}
      </Card>
    </section>
  )
}
