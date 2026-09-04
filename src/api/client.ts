import axios from 'axios'
import { getToken } from '../utils/token'

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL is not configured.')
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
