import { env } from '@/env'

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api'

const baseUrl = (env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '')

export const BACKEND_API_URL = baseUrl

export interface ApiInfoResponse {
  message: string
  version: string
  endpoints: Record<string, string>
}

export interface UsersResponse {
  users: Array<{
    id: number
    name: string
    email: string
  }>
}

function resolveUrl(path: string) {
  if (!path) {
    return baseUrl
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

async function request<TResponse>(path: string, init?: RequestInit) {
  const response = await fetch(resolveUrl(path), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request to ${path || '/'} failed with status ${response.status}`)
  }

  return response.json() as Promise<TResponse>
}

export function fetchApiInfo() {
  return request<ApiInfoResponse>('')
}

export function fetchUsers() {
  return request<UsersResponse>('/users')
}

