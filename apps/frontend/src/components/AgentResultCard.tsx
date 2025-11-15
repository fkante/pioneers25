import type { AgentRecord } from '@/lib/api-client'

type AgentResultCardProps = {
  agent: AgentRecord
}

const formatTimestamp = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))

export function AgentResultCard({ agent }: AgentResultCardProps) {
  return (
    <article className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Agent</p>
          <p className="font-mono text-sm text-white">{agent.agentId}</p>
        </div>
        <span className="text-xs text-slate-400">Created {formatTimestamp(agent.createdAt)}</span>
      </header>

      <dl className="mt-4 grid gap-2 text-sm text-slate-200">
        <div className="flex flex-col gap-1">
          <dt className="text-slate-400">System prompt</dt>
          <dd className="rounded-lg bg-slate-900/60 px-3 py-2 text-slate-100">{agent.systemPrompt}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-400">Name</dt>
          <dd className="font-medium text-white">{agent.name}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-400">Language</dt>
          <dd className="font-medium uppercase text-white">{agent.language}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-400">Voice ID</dt>
          <dd className="font-mono text-xs text-cyan-300">{agent.voiceId}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-400">Model</dt>
          <dd className="font-mono text-xs text-emerald-300">{agent.modelId}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-slate-400">First message</dt>
          <dd className="rounded-lg bg-slate-900/60 px-3 py-2 text-slate-100">{agent.firstMessage}</dd>
        </div>
      </dl>
    </article>
  )
}

