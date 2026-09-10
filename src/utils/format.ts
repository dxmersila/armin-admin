import type { AppLocale } from '../config/app'

export function formatPrice(
  price: number | null,
  locale: AppLocale,
): string {
  if (price === null) {
    return '—'
  }

  const formatted = price.toLocaleString(
    locale === 'fa' ? 'fa-IR' : 'en-US',
  )

  return locale === 'fa'
    ? `${formatted} تومان`
    : `${formatted} Toman`
}

export function formatDate(
  date: string,
  locale: AppLocale,
): string {
  return new Date(date).toLocaleDateString(
    locale === 'fa' ? 'fa-IR' : 'en-US',
  )
}

export function formatDateTime(
  date: string,
  locale: AppLocale,
): string {
  return new Date(date).toLocaleString(
    locale === 'fa' ? 'fa-IR' : 'en-US',
  )
}
