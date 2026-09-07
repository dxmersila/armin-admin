import { apiClient } from '../api/client'
import { orderEndpoints } from '../api/endpoints/orders'
import type { AdminOrder } from '../types/order'
import type { PaginatedResponse } from '../types/item'

export async function getAdminOrders(
  page = 1,
  params?: {
    status?: string
    user_id?: number
    payment_status?: string
  },
): Promise<PaginatedResponse<AdminOrder>> {
  const response = await apiClient.get<
    PaginatedResponse<AdminOrder>
  >(orderEndpoints.list, {
    params: {
      page,
      ...params,
    },
  })

  return response.data
}

export async function getAdminOrder(
  id: number,
): Promise<AdminOrder> {
  const response = await apiClient.get<{ data: AdminOrder }>(
    orderEndpoints.show(id),
  )

  return response.data.data
}
