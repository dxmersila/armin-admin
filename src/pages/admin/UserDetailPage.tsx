import { useCallback, useEffect } from 'react'
import {
  CalendarDays,
  Mail,
  Pencil,
  Shield,
  User as UserIcon,
  Users as UsersIcon,
} from 'lucide-react'
import { Link, useParams } from 'react-router'
import Alert from '../../components/ui/feedback/Alert'
import BackButton from '../../components/ui/BackButton'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/feedback/Spinner'
import { useAsync } from '../../hooks/useAsync'
import { getAdminUser } from '../../services/userService'
import type { AdminUser, UserRole } from '../../types/user'

function getRoleLabel(role: UserRole) {
  return role === 'admin' ? 'مدیر' : 'کاربر'
}

function getRoleBadgeVariant(
  role: UserRole,
): 'neutral' | 'info' {
  return role === 'admin' ? 'info' : 'neutral'
}

export default function UserDetailPage() {
  const { id } = useParams()

  const {
    data: user,
    error,
    isLoading,
    execute,
  } = useAsync<AdminUser>()

  const loadUser = useCallback(() => {
    if (!id) {
      return Promise.resolve(undefined)
    }

    const userId = Number(id)

    if (!Number.isInteger(userId) || userId <= 0) {
      return Promise.resolve(undefined)
    }

    return execute(() => getAdminUser(userId))
  }, [execute, id])

  useEffect(() => {
    void loadUser()
  }, [loadUser])

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
          شناسه کاربر نامعتبر است.
        </Alert>

        <BackButton to="/admin/users">
          بازگشت به کاربران
        </BackButton>
      </section>
    )
  }

  if (error !== null || !user) {
    return (
      <section className="space-y-4">
        <Alert variant="error">
          خطا در دریافت اطلاعات کاربر.
        </Alert>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => void loadUser()}
          >
            تلاش مجدد
          </Button>

          <BackButton to="/admin/users">
            بازگشت
          </BackButton>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <PageHeader
        icon={UsersIcon}
        title={user.name}
        description={user.email}
        actions={
          <>
            <BackButton to="/admin/users">
              بازگشت به کاربران
            </BackButton>

            <Link to={`/admin/users/${user.id}/edit`}>
              <Button
                variant="secondary"
                size="sm"
                aria-label={`ویرایش ${user.name}`}
              >
                <Pencil className="size-4" />
                ویرایش
              </Button>
            </Link>
          </>
        }
      />

      <Card className="p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <UserIcon className="size-5 text-muted-foreground" />

          <h2 className="font-semibold text-foreground">
            اطلاعات کاربر
          </h2>
        </div>

        <dl className="space-y-5 text-sm">
          <div className="flex items-start gap-3">
            <UserIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <dt className="text-muted-foreground">
                نام
              </dt>

              <dd className="mt-1 text-foreground">
                {user.name}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <dt className="text-muted-foreground">
                ایمیل
              </dt>

              <dd className="mt-1 break-all text-foreground">
                {user.email}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <dt className="text-muted-foreground">
                نقش
              </dt>

              <dd className="mt-1">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role === 'admin' ? (
                    <Shield className="size-3.5" />
                  ) : null}
                  {getRoleLabel(user.role)}
                </Badge>
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <dt className="text-muted-foreground">
                تاریخ عضویت
              </dt>

              <dd className="mt-1 text-foreground">
                {new Date(user.created_at).toLocaleDateString(
                  'fa-IR',
                )}
              </dd>
            </div>
          </div>
        </dl>
      </Card>
    </section>
  )
}
