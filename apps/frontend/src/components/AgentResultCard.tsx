import type { AgentRecord } from '@/lib/api-client';

type AgentResultCardProps = {
  agent: AgentRecord;
};

const formatTimestamp = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));

export function AgentResultCard({ agent }: AgentResultCardProps) {
  return (
    <article className="rounded-2xl border border-[#eef2f6] bg-[#f9fbff] p-5">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">
            Agent
          </p>
          <p className="font-mono text-sm text-[#344966]">{agent.agentId}</p>
        </div>
        <span className="text-xs text-[#6b7a8c]">Created {formatTimestamp(agent.createdAt)}</span>
      </header>

      <dl className="mt-4 grid gap-3 text-sm text-[#0d1821]">
        <div className="flex flex-col gap-1">
          <dt className="text-[#6b7a8c]">System prompt</dt>
          <dd className="max-h-20 overflow-y-auto rounded-2xl border border-[#dbe3eb] bg-white px-3 py-2 text-[#0d1821]">
            {agent.systemPrompt}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#6b7a8c]">Name</dt>
          <dd className="font-semibold">{agent.name}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#6b7a8c]">Language</dt>
          <dd className="font-semibold uppercase">{agent.language}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#6b7a8c]">Voice ID</dt>
          <dd className="font-mono text-xs text-[#344966]">{agent.voiceId}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#6b7a8c]">Model</dt>
          <dd className="font-mono text-xs text-[#1b9c85]">{agent.modelId}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[#6b7a8c]">First message</dt>
          <dd className="rounded-2xl border border-[#dbe3eb] bg-white px-3 py-2 text-[#0d1821]">
            {agent.firstMessage}
          </dd>
        </div>
      </dl>
    </article>
  );
}
