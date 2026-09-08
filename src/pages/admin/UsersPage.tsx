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

const roleOptions: Array<{
  value: UserRole
  label: string
}> = [
  { value: 'user', label: 'کاربر' },
  { value: 'admin', label: 'مدیر' },
]

const sortOptions: Array<{
  value: UserFilters['sort']
  label: string
}> = [
  { value: 'latest', label: 'جدیدترین' },
  { value: 'oldest', label: 'قدیمی‌ترین' },
  { value: 'name', label: 'نام' },
]

function getRoleLabel(role: UserRole) {
  return role === 'admin' ? 'مدیر' : 'کاربر'
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

  return (
    <div className="flex items-center justify-center gap-1">
      <IconButton
        type="button"
        onClick={() => navigate(`/admin/users/${user.id}`)}
        title="مشاهده"
        aria-label={`مشاهده ${user.name}`}
      >
        <Eye className="size-4" />
      </IconButton>

      <IconButton
        type="button"
        onClick={() =>
          navigate(`/admin/users/${user.id}/edit`)
        }
        title="ویرایش"
        aria-label={`ویرایش ${user.name}`}
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
  const columns: TableColumn<AdminUser>[] = [
    {
      key: 'name',
      header: 'نام',
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
      header: 'ایمیل',
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
      header: 'نقش',
      className: 'w-28',
      render: (user) => (
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {user.role === 'admin' ? (
            <Shield className="size-3.5" />
          ) : null}
          {getRoleLabel(user.role)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: (
        <span className="block text-center">
          عملیات
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
      emptyMessage="کاربری برای نمایش وجود ندارد."
    />
  )
}

export default function UsersPage() {
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
        title="کاربران"
        description="مدیریت کاربران و نقش‌های دسترسی."
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
                کاربران را بر اساس نام، ایمیل، نقش و ترتیب نمایش فیلتر کنید.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              id="user-search-filter"
              label="جستجو"
              placeholder="نام یا ایمیل کاربر"
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
              label="نقش"
              value={filters.role}
              onChange={(event) =>
                handleFilterChange(
                  'role',
                  event.target.value as UserFilters['role'],
                )
              }
            >
              <option value="">همه نقش‌ها</option>

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
              label="مرتب‌سازی"
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

      {error !== null && (
        <Alert variant="error">
          دریافت کاربران انجام نشد.
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
