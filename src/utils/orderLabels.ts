import type {
  OrderStatus,
  OrderType,
  PaymentStatus,
} from '../types/order'

export function getOrderTypeLabelKey(
  type: OrderType,
): string {
  return type === 'item'
    ? 'orders.type.item'
    : 'orders.type.subscription'
}

export function getOrderStatusLabelKey(
  status: OrderStatus,
): string {
  return `orders.status.${status}`
}

export function getPaymentStatusLabelKey(
  status: PaymentStatus,
): string {
  return `orders.paymentStatus.${status}`
}
