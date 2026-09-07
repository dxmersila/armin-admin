export const orderEndpoints = {
  list: '/admin/orders',
  show: (id: number) => `/admin/orders/${id}`,
} as const
