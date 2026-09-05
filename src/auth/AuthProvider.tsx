import { useEffect, useState, type ReactNode } from 'react'
import { authService } from '../services/authService'
import { getToken, removeToken } from '../utils/token'
import type { LoginPayload, User } from '../types/auth'
import { AuthContext } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()))

  useEffect(() => {
    const token = getToken()

    if (!token) {
      return
    }

    async function restoreSession() {
      try {
        const currentUser = await authService.me()
        setUser(currentUser)
      } catch {
        removeToken()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    void restoreSession()
  }, [])

  async function login(email: string, password: string): Promise<User> {
    const payload: LoginPayload = {
      email,
      password,
    }

    const response = await authService.login(payload)

    setUser(response.user)

    return response.user
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      removeToken()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
