import type { AdminMedia } from './media'

export interface ItemCategory {
  id: number
  name: string
  slug: string
}

export interface ItemTag {
  id: number
  name: string
  slug: string
}

export type ItemMedia = AdminMedia

export interface AdminItem {
  id: number
  title: string
  slug: string
  description: string | null
  content: string | null
  is_visible: boolean
  access_type: 'free' | 'paid'
  price: number | null
  categories: ItemCategory[]
  tags: ItemTag[]
  media: ItemMedia[]
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  links: PaginationLinks
  meta: PaginationMeta
}
