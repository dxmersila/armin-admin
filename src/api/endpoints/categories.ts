export const categoryEndpoints = {
  list: '/admin/categories',
  show: (id: number) => `/admin/categories/${id}`,
  create: '/admin/categories',
  update: (id: number) => `/admin/categories/${id}`,
  delete: (id: number) => `/admin/categories/${id}`,
} as const
