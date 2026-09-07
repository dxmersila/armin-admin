import {
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type NavigationKey =
  | 'dashboard'
  | 'items'
  | 'orders'
  | 'categories'
  | 'users'

export interface NavigationItem {
  key: NavigationKey
  to: string
  icon: LucideIcon
}

export const adminNavigation: NavigationItem[] = [
  {
    key: 'dashboard',
    to: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'items',
    to: '/admin/items',
    icon: Package,
  },
  {
    key: 'categories',
    to: '/admin/categories',
    icon: FolderTree,
  },
  {
    key: 'orders',
    to: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    key: 'users',
    to: '/admin/users',
    icon: Users,
  },
]
