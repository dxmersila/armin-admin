import type { UserRole } from './user'
import type { AdminItem } from './item'
import type { AdminSubscriptionPlan } from './subscriptionPlan'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'

export type OrderType =
  | 'item'
  | 'subscription'

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'

export interface OrderUser {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface OrderItem {
  id: number
  item_id: number
  price: number
  item: AdminItem
}

export interface OrderPayment {
  id: number
  order_id: number
  amount: number
  status: PaymentStatus
  created_at: string
}

export interface AdminOrder {
  id: number
  user_id: number
  type: OrderType
  status: OrderStatus
  total_price: number
  user?: OrderUser
  items?: OrderItem[]
  subscription_plan?: AdminSubscriptionPlan | null
  payments?: OrderPayment[]
  created_at: string
  updated_at: string
}
