import { useCallback, useEffect, useState } from 'react'
import {
  Eye,
  Filter,
  Pencil,
  Shield,
  Users as UsersIcon,
} from 'lucide-react'
import Alert from '../../components/ui/feedback/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import IconButton from '../../components/ui/IconButton'
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
import { useAsync } from '../../hooks/useAsync'
import { getAdminUsers } from '../../services/userService'
import type {
  AdminUser,
  UserRole,
} from '../../types/user'
import type { PaginatedResponse } from '../../types/item'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'

interface UserFilters {
  search: string
  role: '' | UserRole
  sort: 'latest' | 'oldest' | 'name'
}

const emptyFilters: UserFilters = {
  search: '',
  role: '',
  sort: 'latest',
}

function getRoleLabel(
  role: UserRole,
  t: (key: string) => string,
) {
  return role === 'admin'
    ? t('users.table.adminRole')
    : t('users.table.userRole')
}

function getRoleBadgeVariant(
  role: UserRole,
): 'neutral' | 'info' {
  return role === 'admin' ? 'info' : 'neutral'
}

interface UserActionsProps {
  user: AdminUser
}

function UserActions({ user }: UserActionsProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center gap-1">
      <IconButton
        type="button"
        onClick={() => navigate(`/admin/users/${user.id}`)}
        title={t('common.view')}
        aria-label={`${t('common.view')} ${user.name}`}
      >
        <Eye className="size-4" />
      </IconButton>

      <IconButton
        type="button"
        onClick={() =>
          navigate(`/admin/users/${user.id}/edit`)
        }
        title={t('common.edit')}
        aria-label={`${t('common.edit')} ${user.name}`}
      >
        <Pencil className="size-4" />
      </IconButton>
    </div>
  )
}

interface UsersTableProps {
  users: AdminUser[]
}

function UsersTable({ users }: UsersTableProps) {
  const { t } = useTranslation()

  const columns: TableColumn<AdminUser>[] = [
    {
      key: 'name',
      header: t('users.table.name'),
      className: 'w-52 max-w-52',
      render: (user) => (
        <div className="w-52 max-w-full">
          <p
            className="truncate font-medium"
            title={user.name}
          >
            {user.name}
          </p>
        </div>
      ),
    },
    {
      key: 'email',
      header: t('users.table.email'),
      className: 'min-w-56',
      render: (user) => (
        <span
          className="block max-w-72 truncate"
          title={user.email}
        >
          {user.email}
        </span>
      ),
    },
    {
      key: 'role',
      header: t('users.table.role'),
      className: 'w-28',
      render: (user) => (
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {user.role === 'admin' ? (
            <Shield className="size-3.5" />
          ) : null}
          {getRoleLabel(user.role, t)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: (
        <span className="block text-center">
          {t('users.table.actions')}
        </span>
      ),
      className: 'w-24 text-center',
      render: (user) => <UserActions user={user} />,
    },
  ]

  return (
    <Table
      columns={columns}
      data={users}
      getRowKey={(user) => user.id}
      emptyMessage={t('users.table.empty')}
    />
  )
}

export default function UsersPage() {
  const { t } = useTranslation()

  const roleOptions: Array<{
    value: UserRole
    label: string
  }> = [
    { value: 'user', label: t('users.table.userRole') },
    { value: 'admin', label: t('users.table.adminRole') },
  ]

  const sortOptions: Array<{
    value: UserFilters['sort']
    label: string
  }> = [
    { value: 'latest', label: t('users.filters.latest') },
    { value: 'oldest', label: t('users.filters.oldest') },
    { value: 'name', label: t('users.filters.name') },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] =
    useState<UserFilters>(emptyFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<UserFilters>(emptyFilters)

  const {
    data,
    error,
    isLoading,
    execute,
  } = useAsync<PaginatedResponse<AdminUser>>()

  const loadUsers = useCallback(
    (page = currentPage, activeFilters = appliedFilters) =>
      execute(() =>
        getAdminUsers(page, {
          search: activeFilters.search.trim() || undefined,
          role: activeFilters.role || undefined,
          sort: activeFilters.sort,
        }),
      ),
    [currentPage, appliedFilters, execute],
  )

  useEffect(() => {
    void loadUsers(currentPage, appliedFilters)
  }, [currentPage, appliedFilters, loadUsers])

  function handleFilterChange<K extends keyof UserFilters>(
    field: K,
    value: UserFilters[K],
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

  return (
    <section className="space-y-6">
      <PageHeader
        icon={UsersIcon}
        title={t('users.title')}
        description={t('users.description')}
      />

      <Card className="p-4 sm:p-6">
        <FilterBar>
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-muted-foreground" />

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {t('users.filters.title')}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {t('users.filters.description')}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              id="user-search-filter"
              label={t('common.search')}
              placeholder={t('users.filters.searchPlaceholder')}
              value={filters.search}
              onChange={(event) =>
                handleFilterChange(
                  'search',
                  event.target.value,
                )
              }
            />

            <Select
              id="user-role-filter"
              label={t('users.filters.role')}
              value={filters.role}
              onChange={(event) =>
                handleFilterChange(
                  'role',
                  event.target.value as UserFilters['role'],
                )
              }
            >
              <option value="">{t('users.filters.allRoles')}</option>

              {roleOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              id="user-sort-filter"
              label={t('users.filters.sort')}
              value={filters.sort}
              onChange={(event) =>
                handleFilterChange(
                  'sort',
                  event.target.value as UserFilters['sort'],
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
              {t('common.clear')}
            </Button>

            <Button
              type="button"
              onClick={handleApplyFilters}
            >
              {t('common.apply')}
            </Button>
          </div>
        </FilterBar>
      </Card>

      {error !== null && (
        <Alert variant="error">
          {t('users.feedback.loadError')}
        </Alert>
      )}

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <UsersTable users={data?.data ?? []} />
        )}

        {!isLoading && data && (
          <div className="border-t border-border px-4 py-4">
            <Pagination
              currentPage={data.meta.current_page}
              lastPage={data.meta.last_page}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>
    </section>
  )
}
