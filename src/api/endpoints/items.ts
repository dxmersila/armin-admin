export const itemEndpoints = {
  list: '/admin/items',
  show: (id: number) => `/admin/items/${id}`,
  create: '/admin/items',
  update: (id: number) => `/admin/items/${id}`,
  delete: (id: number) => `/admin/items/${id}`,
} as const
