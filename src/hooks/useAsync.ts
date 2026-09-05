import { useCallback, useState } from 'react'

interface UseAsyncResult<T> {
  data: T | null
  error: unknown
  isLoading: boolean
  execute: (operation: () => Promise<T>) => Promise<T | undefined>
  reset: () => void
}

export function useAsync<T>(): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(
    async (operation: () => Promise<T>): Promise<T | undefined> => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await operation()
        setData(result)
        return result
      } catch (caughtError) {
        setError(caughtError)
        return undefined
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  }
}
