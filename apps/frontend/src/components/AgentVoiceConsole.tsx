import { CommitStrategy, useConversation, useScribe } from '@elevenlabs/react'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type {
  AgentChatResponsePartEvent,
  IncomingSocketEvent,
  Mode,
} from '@elevenlabs/client'

import type { AgentRecord } from '@/lib/api-client'
import { fetchAgents, fetchConversationToken, fetchScribeToken } from '@/lib/api-client'
import { env } from '@/env'

const DEFAULT_AGENT_ID = 'agent_6001ka3t5pnefdwbpp31myx7ha69'
const TARGET_AGENT_ID = env.VITE_ELEVENLABS_AGENT_ID
const INITIAL_AGENT_ID = TARGET_AGENT_ID ?? DEFAULT_AGENT_ID
const MAX_VISIBLE_MESSAGES = 40

const formatAgentOptionLabel = (agent: AgentRecord) =>
  `${agent.name} · ${agent.language.toUpperCase()} · ${agent.agentId.slice(0, 8)}…`

type MessageRole = 'agent' | 'user' | 'system'

type TranscriptMessage = {
  id: string
  role: MessageRole
  text: string
  timestamp: string
}

const formatTimestamp = (value: string) => {
  try {
    return new Date(value).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return value
  }
}

const createRandomId = (prefix: string) => {
  const generated =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)

  return `${prefix}-${generated}`
}

const createTranscriptMessage = (
  role: MessageRole,
  text: string,
  id = createRandomId(role)
): TranscriptMessage => ({
  id,
  role,
  text,
  timestamp: new Date().toISOString(),
})

const ensureMicrophoneAccess = async () => {
  if (typeof navigator === 'undefined') {
    throw new Error('Microphone access is not supported in this browser.')
  }

  await navigator.mediaDevices.getUserMedia({ audio: true })
}

