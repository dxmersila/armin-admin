import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

const navigation = [
  { key: 'dashboard', to: '/admin/dashboard' },
  { key: 'items', to: '/admin/items' },
  { key: 'orders', to: '/admin/orders' },
] as const

export default function Sidebar() {
  const { t } = useTranslation()

  return (
    <aside className="w-64 shrink-0 border-e border-border bg-surface">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground">
          Armin Admin
        </h1>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'block rounded-md px-3 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              ].join(' ')
            }
          >
            {t(`navigation.${item.key}`)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
