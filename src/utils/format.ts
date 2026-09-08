export function formatPrice(price: number | null): string {
  if (price === null) {
    return '—'
  }

  return `${price.toLocaleString('fa-IR')} تومان`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fa-IR')
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('fa-IR')
}
