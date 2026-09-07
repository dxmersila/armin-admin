export type UserRole = 'admin' | 'user'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: string
}

export interface AdminUserFilters {
  search?: string
  role?: UserRole
  sort?: 'latest' | 'oldest' | 'name'
}

export interface UpdateAdminUserPayload {
  name?: string
  role?: UserRole
}
