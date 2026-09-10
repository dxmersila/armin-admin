import { useCallback, useEffect, useState } from 'react'
import {
  Eye,
  FolderTree,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import Alert from '../../components/ui/feedback/Alert'
import Button from '../../components/ui/Button'
import IconButton from '../../components/ui/IconButton'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import CollapsibleFilterBar from '../../components/ui/CollapsibleFilterBar'
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

interface CategoryActionsProps {
  category: AdminCategory
  onDelete: (category: AdminCategory) => void
}

function CategoryActions({
  category,
  onDelete,
}: CategoryActionsProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center gap-1">
      <IconButton
        type="button"
        onClick={() => navigate(`/admin/categories/${category.id}`)}
        title={t('categories.table.view')}
        aria-label={`${t('categories.table.view')} ${category.name}`}
      >
        <Eye className="size-4" />
      </IconButton>

      <IconButton
        type="button"
        onClick={() =>
          navigate(`/admin/categories/${category.id}/edit`)
        }
        title={t('categories.table.edit')}
        aria-label={`${t('categories.table.edit')} ${category.name}`}
      >
        <Pencil className="size-4" />
      </IconButton>

      <IconButton
        type="button"
        onClick={() => onDelete(category)}
        title={t('categories.table.delete')}
        aria-label={`${t('categories.table.delete')} ${category.name}`}
        variant="danger"
      >
        <Trash2 className="size-4" />
      </IconButton>
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
  const { t } = useTranslation()

  const columns: TableColumn<AdminCategory>[] = [
    {
      key: 'name',
      header: t('categories.table.name'),
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
          {t('categories.table.actions')}
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
      emptyMessage={t('categories.table.empty')}
    />
  )
}

export default function CategoriesPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const sortOptions: Array<{
    value: CategoryFilters['sort']
    label: string
  }> = [
    { value: 'latest', label: t('categories.filters.latest') },
    { value: 'oldest', label: t('categories.filters.oldest') },
    { value: 'name', label: t('categories.filters.name') },
  ]

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
      title: t('categories.feedback.deleteTitle', { name: category.name }),
      text: t('categories.feedback.deleteWarning'),
      confirmText: t('categories.table.delete'),
      cancelText: t('common.cancel'),
      danger: true,
    })

    if (!accepted) {
      return
    }

    setDeletingCategoryId(category.id)

    try {
      await deleteAdminCategory(category.id)
      await toast.success(t('categories.feedback.deleteSuccess'))

      const isLastCategoryOnPage =
        data?.data.length === 1 && currentPage > 1

      if (isLastCategoryOnPage) {
        setCurrentPage((page) => page - 1)
        return
      }

      await loadCategories(currentPage, appliedFilters)
    } catch {
      await toast.error(t('categories.feedback.deleteError'))
    } finally {
      setDeletingCategoryId(null)
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        icon={FolderTree}
        title={t('categories.title')}
        description={t('categories.description')}
        actions={
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate('/admin/categories/create')}
          >
            <Plus className="size-4" />
            {t('categories.add')}
          </Button>
        }
      />

      <CollapsibleFilterBar
        title={t('categories.filters.title')}
        description={t('categories.filters.description')}
      >

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="category-search-filter"
              label={t('categories.filters.search')}
              placeholder={t('categories.filters.searchPlaceholder')}
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
              label={t('categories.filters.sort')}
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
              {t('categories.filters.clear')}
            </Button>

            <Button
              type="button"
              onClick={handleApplyFilters}
            >
              {t('categories.filters.apply')}
            </Button>
          </div>
      </CollapsibleFilterBar>

      <Card className="overflow-hidden">
        {error !== null && (
          <div className="p-4 sm:p-6">
            <Alert variant="error">
              {t('categories.feedback.loadError')}
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
                {t('categories.feedback.retry')}
              </Button>
            </div>
          </div>
        )}

        {deletingCategoryId !== null ? (
          <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm text-muted-foreground sm:px-6">
            <Spinner size="sm" />
            <span>{t('categories.feedback.deleting')}</span>
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
