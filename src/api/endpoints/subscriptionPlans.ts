export const subscriptionPlanEndpoints = {
  list: '/admin/subscription-plans',
  show: (id: number) => `/admin/subscription-plans/${id}`,
} as const
