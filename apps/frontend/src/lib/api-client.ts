import type { AgentLanguage, AgentModelId } from '@/lib/agent-options'
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

export type CreateAgentPayload = {
  name: string
  systemPrompt: string
  firstMessage?: string
  language: AgentLanguage
  voiceId: string
  modelId?: AgentModelId
}

export type AgentRecord = {
  agentId: string
  name: string
  systemPrompt: string
  language: AgentLanguage
  voiceId: string
  firstMessage: string
  modelId: AgentModelId
  createdAt: string
}

export type CreateAgentResponse = AgentRecord

export type ListAgentsResponse = {
  agents: Array<AgentRecord>
}

export type ConversationTokenResponse = {
  token: string
  expiresAt: string | null
  ttl: number | null
}

export type ScribeTokenResponse = {
  token: string
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

export function createAgent(payload: CreateAgentPayload) {
  return request<CreateAgentResponse>('/agents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function fetchAgents() {
  return request<ListAgentsResponse>('/agents')
}

export function fetchConversationToken(agentId: string, options?: { userId?: string }) {
  const body: Record<string, string> = {
    agentId,
  }

  if (options?.userId) {
    body.userId = options.userId
  }

  return request<ConversationTokenResponse>('/agents/conversation-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export function fetchScribeToken() {
  return request<ScribeTokenResponse>('/agents/scribe-token', {
    method: 'POST',
  })
}

