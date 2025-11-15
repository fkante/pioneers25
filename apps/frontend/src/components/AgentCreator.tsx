import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { AgentResultCard } from './AgentResultCard'

import type { ChangeEvent, FormEvent } from 'react'


import type { CreatedAgentRecord } from './AgentResultCard'
import type { AgentLanguage, AgentModelId } from '@/lib/agent-options'
import type { CreateAgentPayload } from '@/lib/api-client'
import { createAgent } from '@/lib/api-client'
import {
  AGENT_LANGUAGES,
  AGENT_MODELS,
  DEFAULT_SYSTEM_PROMPT,
  getDefaultVoiceId,
  getLanguageVoiceOptions,
} from '@/lib/agent-options'

type AgentFormState = {
  name: string
  systemPrompt: string
  firstMessage: string
  language: AgentLanguage
  modelId: AgentModelId
  voiceId: string
}

const createInitialFormState = (): AgentFormState => {
  const defaultLanguage = AGENT_LANGUAGES[0].value
  return {
    name: '',
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    firstMessage: '',
    language: defaultLanguage,
    modelId: AGENT_MODELS[0].value,
    voiceId: getDefaultVoiceId(defaultLanguage),
  }
}

export default function AgentCreator() {
  const [formState, setFormState] = useState<AgentFormState>(createInitialFormState)
  const [createdAgents, setCreatedAgents] = useState<Array<CreatedAgentRecord>>([])
  const [validationError, setValidationError] = useState<string | null>(null)

  const createAgentMutation = useMutation({
    mutationFn: (payload: CreateAgentPayload) => createAgent(payload),
    onSuccess: (agent) => {
      setCreatedAgents((prev) => [{ ...agent, createdAt: new Date().toISOString() }, ...prev])
      setFormState((prev) => ({
        ...prev,
        name: '',
        firstMessage: '',
      }))
    },
  })

  const handleInputChange =
    (field: keyof AgentFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (createAgentMutation.isSuccess || createAgentMutation.isError) {
        createAgentMutation.reset()
      }

      const { value } = event.target

      setFormState((prev) => {
        if (field === 'language') {
          const nextLanguage = value as AgentLanguage
          return {
            ...prev,
            language: nextLanguage,
            voiceId: getDefaultVoiceId(nextLanguage),
          }
        }

        return {
          ...prev,
          [field]: value,
        }
      })
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidationError(null)

    const trimmedName = formState.name.trim()
    const trimmedPrompt = formState.systemPrompt.trim()
    const trimmedFirstMessage = formState.firstMessage.trim()

    if (!trimmedName || !trimmedPrompt) {
      setValidationError('Please provide at least a name and a system prompt.')
      return
    }

    const payload: CreateAgentPayload = {
      name: trimmedName,
      systemPrompt: trimmedPrompt,
      language: formState.language,
      voiceId: formState.voiceId,
      modelId: formState.modelId,
    }

    if (trimmedFirstMessage) {
      payload.firstMessage = trimmedFirstMessage
    }

    createAgentMutation.mutate(payload)
  }

  const languageVoiceOptions = getLanguageVoiceOptions(formState.language)

  return (
    <section className="rounded-2xl bg-slate-900/70 p-6 shadow-lg ring-1 ring-white/10">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Conversational AI</p>
        <h2 className="text-2xl font-semibold text-white">Spin up an ElevenLabs agent</h2>
        <p className="text-sm text-slate-300">
          Submit the form below to call <code className="font-mono text-cyan-300">POST /api/agents</code> on the backend. Each language exposes a
          curated female and male voice, so pick the one that fits your use case before provisioning.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <form className="space-y-5 rounded-xl border border-white/5 bg-slate-950/60 p-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-white">Agent name *</span>
              <input
                type="text"
                value={formState.name}
                onChange={handleInputChange('name')}
                placeholder="Enterprise Helper"
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-white">Language *</span>
              <select
                value={formState.language}
                onChange={handleInputChange('language')}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400"
              >
                {AGENT_LANGUAGES.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label} ({language.value.toUpperCase()})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-white">System prompt *</span>
            <textarea
              value={formState.systemPrompt}
              onChange={handleInputChange('systemPrompt')}
              rows={4}
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
            <span className="text-xs text-slate-400">Describe who the agent is and how they should respond.</span>
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-white">First message (optional)</span>
            <textarea
              value={formState.firstMessage}
              onChange={handleInputChange('firstMessage')}
              rows={3}
              placeholder="Hello! How can I help you today?"
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-white">Model *</span>
              <select
                value={formState.modelId}
                onChange={handleInputChange('modelId')}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400"
              >
                {AGENT_MODELS.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-white">Voice *</span>
              <select
                value={formState.voiceId}
                onChange={handleInputChange('voiceId')}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400"
              >
                {languageVoiceOptions.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-400">
                Switching languages snaps back to the female preset; feel free to toggle to the male counterpart if needed.
              </span>
            </label>
          </div>

          {validationError && (
            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{validationError}</p>
          )}

          {createAgentMutation.isError && (
            <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {(createAgentMutation.error instanceof Error ? createAgentMutation.error.message : 'Agent creation failed.')}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={createAgentMutation.isPending}
            >
              {createAgentMutation.isPending ? 'Creating…' : 'Create agent'}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormState(createInitialFormState())
                setValidationError(null)
                createAgentMutation.reset()
              }}
              className="text-sm font-medium text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
            >
              Reset form
            </button>
          </div>

          {createAgentMutation.isSuccess && (
            <p className="text-sm text-emerald-300">Agent provisioned via ElevenLabs. Check the timeline for details.</p>
          )}
        </form>

        <aside className="space-y-5">
          <article className="space-y-4 rounded-xl border border-white/5 bg-slate-950/40 p-5">
            <h3 className="text-lg font-semibold text-white">Capabilities overview</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                The backend selects a stable ElevenLabs voice ID from configuration if you do not provide one. You can supply multiple IDs to
                randomize selection on each call.
              </p>
              <p>
                Model choices mirror <code className="font-mono text-cyan-300">supportedModelIds</code> in <code className="font-mono text-cyan-300">apps/backend</code>. New
                options only require updating the shared list in <code className="font-mono text-cyan-300">agent-options.ts</code>.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/5 bg-slate-900/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Languages</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-200">
                  {AGENT_LANGUAGES.map((language) => (
                    <li key={language.value} className="rounded bg-slate-950/40 px-2 py-1">
                      <span className="font-mono text-xs text-slate-400">{language.value.toUpperCase()}</span>
                      <p className="text-slate-100">{language.label}</p>
                      <p className="text-xs text-slate-400">{language.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-white/5 bg-slate-900/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Models</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-200">
                  {AGENT_MODELS.map((model) => (
                    <li key={model.value} className="rounded bg-slate-950/40 px-2 py-1">
                      <p className="font-medium text-white">{model.label}</p>
                      <p className="text-xs font-mono text-emerald-300">{model.value}</p>
                      <p className="text-xs text-slate-400">{model.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article className="space-y-4 rounded-xl border border-white/5 bg-slate-950/60 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Recent agents</p>
                <h3 className="text-lg font-semibold text-white">Creation timeline</h3>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                {createdAgents.length} created
              </span>
            </div>

            <div className="space-y-4">
              {createdAgents.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Agents you create will show up here with their assigned voice ID, language, and model straight from ElevenLabs.
                </p>
              ) : (
                createdAgents.map((agent) => <AgentResultCard key={agent.agentId + agent.createdAt} agent={agent} />)
              )}
            </div>
          </article>
        </aside>
      </div>
    </section>
  )
}

