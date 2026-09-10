import { apiClient } from '../api/client'
import type {
  LoginPayload,
  LoginResponse,
  User,
} from '../types/auth'
import { removeToken, setToken } from '../utils/token'

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      payload,
    )

    setToken(response.data.token)

    return response.data
  },

  async me(): Promise<User> {
    const response = await apiClient.get<{ data: User }>('/auth/me')

    return response.data.data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      removeToken()
    }
  },
}
