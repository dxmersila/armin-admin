import { apiClient } from '../api/client'
import { userEndpoints } from '../api/endpoints/users'
import type {
  AdminUser,
  AdminUserFilters,
  UpdateAdminUserPayload,
} from '../types/user'
import type { PaginatedResponse } from '../types/item'

export async function getAdminUsers(
  page = 1,
  filters: AdminUserFilters = {},
): Promise<PaginatedResponse<AdminUser>> {
  const response = await apiClient.get<
    PaginatedResponse<AdminUser>
  >(userEndpoints.list, {
    params: {
      page,
      ...filters,
    },
  })

  return response.data
}

export async function getAdminUser(
  id: number,
): Promise<AdminUser> {
  const response = await apiClient.get<{ data: AdminUser }>(
    userEndpoints.show(id),
  )

  return response.data.data
}

export async function updateAdminUser(
  id: number,
  payload: UpdateAdminUserPayload,
): Promise<AdminUser> {
  const response = await apiClient.patch<{
    data: AdminUser
  }>(userEndpoints.update(id), payload)

  return response.data.data
}