export function AgentVoiceConsole() {
  const agentsQuery = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  })
  const storedAgents = agentsQuery.data?.agents ?? []

  const [messages, setMessages] = useState<Array<TranscriptMessage>>([])
  const [error, setError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [mode, setMode] = useState<string>('idle')
  const [manualMessage, setManualMessage] = useState('')
  const [selectedAgentId, setSelectedAgentId] = useState<string>(INITIAL_AGENT_ID)
  const [tokenMetadata, setTokenMetadata] = useState<{
    token: string
    expiresAt: string | null
    ttl: number | null
    fetchedAt: string
  } | null>(null)
  const [scribeError, setScribeError] = useState<string | null>(null)
  const [isScribeStarting, setIsScribeStarting] = useState(false)
  const [scribePartialTranscript, setScribePartialTranscript] = useState('')
  const [scribeHistory, setScribeHistory] = useState<
    Array<{ id: string; text: string; timestamp: string }>
  >([])

  const streamingAgentMessageIdRef = useRef<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    setUserId((current) => current ?? createRandomId('web-user'))
  }, [])

  useEffect(() => {
    if (!selectedAgentId && storedAgents.length > 0) {
      setSelectedAgentId(storedAgents[0].agentId)
    }
  }, [selectedAgentId, storedAgents])

  const selectedAgent =
    storedAgents.find((agent) => agent.agentId === selectedAgentId) ?? null
  const shouldShowConfiguredAgentOption =
    Boolean(TARGET_AGENT_ID) &&
    !storedAgents.some((agent) => agent.agentId === TARGET_AGENT_ID)

  const appendMessage = useCallback((role: MessageRole, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) {
      return
    }

    setMessages((prev) => {
      const next = [...prev, createTranscriptMessage(role, trimmed)]
      if (next.length > MAX_VISIBLE_MESSAGES) {
        return next.slice(next.length - MAX_VISIBLE_MESSAGES)
      }
      return next
    })
  }, [])

  const handleAgentChatResponsePart = useCallback(
    (event: AgentChatResponsePartEvent) => {
      const stage = event.text_response_part?.type ?? 'delta'
      const chunk = event.text_response_part?.text ?? ''

      if (stage === 'stop') {
        streamingAgentMessageIdRef.current = null
        return
      }

      if (stage === 'start' || !streamingAgentMessageIdRef.current) {
        const newId = createRandomId('agent')
        streamingAgentMessageIdRef.current = newId
        setMessages((prev) => {
          const next = [...prev, createTranscriptMessage('agent', chunk, newId)]
          if (next.length > MAX_VISIBLE_MESSAGES) {
            return next.slice(next.length - MAX_VISIBLE_MESSAGES)
          }
          return next
        })
        return
      }

      if (stage === 'delta') {
        const targetId = streamingAgentMessageIdRef.current
        setMessages((prev) =>
          prev.map((message) =>
            message.id === targetId
              ? {
                  ...message,
                  text: `${message.text}${chunk}`,
                }
              : message
          )
        )
      }
    },
    []
  )

  const handleIncomingEvent = useCallback(
    (event: IncomingSocketEvent) => {
      switch (event.type) {
        case 'user_transcript':
          appendMessage('user', event.user_transcription_event.user_transcript)
          break
        case 'agent_response':
          appendMessage('agent', event.agent_response_event.agent_response)
          break
        case 'interruption':
          appendMessage('system', 'Agent was interrupted by the user.')
          break
        case 'error':
          setError(event.error_event.message ?? 'Conversation error')
          appendMessage('system', event.error_event.message ?? 'Conversation error')
          break
        default:
          break
      }
    },
    [appendMessage]
  )

  const handleConversationError = useCallback(
    (cause: unknown) => {
      const message =
        cause instanceof Error
          ? cause.message
          : 'The ElevenLabs conversation reported an error.'
      setError(message)
      appendMessage('system', message)
    },
    [appendMessage]
  )

  const handleStatusChange = useCallback(
    (status: string) => {
      if (status === 'disconnected') {
        streamingAgentMessageIdRef.current = null
        setSessionId(null)
      }
    },
    []
  )

  const normalizeMode = useCallback((value: Mode | { mode?: Mode } | null | undefined) => {
    if (typeof value === 'string') {
      return value
    }

    if (value && typeof value === 'object' && 'mode' in value) {
      const candidate = (value as { mode?: Mode }).mode
      if (typeof candidate === 'string') {
        return candidate
      }
    }

    return 'idle'
  }, [])

  const conversation = useConversation({
    onMessage: handleIncomingEvent,
    onAgentChatResponsePart: handleAgentChatResponsePart,
    onError: handleConversationError,
    onModeChange: (nextMode) => setMode(normalizeMode(nextMode)),
    onStatusChange: handleStatusChange,
  })

  const submitUserMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) {
        return
      }

      if (conversation.status !== 'connected') {
        throw new Error('Connect to the agent before sending messages.')
      }

      conversation.sendUserMessage(trimmed)
      appendMessage('user', trimmed)
    },
    [conversation, appendMessage]
  )

  const scribe = useScribe({
    modelId: 'scribe_v2_realtime',
    commitStrategy: CommitStrategy.AUTOMATIC,
    onPartialTranscript: (data) => {
      const partialText = typeof data.text === 'string' ? data.text : ''
      setScribePartialTranscript(partialText)
    },
    onCommittedTranscript: (data) => {
      setScribePartialTranscript('')
      const committedText = typeof data.text === 'string' ? data.text : ''
      const text = committedText.trim()
      if (!text) {
        return
      }

      try {
        submitUserMessage(text)
        setScribeHistory((prev) => {
          const entry = {
            id: createRandomId('stt'),
            text,
            timestamp: new Date().toISOString(),
          }
          const next = [entry, ...prev]
          return next.slice(0, 5)
        })
      } catch (cause) {
        setScribeError(
          cause instanceof Error ? cause.message : 'Failed to send transcribed text.'
        )
      }
    },
    onError: (event) => {
      const message =
        event instanceof Error
          ? event.message
          : 'The speech-to-text service reported an error.'
      setScribeError(message)
    },
    onDisconnect: () => {
      setScribePartialTranscript('')
    },
  })

  const startConversation = async () => {
    if (!selectedAgentId) {
      setError('Select an agent before starting the conversation.')
      return
    }

    if (!userId) {
      setError('Preparing a user session. Please try again in a moment.')
      return
    }

    setIsStarting(true)
    setError(null)

    try {
      await ensureMicrophoneAccess()
      const token = await fetchConversationToken(selectedAgentId, { userId })
      const fetchedAt = new Date().toISOString()
      setTokenMetadata({ ...token, fetchedAt })

      const id = await conversation.startSession({
        agentId: selectedAgentId,
        conversationToken: token.token,
        connectionType: 'webrtc',
        userId,
      })

      setSessionId(id)
      const agentLabel = selectedAgent?.name ?? selectedAgentId
      appendMessage('system', `Conversation with ${agentLabel} started. Say hello!`)
    } catch (cause) {
      handleConversationError(cause)
    } finally {
      setIsStarting(false)
    }
  }

  const stopConversation = async () => {
    setIsStopping(true)
    try {
      await conversation.endSession()
      appendMessage('system', 'Conversation ended.')
    } catch (cause) {
      handleConversationError(cause)
    } finally {
      streamingAgentMessageIdRef.current = null
      setIsStopping(false)
    }
  }

  const handleSendManualMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = manualMessage.trim()
    if (!trimmed) {
      return
    }

    try {
      submitUserMessage(trimmed)
      setManualMessage('')
    } catch (cause) {
      handleConversationError(cause)
    }
  }

  const startScribeCapture = async () => {
    if (conversation.status !== 'connected') {
      setScribeError('Connect to the agent before starting speech capture.')
      return
    }

    setScribeError(null)
    setIsScribeStarting(true)

    try {
      await ensureMicrophoneAccess()
      const { token } = await fetchScribeToken()
      await scribe.connect({
        token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
    } catch (cause) {
      setScribeError(
        cause instanceof Error ? cause.message : 'Unable to start speech transcription.'
      )
    } finally {
      setIsScribeStarting(false)
    }
  }

  const stopScribeCapture = async () => {
    try {
      await scribe.disconnect()
      setScribePartialTranscript('')
    } catch (cause) {
      setScribeError(
        cause instanceof Error ? cause.message : 'Unable to stop speech transcription.'
      )
    }
  }

  const statusDisplay = useMemo(() => {
    switch (conversation.status) {
      case 'connected':
        return { label: 'Connected', className: 'bg-emerald-500/15 text-emerald-200' }
      case 'connecting':
        return { label: 'Connecting…', className: 'bg-amber-500/15 text-amber-200' }
      case 'error':
        return { label: 'Error', className: 'bg-rose-500/20 text-rose-200' }
      default:
        return { label: 'Disconnected', className: 'bg-slate-800/80 text-slate-300' }
    }
  }, [conversation.status])

  const isConnected = conversation.status === 'connected'
  const scribeStatusDisplay = useMemo(() => {
    switch (scribe.status) {
      case 'transcribing':
        return { label: 'Listening', className: 'bg-emerald-500/10 text-emerald-200' }
      case 'connected':
        return { label: 'Ready', className: 'bg-cyan-500/10 text-cyan-200' }
      case 'connecting':
        return { label: 'Preparing…', className: 'bg-amber-500/10 text-amber-200' }
      case 'error':
        return { label: 'Error', className: 'bg-rose-500/15 text-rose-200' }
      default:
        return { label: 'Idle', className: 'bg-slate-800/80 text-slate-300' }
    }
  }, [scribe.status])

  const isScribeActive = scribe.status === 'connected' || scribe.status === 'transcribing'

  return (
    <section className="rounded-2xl bg-slate-900/70 p-6 shadow-lg ring-1 ring-white/10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Live conversation
        </p>
        <h2 className="text-2xl font-semibold text-white">Talk to your ElevenLabs agent</h2>
        <p className="text-sm text-slate-300">
          Pick any stored agent and click start to establish a secure WebRTC session. The console requests a
          single-use token from <code className="font-mono text-cyan-300">POST /api/agents/conversation-token</code> so
          your ElevenLabs API key never leaves the backend.
        </p>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <div className="space-y-2 rounded-xl border border-white/5 bg-slate-950/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-sm font-semibold text-white">Agent selection</label>
              <button
                type="button"
                onClick={() => agentsQuery.refetch()}
                disabled={agentsQuery.isPending || agentsQuery.isRefetching}
                className="inline-flex items-center rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {agentsQuery.isRefetching ? 'Refreshing…' : 'Refresh list'}
              </button>
            </div>
            <select
              value={selectedAgentId}
              onChange={(event) => setSelectedAgentId(event.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
            >
              <option value="">
                {storedAgents.length === 0 ? 'Create an agent to get started' : 'Select an agent to connect'}
              </option>
              {storedAgents.map((agent) => (
                <option key={agent.agentId} value={agent.agentId}>
                  {formatAgentOptionLabel(agent)}
                </option>
              ))}
              {shouldShowConfiguredAgentOption && TARGET_AGENT_ID && (
                <option value={TARGET_AGENT_ID}>
                  Configured default ({TARGET_AGENT_ID.slice(0, 8)}…)
                </option>
              )}
            </select>
            {agentsQuery.isPending && <p className="text-xs text-slate-400">Loading stored agents…</p>}
            {agentsQuery.isError && (
              <p className="text-xs text-rose-300">
                {agentsQuery.error instanceof Error
                  ? agentsQuery.error.message
                  : 'Unable to load agents. Try refreshing.'}
              </p>
            )}
            {!agentsQuery.isPending && !agentsQuery.isError && storedAgents.length === 0 && (
              <p className="text-xs text-amber-200">
                Provision an agent in the form above to store it for future calls.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startConversation}
              disabled={isConnected || isStarting || !userId || !selectedAgentId}
              className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isStarting ? 'Starting…' : 'Start conversation'}
            </button>

            <button
              type="button"
              onClick={stopConversation}
              disabled={!isConnected || isStopping}
              className="inline-flex items-center rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isStopping ? 'Stopping…' : 'End conversation'}
            </button>

            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusDisplay.className}`}>
              {statusDisplay.label}
            </span>

            <span className="text-xs font-medium text-slate-400">
              Mode: {mode} {conversation.isSpeaking ? '(agent speaking)' : ''}
            </span>
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          )}

          <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Conversation log</h3>
              {sessionId && (
                <span className="text-xs font-mono text-slate-400">
                  Session: {sessionId.slice(0, 8)}…
                </span>
              )}
            </div>
            <div className="mt-4 h-72 overflow-y-auto space-y-3 pr-1">
              {messages.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Logs will appear here once audio is flowing.
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      message.role === 'agent'
                        ? 'bg-emerald-500/10 text-emerald-100'
                        : message.role === 'user'
                          ? 'bg-slate-800/60 text-slate-100'
                          : 'bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide">
                      <span>
                        {message.role === 'agent'
                          ? 'Agent'
                          : message.role === 'user'
                            ? 'You'
                            : 'System'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{message.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <form className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-950/60 p-4" onSubmit={handleSendManualMessage}>
            <label className="text-sm font-medium text-white">Send a text message</label>
            <input
              type="text"
              value={manualMessage}
              onChange={(event) => {
                setManualMessage(event.target.value)
                if (isConnected) {
                  conversation.sendUserActivity()
                }
              }}
              placeholder="Type a follow-up while the microphone is muted…"
              disabled={!isConnected}
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!isConnected || manualMessage.trim().length === 0}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send message
            </button>
          </form>

          <div className="space-y-4 rounded-xl border border-white/5 bg-slate-950/60 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Dictate with speech-to-text</h3>
                <p className="text-sm text-slate-400">
                  Use ElevenLabs Scribe to capture your microphone input and send it as chat
                  messages without typing.
                </p>
              </div>
              <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold sm:mt-0 ${scribeStatusDisplay.className}`}>
                {scribeStatusDisplay.label}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={isScribeActive ? stopScribeCapture : startScribeCapture}
                disabled={isScribeStarting}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
              >
                {isScribeActive
                  ? 'Stop speech capture'
                  : isScribeStarting
                    ? 'Preparing microphone…'
                    : 'Start speech capture'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setScribeHistory([])
                  setScribePartialTranscript('')
                  setScribeError(null)
                }}
                className="inline-flex items-center justify-center rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/30"
              >
                Clear
              </button>
            </div>

            {scribeError && (
              <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                {scribeError}
              </p>
            )}

            {scribePartialTranscript && (
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm text-cyan-100">
                <p className="text-xs uppercase tracking-wide text-cyan-300">Live transcript</p>
                <p className="mt-1 whitespace-pre-wrap">{scribePartialTranscript}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Recent transcriptions
              </p>
              {scribeHistory.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">No transcripts yet.</p>
              ) : (
                <ul className="mt-2 space-y-2 text-sm text-slate-100">
                  {scribeHistory.map((entry) => (
                    <li key={entry.id} className="rounded-lg border border-white/5 bg-slate-900/60 p-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Sent</span>
                        <span className="font-mono">{formatTimestamp(entry.timestamp)}</span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-slate-100">{entry.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-xl border border-white/5 bg-slate-950/50 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Session details
            </p>
            <dl className="mt-3 space-y-2 text-sm text-slate-200">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Agent</dt>
                <dd className="text-right">
                  <p className="font-semibold text-white">{selectedAgent?.name ?? (selectedAgentId ? 'Configured agent' : 'Select an agent')}</p>
                  <p className="font-mono text-xs text-cyan-300">
                    {selectedAgentId ? selectedAgentId : '—'}
                  </p>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Language</dt>
                <dd className="font-semibold text-white">
                  {selectedAgent ? selectedAgent.language.toUpperCase() : '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Voice</dt>
                <dd className="font-mono text-xs text-cyan-300">
                  {selectedAgent?.voiceId ?? '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Model</dt>
                <dd className="font-mono text-xs text-emerald-300">
                  {selectedAgent?.modelId ?? '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">User ID</dt>
                <dd className="font-mono text-xs text-slate-300">
                  {userId ?? 'initializing…'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Active status</dt>
                <dd className="font-semibold">{statusDisplay.label}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Agent mode</dt>
                <dd className="font-semibold capitalize">{mode}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-white/5 bg-slate-900/60 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Token lifecycle</p>
            {tokenMetadata ? (
              <ul className="mt-3 space-y-1 text-xs text-slate-300">
                <li>
                  Granted at:{' '}
                  <span className="font-mono">
                    {formatTimestamp(tokenMetadata.fetchedAt)}
                  </span>
                </li>
                <li>
                  TTL:{' '}
                  {typeof tokenMetadata.ttl === 'number'
                    ? `${tokenMetadata.ttl}s`
                    : 'unknown'}
                </li>
                <li>
                  Expires:{' '}
                  {tokenMetadata.expiresAt
                    ? formatTimestamp(tokenMetadata.expiresAt)
                    : 'Provided by ElevenLabs'}
                </li>
              </ul>
            ) : (
              <p className="mt-2 text-slate-400">
                Tokens are requested lazily when you press start.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            <p className="font-semibold">Heads up</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-50">
              <li>Allow microphone access when prompted.</li>
              <li>
                Prefer wired headphones on desktop browsers to avoid echo cancellation.
              </li>
              <li>
                If speech cuts out, stop the session and start again to mint a fresh token.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}

