import { apiClient } from '../api/client'
import { categoryEndpoints } from '../api/endpoints/categories'
import type { ItemCategory, PaginatedResponse } from '../types/item'
import type { AdminCategory } from '../types/category'

export interface CategoryPayload {
  name: string
  slug?: string
}

export async function getCategories(
  page = 1,
): Promise<PaginatedResponse<ItemCategory>> {
  const response = await apiClient.get<
    PaginatedResponse<ItemCategory>
  >('/categories', {
    params: {
      page,
    },
  })

  return response.data
}

export async function getAllCategories(): Promise<ItemCategory[]> {
  const firstPage = await getCategories(1)
  const categories = [...firstPage.data]

  for (
    let page = 2;
    page <= firstPage.meta.last_page;
    page += 1
  ) {
    const nextPage = await getCategories(page)
    categories.push(...nextPage.data)
  }

  return categories
}

export interface AdminCategoryFilters {
  search?: string
  sort?: 'latest' | 'oldest' | 'name'
}

export async function getAdminCategories(
  page = 1,
  filters: AdminCategoryFilters = {},
): Promise<PaginatedResponse<AdminCategory>> {
  const response = await apiClient.get<
    PaginatedResponse<AdminCategory>
  >(categoryEndpoints.list, {
    params: {
      page,
      ...filters,
    },
  })

  return response.data
}

export async function getAdminCategory(
  id: number,
): Promise<AdminCategory> {
  const response = await apiClient.get<{ data: AdminCategory }>(
    categoryEndpoints.show(id),
  )

  return response.data.data
}

export async function createAdminCategory(
  payload: CategoryPayload,
): Promise<AdminCategory> {
  const response = await apiClient.post<{ data: AdminCategory }>(
    categoryEndpoints.create,
    payload,
  )

  return response.data.data
}

export async function updateAdminCategory(
  id: number,
  payload: CategoryPayload,
): Promise<AdminCategory> {
  const response = await apiClient.put<{ data: AdminCategory }>(
    categoryEndpoints.update(id),
    payload,
  )

  return response.data.data
}

export async function deleteAdminCategory(
  id: number,
): Promise<void> {
  await apiClient.delete(categoryEndpoints.delete(id))
}
