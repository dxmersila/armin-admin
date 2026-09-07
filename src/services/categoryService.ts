import { apiClient } from '../api/client'
import type {
  ItemCategory,
  PaginatedResponse,
} from '../types/item'

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
