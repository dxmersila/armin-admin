export type UserRole = 'user' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}
