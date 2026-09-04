import { NavLink, Outlet } from 'react-router'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold">Armin Admin</h1>

          <nav className="flex gap-4 text-sm">
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
            <NavLink to="/admin/items">Items</NavLink>
            <NavLink to="/admin/orders">Orders</NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
