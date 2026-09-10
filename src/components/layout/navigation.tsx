import {
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BadgeCheck,
  type LucideIcon,
} from 'lucide-react'

export type NavigationKey =
  | 'dashboard'
  | 'items'
  | 'orders'
  | 'categories'
  | 'users'
  | 'subscriptions'

export interface NavigationItem {
  key: NavigationKey
  to: string
  icon: LucideIcon
}

export const adminNavigation: NavigationItem[] = [
  {
    key: 'dashboard',
    to: '/admin',
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
  {
    key: 'subscriptions',
    to: '/admin/subscription-plans',
    icon: BadgeCheck,
  },
]
