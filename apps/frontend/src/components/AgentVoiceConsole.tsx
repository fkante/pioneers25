import type { AgentChatResponsePartEvent, IncomingSocketEvent, Mode } from '@elevenlabs/client';
import { CommitStrategy, useConversation, useScribe } from '@elevenlabs/react';
import { fetchAgents, fetchConversationToken, fetchScribeToken } from '@/lib/api-client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { AgentRecord } from '@/lib/api-client';
import type { FormEvent } from 'react';
import { env } from '@/env';
import { useQuery } from '@tanstack/react-query';

const DEFAULT_AGENT_ID = 'agent_6001ka3t5pnefdwbpp31myx7ha69';
const TARGET_AGENT_ID = env.VITE_ELEVENLABS_AGENT_ID;
const INITIAL_AGENT_ID = TARGET_AGENT_ID ?? DEFAULT_AGENT_ID;
const MAX_VISIBLE_MESSAGES = 40;

const formatAgentOptionLabel = (agent: AgentRecord) =>
  `${agent.name} · ${agent.language.toUpperCase()} · ${agent.agentId.slice(0, 8)}…`;

type MessageRole = 'agent' | 'user' | 'system';

type AgentVoiceConsoleProps = {
  id?: string;
};

type TranscriptMessage = {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: string;
};

const formatTimestamp = (value: string) => {
  try {
    return new Date(value).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return value;
  }
};

const createRandomId = (prefix: string) => {
  const generated =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `${prefix}-${generated}`;
};

const createTranscriptMessage = (
  role: MessageRole,
  text: string,
  id = createRandomId(role)
): TranscriptMessage => ({
  id,
  role,
  text,
  timestamp: new Date().toISOString(),
});

const ensureMicrophoneAccess = async () => {
  if (typeof navigator === 'undefined') {
    throw new Error('Microphone access is not supported in this browser.');
  }

  await navigator.mediaDevices.getUserMedia({ audio: true });
};

