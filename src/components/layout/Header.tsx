import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-4 border-b border-border bg-surface px-6 py-3">
      <div>
        <h2 className="text-sm font-medium text-muted-foreground">
          {t('navigation.dashboard')}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <LanguageSwitcher />
        <ThemeSwitcher />

        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {user?.name}
          </p>

          <p className="text-xs text-muted-foreground">
            {user?.email}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? t('common.loading') : t('common.logout')}
        </button>
      </div>
    </header>
  )
}
