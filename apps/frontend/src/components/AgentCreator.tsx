import {
  AGENT_LANGUAGES,
  AGENT_MODELS,
  DEFAULT_SYSTEM_PROMPT,
  getDefaultVoiceId,
  getLanguageVoiceOptions,
} from '@/lib/agent-options';
import type { AgentLanguage, AgentModelId } from '@/lib/agent-options';
import type { ChangeEvent, FormEvent } from 'react';
import { createAgent, fetchAgents } from '@/lib/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AgentResultCard } from './AgentResultCard';
import type { CreateAgentPayload } from '@/lib/api-client';
import { useState } from 'react';

type AgentFormState = {
  name: string;
  systemPrompt: string;
  firstMessage: string;
  language: AgentLanguage;
  modelId: AgentModelId;
  voiceId: string;
};

type AgentCreatorProps = {
  id?: string;
};

const createInitialFormState = (): AgentFormState => {
  const defaultLanguage = AGENT_LANGUAGES[0].value;
  return {
    name: '',
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    firstMessage: '',
    language: defaultLanguage,
    modelId: AGENT_MODELS[0].value,
    voiceId: getDefaultVoiceId(defaultLanguage),
  };
};

export default function AgentCreator({ id }: AgentCreatorProps = {}) {
  const [formState, setFormState] = useState<AgentFormState>(createInitialFormState);
  const [validationError, setValidationError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const agentsQuery = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  const createAgentMutation = useMutation({
    mutationFn: (payload: CreateAgentPayload) => createAgent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setFormState((prev) => ({
        ...prev,
        name: '',
        firstMessage: '',
      }));
    },
  });

  const handleInputChange =
    (field: keyof AgentFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (createAgentMutation.isSuccess || createAgentMutation.isError) {
        createAgentMutation.reset();
      }

      const { value } = event.target;

      setFormState((prev) => {
        if (field === 'language') {
          const nextLanguage = value as AgentLanguage;
          return {
            ...prev,
            language: nextLanguage,
            voiceId: getDefaultVoiceId(nextLanguage),
          };
        }

        return {
          ...prev,
          [field]: value,
        };
      });
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const trimmedName = formState.name.trim();
    const trimmedPrompt = formState.systemPrompt.trim();
    const trimmedFirstMessage = formState.firstMessage.trim();

    if (!trimmedName || !trimmedPrompt) {
      setValidationError('Please provide at least a name and a system prompt.');
      return;
    }

    const payload: CreateAgentPayload = {
      name: trimmedName,
      systemPrompt: trimmedPrompt,
      language: formState.language,
      voiceId: formState.voiceId,
      modelId: formState.modelId,
    };

    if (trimmedFirstMessage) {
      payload.firstMessage = trimmedFirstMessage;
    }

    createAgentMutation.mutate(payload);
  };

  const createdAgents = agentsQuery.data?.agents ?? [];
  const languageVoiceOptions = getLanguageVoiceOptions(formState.language);

  return (
    <section
      id={id}
      className="rounded-[32px] border border-[#dbe3eb] bg-white/90 p-6 shadow-[0_30px_70px_rgba(13,24,33,0.07)] sm:p-8"
    >
      <header className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">
          Conversational AI
        </p>
        <h2 className="text-3xl font-semibold text-[#0d1821]">Spin up an agent</h2>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <form
          className="space-y-5 rounded-[28px] border border-[#dbe3eb] bg-white p-6 shadow-[0_25px_60px_rgba(13,24,33,0.08)]"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-[#0d1821]">Agent name *</span>
              <input
                type="text"
                value={formState.name}
                onChange={handleInputChange('name')}
                placeholder="Enterprise Helper"
                className="rounded-2xl border border-[#dbe3eb] bg-[#f9fbff] px-4 py-3 text-sm text-[#0d1821] outline-none transition focus:border-[#344966] focus:ring-4 focus:ring-[#b4cded]/40"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-[#0d1821]">Language *</span>
              <select
                value={formState.language}
                onChange={handleInputChange('language')}
                className="rounded-2xl border border-[#dbe3eb] bg-[#f9fbff] px-4 py-3 text-sm text-[#0d1821] outline-none transition focus:border-[#344966] focus:ring-4 focus:ring-[#b4cded]/40"
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
            <span className="font-medium text-[#0d1821]">System prompt *</span>
            <textarea
              value={formState.systemPrompt}
              onChange={handleInputChange('systemPrompt')}
              rows={4}
              className="rounded-2xl border border-[#dbe3eb] bg-[#f9fbff] px-4 py-3 text-sm text-[#0d1821] outline-none transition focus:border-[#344966] focus:ring-4 focus:ring-[#b4cded]/40"
            />
            <span className="text-xs text-[#6b7a8c]">
              Describe who the agent is and how they should respond.
            </span>
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-[#0d1821]">First message (optional)</span>
            <textarea
              value={formState.firstMessage}
              onChange={handleInputChange('firstMessage')}
              rows={3}
              placeholder="Hello! How can I help you today?"
              className="rounded-2xl border border-[#dbe3eb] bg-[#f9fbff] px-4 py-3 text-sm text-[#0d1821] outline-none transition focus:border-[#344966] focus:ring-4 focus:ring-[#b4cded]/40"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-[#0d1821]">Model *</span>
              <select
                value={formState.modelId}
                onChange={handleInputChange('modelId')}
                className="rounded-2xl border border-[#dbe3eb] bg-[#f9fbff] px-4 py-3 text-sm text-[#0d1821] outline-none transition focus:border-[#344966] focus:ring-4 focus:ring-[#b4cded]/40"
              >
                {AGENT_MODELS.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-[#0d1821]">Voice *</span>
              <select
                value={formState.voiceId}
                onChange={handleInputChange('voiceId')}
                className="rounded-2xl border border-[#dbe3eb] bg-[#f9fbff] px-4 py-3 text-sm text-[#0d1821] outline-none transition focus:border-[#344966] focus:ring-4 focus:ring-[#b4cded]/40"
              >
                {languageVoiceOptions.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-[#6b7a8c]">
                Switching languages snaps back to the female preset; feel free to toggle to the male
                counterpart if needed.
              </span>
            </label>
          </div>

          {validationError && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {validationError}
            </p>
          )}

          {createAgentMutation.isError && (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {createAgentMutation.error instanceof Error
                ? createAgentMutation.error.message
                : 'Agent creation failed.'}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="inline-flex items-center rounded-full bg-[#344966] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(52,73,102,0.35)] transition hover:bg-[#1d2b3c] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={createAgentMutation.isPending}
            >
              {createAgentMutation.isPending ? 'Creating…' : 'Create agent'}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormState(createInitialFormState());
                setValidationError(null);
                createAgentMutation.reset();
              }}
              className="text-sm font-semibold text-[#344966] underline-offset-4 hover:text-[#0d1821] hover:underline"
            >
              Reset form
            </button>
          </div>

          {createAgentMutation.isSuccess && (
            <p className="text-sm font-semibold text-emerald-600">
              Agent provisioned via ElevenLabs. Check the timeline for details.
            </p>
          )}
        </form>

        <aside className="space-y-5">
          <article className="space-y-4 rounded-[28px] border border-[#dbe3eb] bg-[#f9fbff] p-6">
            <h3 className="text-lg font-semibold text-[#0d1821]">Capabilities overview</h3>
            <div className="space-y-3 text-sm text-[#4d5c6d]">
              <p>
                The backend selects a stable ElevenLabs voice ID from configuration if you do not
                provide one. You can supply multiple IDs to randomize selection on each call.
              </p>
              <p>
                Model choices mirror{' '}
                <code className="rounded bg-white px-2 py-1 font-mono text-xs text-[#344966]">
                  supportedModelIds
                </code>{' '}
                in{' '}
                <code className="rounded bg-white px-2 py-1 font-mono text-xs text-[#344966]">
                  apps/backend
                </code>
                . New options only require updating the shared list in{' '}
                <code className="rounded bg-white px-2 py-1 font-mono text-xs text-[#344966]">
                  agent-options.ts
                </code>
                .
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/60 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">
                  Languages
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[#0d1821]">
                  {AGENT_LANGUAGES.map((language) => (
                    <li
                      key={language.value}
                      className="rounded-2xl border border-[#eef2f6] bg-[#f9fbff] px-3 py-2"
                    >
                      <p className="font-semibold">{language.label}</p>
                      <p className="text-xs text-[#6b7a8c]">{language.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/60 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">
                  Models
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[#0d1821]">
                  {AGENT_MODELS.map((model) => (
                    <li
                      key={model.value}
                      className="rounded-2xl border border-[#eef2f6] bg-[#f9fbff] px-3 py-2"
                    >
                      <p className="font-semibold">{model.label}</p>
                      <p className="text-xs text-[#6b7a8c]">{model.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article className="space-y-4 rounded-[28px] border border-[#dbe3eb] bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">
                  Recent agents
                </p>
                <h3 className="text-lg font-semibold text-[#0d1821]">Creation timeline</h3>
              </div>
              <span className="rounded-full border border-[#eef2f6] px-4 py-1 text-xs font-semibold text-[#344966]">
                {createdAgents.length} created
              </span>
            </div>

            <div className="space-y-4">
              {agentsQuery.isPending && (
                <p className="text-sm text-[#6b7a8c]">Loading stored agents…</p>
              )}

              {agentsQuery.isError && (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {agentsQuery.error instanceof Error
                    ? agentsQuery.error.message
                    : 'Unable to load the agent timeline.'}
                </p>
              )}

              {!agentsQuery.isPending && !agentsQuery.isError && createdAgents.length === 0 && (
                <p className="text-sm text-[#6b7a8c]">
                  Agents you create will show up here with their assigned voice ID, language, and
                  model straight from ElevenLabs.
                </p>
              )}

              {createdAgents.map((agent) => (
                <AgentResultCard key={agent.agentId + agent.createdAt} agent={agent} />
              ))}
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}
