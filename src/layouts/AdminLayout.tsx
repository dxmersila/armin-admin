import { useState } from 'react'
import { Outlet } from 'react-router'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function closeSidebar() {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex min-h-screen min-w-0 flex-col lg:ms-64">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
