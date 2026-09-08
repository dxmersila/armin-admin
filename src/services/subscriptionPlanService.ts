import { apiClient } from '../api/client'
import {
  subscriptionPlanEndpoints,
} from '../api/endpoints/subscriptionPlans'
import type {
  AdminSubscriptionPlan,
  SubscriptionPlanFormValues,
} from '../types/subscriptionPlan'
import type { PaginatedResponse } from '../types/item'

export async function getAdminSubscriptionPlans(
  page = 1,
): Promise<PaginatedResponse<AdminSubscriptionPlan>> {
  const response = await apiClient.get<
    PaginatedResponse<AdminSubscriptionPlan>
  >(subscriptionPlanEndpoints.list, {
    params: {
      page,
    },
  })

  return response.data
}

export async function getAdminSubscriptionPlan(
  id: number,
): Promise<AdminSubscriptionPlan> {
  const response = await apiClient.get<{
    data: AdminSubscriptionPlan
  }>(subscriptionPlanEndpoints.show(id))

  return response.data.data
}

export async function createAdminSubscriptionPlan(
  payload: SubscriptionPlanFormValues,
): Promise<AdminSubscriptionPlan> {
  const response = await apiClient.post<{
    data: AdminSubscriptionPlan
  }>(subscriptionPlanEndpoints.list, {
    ...payload,
    duration_months: Number(payload.duration_months),
    price: Number(payload.price),
  })

  return response.data.data
}

export async function updateAdminSubscriptionPlan(
  id: number,
  payload: Partial<SubscriptionPlanFormValues>,
): Promise<AdminSubscriptionPlan> {
  const response = await apiClient.patch<{
    data: AdminSubscriptionPlan
  }>(subscriptionPlanEndpoints.show(id), {
    ...payload,
    ...(payload.duration_months !== undefined
      ? { duration_months: Number(payload.duration_months) }
      : {}),
    ...(payload.price !== undefined
      ? { price: Number(payload.price) }
      : {}),
  })

  return response.data.data
}
