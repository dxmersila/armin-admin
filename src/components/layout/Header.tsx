import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border bg-surface px-3 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={t('common.menu')}
          title={t('common.menu')}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <Link
          to="/admin"
          className="truncate text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          {t('navigation.dashboard')}
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </header>
  )
}