export function AgentVoiceConsole({ id }: AgentVoiceConsoleProps = {}) {
  const agentsQuery = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });
  const storedAgents = agentsQuery.data?.agents ?? [];

  const [messages, setMessages] = useState<Array<TranscriptMessage>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<string>('idle');
  const [manualMessage, setManualMessage] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(INITIAL_AGENT_ID);
  const [tokenMetadata, setTokenMetadata] = useState<{
    token: string;
    expiresAt: string | null;
    ttl: number | null;
    fetchedAt: string;
  } | null>(null);
  const [scribeError, setScribeError] = useState<string | null>(null);
  const [isScribeStarting, setIsScribeStarting] = useState(false);
  const [scribePartialTranscript, setScribePartialTranscript] = useState('');
  const [scribeHistory, setScribeHistory] = useState<
    Array<{ id: string; text: string; timestamp: string }>
  >([]);

  const streamingAgentMessageIdRef = useRef<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId((current) => current ?? createRandomId('web-user'));
  }, []);

  useEffect(() => {
    if (!selectedAgentId && storedAgents.length > 0) {
      setSelectedAgentId(storedAgents[0].agentId);
    }
  }, [selectedAgentId, storedAgents]);

  const selectedAgent = storedAgents.find((agent) => agent.agentId === selectedAgentId) ?? null;
  const shouldShowConfiguredAgentOption =
    Boolean(TARGET_AGENT_ID) && !storedAgents.some((agent) => agent.agentId === TARGET_AGENT_ID);

  const appendMessage = useCallback((role: MessageRole, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    setMessages((prev) => {
      const next = [...prev, createTranscriptMessage(role, trimmed)];
      if (next.length > MAX_VISIBLE_MESSAGES) {
        return next.slice(next.length - MAX_VISIBLE_MESSAGES);
      }
      return next;
    });
  }, []);

  const handleAgentChatResponsePart = useCallback((event: AgentChatResponsePartEvent) => {
    const stage = event.text_response_part?.type ?? 'delta';
    const chunk = event.text_response_part?.text ?? '';

    if (stage === 'stop') {
      streamingAgentMessageIdRef.current = null;
      return;
    }

    if (stage === 'start' || !streamingAgentMessageIdRef.current) {
      const newId = createRandomId('agent');
      streamingAgentMessageIdRef.current = newId;
      setMessages((prev) => {
        const next = [...prev, createTranscriptMessage('agent', chunk, newId)];
        if (next.length > MAX_VISIBLE_MESSAGES) {
          return next.slice(next.length - MAX_VISIBLE_MESSAGES);
        }
        return next;
      });
      return;
    }

    if (stage === 'delta') {
      const targetId = streamingAgentMessageIdRef.current;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === targetId
            ? {
                ...message,
                text: `${message.text}${chunk}`,
              }
            : message
        )
      );
    }
  }, []);

  const handleIncomingEvent = useCallback(
    (event: IncomingSocketEvent) => {
      switch (event.type) {
        case 'user_transcript':
          appendMessage('user', event.user_transcription_event.user_transcript);
          break;
        case 'agent_response':
          appendMessage('agent', event.agent_response_event.agent_response);
          break;
        case 'interruption':
          appendMessage('system', 'Agent was interrupted by the user.');
          break;
        case 'error':
          setError(event.error_event.message ?? 'Conversation error');
          appendMessage('system', event.error_event.message ?? 'Conversation error');
          break;
        default:
          break;
      }
    },
    [appendMessage]
  );

  const handleConversationError = useCallback(
    (cause: unknown) => {
      const message =
        cause instanceof Error ? cause.message : 'The ElevenLabs conversation reported an error.';
      setError(message);
      appendMessage('system', message);
    },
    [appendMessage]
  );

  const handleStatusChange = useCallback((status: string) => {
    if (status === 'disconnected') {
      streamingAgentMessageIdRef.current = null;
      setSessionId(null);
    }
  }, []);

  const normalizeMode = useCallback((value: Mode | { mode?: Mode } | null | undefined) => {
    if (typeof value === 'string') {
      return value;
    }

    if (value && typeof value === 'object' && 'mode' in value) {
      const candidate = (value as { mode?: Mode }).mode;
      if (typeof candidate === 'string') {
        return candidate;
      }
    }

    return 'idle';
  }, []);

  const conversation = useConversation({
    onMessage: handleIncomingEvent,
    onAgentChatResponsePart: handleAgentChatResponsePart,
    onError: handleConversationError,
    onModeChange: (nextMode) => setMode(normalizeMode(nextMode)),
    onStatusChange: handleStatusChange,
  });

  const submitUserMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }

      if (conversation.status !== 'connected') {
        throw new Error('Connect to the agent before sending messages.');
      }

      conversation.sendUserMessage(trimmed);
      appendMessage('user', trimmed);
    },
    [conversation, appendMessage]
  );

  const scribe = useScribe({
    modelId: 'scribe_v2_realtime',
    commitStrategy: CommitStrategy.AUTOMATIC,
    onPartialTranscript: (data) => {
      const partialText = typeof data.text === 'string' ? data.text : '';
      setScribePartialTranscript(partialText);
    },
    onCommittedTranscript: (data) => {
      setScribePartialTranscript('');
      const committedText = typeof data.text === 'string' ? data.text : '';
      const text = committedText.trim();
      if (!text) {
        return;
      }

      try {
        submitUserMessage(text);
        setScribeHistory((prev) => {
          const entry = {
            id: createRandomId('stt'),
            text,
            timestamp: new Date().toISOString(),
          };
          const next = [entry, ...prev];
          return next.slice(0, 5);
        });
      } catch (cause) {
        setScribeError(cause instanceof Error ? cause.message : 'Failed to send transcribed text.');
      }
    },
    onError: (event) => {
      const message =
        event instanceof Error ? event.message : 'The speech-to-text service reported an error.';
      setScribeError(message);
    },
    onDisconnect: () => {
      setScribePartialTranscript('');
    },
  });

  const startConversation = async () => {
    if (!selectedAgentId) {
      setError('Select an agent before starting the conversation.');
      return;
    }

    if (!userId) {
      setError('Preparing a user session. Please try again in a moment.');
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      await ensureMicrophoneAccess();
      const token = await fetchConversationToken(selectedAgentId, { userId });
      const fetchedAt = new Date().toISOString();
      setTokenMetadata({ ...token, fetchedAt });

      const id = await conversation.startSession({
        agentId: selectedAgentId,
        conversationToken: token.token,
        connectionType: 'webrtc',
        userId,
      });

      setSessionId(id);
      const agentLabel = selectedAgent?.name ?? selectedAgentId;
      appendMessage('system', `Conversation with ${agentLabel} started. Say hello!`);
    } catch (cause) {
      handleConversationError(cause);
    } finally {
      setIsStarting(false);
    }
  };

  const stopConversation = async () => {
    setIsStopping(true);
    try {
      await conversation.endSession();
      appendMessage('system', 'Conversation ended.');
    } catch (cause) {
      handleConversationError(cause);
    } finally {
      streamingAgentMessageIdRef.current = null;
      setIsStopping(false);
    }
  };

  const handleSendManualMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = manualMessage.trim();
    if (!trimmed) {
      return;
    }

    try {
      submitUserMessage(trimmed);
      setManualMessage('');
    } catch (cause) {
      handleConversationError(cause);
    }
  };

  const startScribeCapture = async () => {
    if (conversation.status !== 'connected') {
      setScribeError('Connect to the agent before starting speech capture.');
      return;
    }

    setScribeError(null);
    setIsScribeStarting(true);

    try {
      await ensureMicrophoneAccess();
      const { token } = await fetchScribeToken();
      await scribe.connect({
        token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (cause) {
      setScribeError(
        cause instanceof Error ? cause.message : 'Unable to start speech transcription.'
      );
    } finally {
      setIsScribeStarting(false);
    }
  };

  const stopScribeCapture = async () => {
    try {
      await scribe.disconnect();
      setScribePartialTranscript('');
    } catch (cause) {
      setScribeError(
        cause instanceof Error ? cause.message : 'Unable to stop speech transcription.'
      );
    }
  };

  const statusDisplay = useMemo(() => {
    switch (conversation.status) {
      case 'connected':
        return {
          label: 'Connected',
          className: 'border border-[#b4d38a] bg-[#f5faea] text-[#1f3b26]',
        };
      case 'connecting':
        return {
          label: 'Connecting…',
          className: 'border border-[#fcd9a5] bg-[#fff7ec] text-[#a66b1f]',
        };
      case 'error':
        return { label: 'Error', className: 'border border-rose-200 bg-rose-50 text-rose-600' };
      default:
        return {
          label: 'Disconnected',
          className: 'border border-[#dbe3eb] bg-[#f0f4ef] text-[#4d5c6d]',
        };
    }
  }, [conversation.status]);

  const isConnected = conversation.status === 'connected';
  const scribeStatusDisplay = useMemo(() => {
    switch (scribe.status) {
      case 'transcribing':
        return {
          label: 'Listening',
          className: 'border border-[#b4d38a] bg-[#f5faea] text-[#1f3b26]',
        };
      case 'connected':
        return { label: 'Ready', className: 'border border-[#b4cded] bg-[#f4f8ff] text-[#1d2b3c]' };
      case 'connecting':
        return {
          label: 'Preparing…',
          className: 'border border-[#fcd9a5] bg-[#fff7ec] text-[#a66b1f]',
        };
      case 'error':
        return { label: 'Error', className: 'border border-rose-200 bg-rose-50 text-rose-600' };
      default:
        return { label: 'Idle', className: 'border border-[#dbe3eb] bg-[#f0f4ef] text-[#4d5c6d]' };
    }
  }, [scribe.status]);

  const isScribeActive = scribe.status === 'connected' || scribe.status === 'transcribing';

  return (
    <section
      id={id}
      className="rounded-[32px] border border-[#dbe3eb] bg-white/90 p-6 shadow-[0_30px_70px_rgba(13,24,33,0.07)] sm:p-8"
    >
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">
          Live conversation
        </p>
        <h2 className="text-3xl font-semibold text-[#0d1821]">Talk to your ElevenLabs agent</h2>
        <p className="text-sm text-[#4d5c6d]">
          Pick any stored agent and click start to establish a secure WebRTC session. The console
          requests a single-use token from{' '}
          <code className="rounded bg-[#f0f4ef] px-2 py-1 font-mono text-xs text-[#344966]">
            POST /api/agents/conversation-token
          </code>{' '}
          so your ElevenLabs API key never leaves the backend.
        </p>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <div className="space-y-3 rounded-[24px] border border-[#dbe3eb] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-sm font-semibold text-[#0d1821]">Agent selection</label>
              <button
                type="button"
                onClick={() => agentsQuery.refetch()}
                disabled={agentsQuery.isPending || agentsQuery.isRefetching}
                className="inline-flex items-center rounded-full border border-[#dbe3eb] px-4 py-1.5 text-xs font-semibold text-[#344966] transition hover:border-[#344966] hover:text-[#0d1821] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {agentsQuery.isRefetching ? 'Refreshing…' : 'Refresh list'}
              </button>
            </div>
            <select
              value={selectedAgentId}
              onChange={(event) => setSelectedAgentId(event.target.value)}
              className="w-full rounded-2xl border border-[#dbe3eb] bg-[#f9fbff] px-4 py-3 text-sm text-[#0d1821] outline-none transition focus:border-[#344966] focus:ring-4 focus:ring-[#b4cded]/40"
            >
              <option value="">
                {storedAgents.length === 0
                  ? 'Create an agent to get started'
                  : 'Select an agent to connect'}
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
            {agentsQuery.isPending && (
              <p className="text-xs text-[#6b7a8c]">Loading stored agents…</p>
            )}
            {agentsQuery.isError && (
              <p className="text-xs text-rose-600">
                {agentsQuery.error instanceof Error
                  ? agentsQuery.error.message
                  : 'Unable to load agents. Try refreshing.'}
              </p>
            )}
            {!agentsQuery.isPending && !agentsQuery.isError && storedAgents.length === 0 && (
              <p className="text-xs text-[#bf7b2e]">
                Provision an agent in the form above to store it for future calls.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={startConversation}
              disabled={isConnected || isStarting || !userId || !selectedAgentId}
              className="inline-flex items-center rounded-full bg-[#344966] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(52,73,102,0.35)] transition hover:bg-[#1d2b3c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isStarting ? 'Starting…' : 'Start conversation'}
            </button>

            <button
              type="button"
              onClick={stopConversation}
              disabled={!isConnected || isStopping}
              className="inline-flex items-center rounded-full border border-[#dbe3eb] px-5 py-2.5 text-sm font-semibold text-[#344966] transition hover:border-[#344966] hover:text-[#0d1821] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isStopping ? 'Stopping…' : 'End conversation'}
            </button>

            <span
              className={`rounded-full px-4 py-1.5 text-xs font-semibold ${statusDisplay.className}`}
            >
              {statusDisplay.label}
            </span>

            <span className="text-xs font-medium text-[#6b7a8c]">
              Mode: {mode} {conversation.isSpeaking ? '(agent speaking)' : ''}
            </span>
          </div>

          {error && (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}

          <div className="rounded-[24px] border border-[#dbe3eb] bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#0d1821]">Conversation log</h3>
              {sessionId && (
                <span className="text-xs font-mono text-[#6b7a8c]">
                  Session: {sessionId.slice(0, 8)}…
                </span>
              )}
            </div>
            <div className="mt-4 h-72 space-y-3 overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <p className="text-sm text-[#6b7a8c]">
                  Logs will appear here once audio is flowing.
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-2xl px-3 py-2 text-sm ${
                      message.role === 'agent'
                        ? 'border border-[#b4d38a] bg-[#f5faea] text-[#1f3b26]'
                        : message.role === 'user'
                          ? 'border border-[#dbe3eb] bg-[#f9fbff] text-[#0d1821]'
                          : 'border border-[#dbe3eb] bg-[#f0f4ef] text-[#4d5c6d]'
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
                      <span className="font-mono text-[10px] text-[#6b7a8c]">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{message.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <aside>
          <div className="space-y-4 rounded-[24px] border border-[#dbe3eb] bg-white p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#0d1821]">
                  Dictate with speech-to-text
                </h3>
                <p className="text-sm text-[#6b7a8c]">
                  Use ElevenLabs Scribe to capture your microphone input and send it as chat
                  messages without typing.
                </p>
              </div>
              <span
                className={`mt-2 inline-flex rounded-full px-4 py-1.5 text-xs font-semibold sm:mt-0 ${scribeStatusDisplay.className}`}
              >
                {scribeStatusDisplay.label}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={isScribeActive ? stopScribeCapture : startScribeCapture}
                disabled={isScribeStarting}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[#344966] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(52,73,102,0.35)] transition hover:bg-[#1d2b3c] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
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
                  setScribeHistory([]);
                  setScribePartialTranscript('');
                  setScribeError(null);
                }}
                className="inline-flex items-center justify-center rounded-full border border-[#dbe3eb] px-6 py-3 text-sm font-semibold text-[#344966] transition hover:border-[#344966] hover:text-[#0d1821]"
              >
                Clear
              </button>
            </div>

            {scribeError && (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {scribeError}
              </p>
            )}

            {scribePartialTranscript && (
              <div className="rounded-2xl border border-[#b4cded] bg-[#f4f8ff] p-4 text-sm text-[#0d1821]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#6b7a8c]">Live transcript</p>
                <p className="mt-1 whitespace-pre-wrap">{scribePartialTranscript}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">
                Recent transcriptions
              </p>
              {scribeHistory.length === 0 ? (
                <p className="mt-2 text-sm text-[#6b7a8c]">No transcripts yet.</p>
              ) : (
                <ul className="mt-2 space-y-2 text-sm text-[#0d1821]">
                  {scribeHistory.map((entry) => (
                    <li
                      key={entry.id}
                      className="rounded-2xl border border-[#eef2f6] bg-[#f9fbff] p-3"
                    >
                      <div className="flex items-center justify-between text-xs text-[#6b7a8c]">
                        <span>Sent</span>
                        <span className="font-mono">{formatTimestamp(entry.timestamp)}</span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap">{entry.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="space-y-4 rounded-[28px] border border-[#dbe3eb] bg-white p-6 mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">
              Session details
            </p>
            <dl className="mt-3 space-y-3 text-sm text-[#0d1821]">
              <div className="flex justify-between gap-3">
                <dt className="text-[#6b7a8c]">Agent</dt>
                <dd className="text-right">
                  <p className="font-semibold">
                    {selectedAgent?.name ??
                      (selectedAgentId ? 'Configured agent' : 'Select an agent')}
                  </p>
                  <p className="font-mono text-xs text-[#344966]">
                    {selectedAgentId ? selectedAgentId : '—'}
                  </p>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6b7a8c]">Language</dt>
                <dd className="font-semibold">
                  {selectedAgent ? selectedAgent.language.toUpperCase() : '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6b7a8c]">Voice</dt>
                <dd className="font-mono text-xs text-[#344966]">
                  {selectedAgent?.voiceId ?? '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6b7a8c]">Model</dt>
                <dd className="font-mono text-xs text-[#1b9c85]">
                  {selectedAgent?.modelId ?? '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6b7a8c]">User ID</dt>
                <dd className="font-mono text-xs text-[#6b7a8c]">{userId ?? 'initializing…'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6b7a8c]">Active status</dt>
                <dd className="font-semibold">{statusDisplay.label}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6b7a8c]">Agent mode</dt>
                <dd className="font-semibold capitalize">{mode}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-[#eef2f6] bg-[#f9fbff] p-4 text-sm text-[#0d1821]">
            <p className="font-semibold text-[#0d1821]">Token lifecycle</p>
            {tokenMetadata ? (
              <ul className="mt-3 space-y-1 text-xs text-[#6b7a8c]">
                <li>
                  Granted at:{' '}
                  <span className="font-mono text-[#344966]">
                    {formatTimestamp(tokenMetadata.fetchedAt)}
                  </span>
                </li>
                <li>
                  TTL: {typeof tokenMetadata.ttl === 'number' ? `${tokenMetadata.ttl}s` : 'unknown'}
                </li>
                <li>
                  Expires:{' '}
                  {tokenMetadata.expiresAt
                    ? formatTimestamp(tokenMetadata.expiresAt)
                    : 'Provided by ElevenLabs'}
                </li>
              </ul>
            ) : (
              <p className="mt-2 text-[#6b7a8c]">
                Tokens are requested lazily when you press start.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[#fcd9a5] bg-[#fff7ec] p-4 text-sm text-[#7a4a08]">
            <p className="font-semibold text-[#a66b1f]">Heads up</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Allow microphone access when prompted.</li>
              <li>Prefer wired headphones on desktop browsers to avoid echo cancellation.</li>
              <li>If speech cuts out, stop the session and start again to mint a fresh token.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
