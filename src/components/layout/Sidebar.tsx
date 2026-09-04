import { NavLink } from 'react-router'

const navigation = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Items', to: '/admin/items' },
  { label: 'Orders', to: '/admin/orders' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-l bg-white">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Armin Admin</h1>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'block rounded-lg px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
