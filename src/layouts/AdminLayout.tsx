import { Outlet } from 'react-router'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

export default function AdminLayout() {
  return (
    <div dir="rtl" className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
