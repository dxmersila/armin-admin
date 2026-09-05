import { apiClient } from '../api/client'
import { dashboardEndpoints } from '../api/endpoints/dashboard'
import type { DashboardStats } from '../types/dashboard'

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>(
    dashboardEndpoints.stats,
  )

  return response.data
}
