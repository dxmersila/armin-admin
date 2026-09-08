import type {
  OrderStatus,
  OrderType,
  PaymentStatus,
} from '../types/order'

const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  failed: 'ناموفق',
  cancelled: 'لغو شده',
}

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'در انتظار',
  paid: 'پرداخت شده',
  failed: 'ناموفق',
}

export function getOrderTypeLabel(type: OrderType): string {
  return type === 'item' ? 'محصول' : 'اشتراک'
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return orderStatusLabels[status]
}

export function getPaymentStatusLabel(
  status: PaymentStatus,
): string {
  return paymentStatusLabels[status]
}
