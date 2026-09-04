import { useCallback, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import type { User } from '../types/auth'
import { getToken, removeToken } from '../utils/token'
import { AuthContext, type AuthContextValue } from './AuthContext'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      setIsLoading(false)
      return
    }

    authService
      .me()
      .then((currentUser) => {
        setUser(currentUser)
      })
      .catch(() => {
        removeToken()
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      const response = await authService.login({
        email,
        password,
      })

      setUser(response.user)

      return response.user
    },
    [],
  )

  const logout = useCallback(async (): Promise<void> => {
    await authService.logout()
    setUser(null)
  }, [])

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
