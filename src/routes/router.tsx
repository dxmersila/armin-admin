import { createBrowserRouter } from 'react-router'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardPage from '../pages/admin/DashboardPage'
import LoginPage from '../pages/auth/LoginPage'
import ProtectedRoute from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    Component: AuthLayout,
    children: [
      {
        path: '/login',
        Component: LoginPage,
      },
    ],
  },
  {
    path: '/admin',
    Component: ProtectedRoute,
    children: [
      {
        Component: AdminLayout,
        children: [
          {
            index: true,
            Component: DashboardPage,
          },
          {
            path: 'dashboard',
            Component: DashboardPage,
          },
          {
            path: 'items',
            Component: () => <div>Items</div>,
          },
          {
            path: 'orders',
            Component: () => <div>Orders</div>,
          },
        ],
      },
    ],
  },
])
