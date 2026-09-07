import { apiClient } from '../api/client'
import { itemEndpoints } from '../api/endpoints/items'
import type {
  AdminItem,
  PaginatedResponse,
} from '../types/item'

export interface ItemPayload {
  title: string
  slug?: string
  description?: string | null
  content?: string | null
  is_visible?: boolean
  access_type?: 'free' | 'paid'
  price?: number | null
  categories?: number[]
  tags?: string[]
}

export async function getAdminItems(
  page = 1,
): Promise<PaginatedResponse<AdminItem>> {
  const response = await apiClient.get<
    PaginatedResponse<AdminItem>
  >(itemEndpoints.list, {
    params: {
      page,
    },
  })

  return response.data
}

export async function getAdminItem(
  id: number,
): Promise<AdminItem> {
  const response = await apiClient.get<{ data: AdminItem }>(
    itemEndpoints.show(id),
  )

  return response.data.data
}

export async function createAdminItem(
  payload: ItemPayload,
): Promise<AdminItem> {
  const response = await apiClient.post<{ data: AdminItem }>(
    itemEndpoints.create,
    payload,
  )

  return response.data.data
}

export async function updateAdminItem(
  id: number,
  payload: ItemPayload,
): Promise<AdminItem> {
  const response = await apiClient.put<{ data: AdminItem }>(
    itemEndpoints.update(id),
    payload,
  )

  return response.data.data
}

export async function deleteAdminItem(
  id: number,
): Promise<void> {
  await apiClient.delete(itemEndpoints.delete(id))
}
