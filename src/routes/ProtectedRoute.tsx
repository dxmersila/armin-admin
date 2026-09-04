import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../auth/useAuth'

export default function ProtectedRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
