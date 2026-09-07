export const userEndpoints = {
  list: '/admin/users',
  show: (id: number) => `/admin/users/${id}`,
  update: (id: number) => `/admin/users/${id}`,
} as const
