import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import AgentCreator from '@/components/AgentCreator';
import { AgentVoiceConsole } from '@/components/AgentVoiceConsole';
import { BACKEND_API_URL, fetchApiInfo, fetchUsers } from '@/lib/api-client';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  const apiInfoQuery = useQuery({
    queryKey: ['api-info'],
    queryFn: fetchApiInfo,
  });

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const status = apiInfoQuery.isError ? 'error' : apiInfoQuery.isPending ? 'loading' : 'online';

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-slate-900/70 p-6 shadow-lg ring-1 ring-white/10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Backend Connection
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">frontend@frontend</h1>
            <p className="mt-2 text-sm text-slate-300">
              Requests are proxied to{' '}
              <span className="font-mono text-cyan-300">{BACKEND_API_URL}</span>
            </p>
          </div>

          <span
            className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold ${
              status === 'online'
                ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                : status === 'loading'
                  ? 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/30'
                  : 'bg-rose-500/20 text-rose-200 ring-1 ring-rose-500/40'
            }`}
          >
            {status === 'online' && 'Connected'}
            {status === 'loading' && 'Connecting...'}
            {status === 'error' && 'Connection failed'}
          </span>
        </header>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
            <h2 className="text-lg font-semibold text-white">API Overview</h2>

            {apiInfoQuery.isPending && (
              <p className="mt-3 text-sm text-slate-400">Loading API metadata…</p>
            )}

            {apiInfoQuery.isError && (
              <p className="mt-3 text-sm text-rose-300">
                {apiInfoQuery.error instanceof Error
                  ? apiInfoQuery.error.message
                  : 'Unable to contact the backend.'}
              </p>
            )}

            {apiInfoQuery.data && (
              <dl className="mt-4 space-y-3 text-sm text-slate-200">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Message</dt>
                  <dd className="font-medium">{apiInfoQuery.data.message}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Version</dt>
                  <dd className="font-medium">{apiInfoQuery.data.version}</dd>
                </div>
              </dl>
            )}
          </article>

          <article className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
            <h2 className="text-lg font-semibold text-white">Registered Endpoints</h2>

            {apiInfoQuery.data ? (
              <ul className="mt-4 space-y-2 text-sm">
                {Object.entries(apiInfoQuery.data.endpoints).map(([name, path]) => (
                  <li
                    key={name}
                    className="flex items-center justify-between gap-2 rounded-lg bg-slate-900/60 px-3 py-2"
                  >
                    <span className="font-medium capitalize text-slate-200">{name}</span>
                    <code className="rounded bg-slate-950/60 px-2 py-1 font-mono text-xs text-cyan-300">
                      {path}
                    </code>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                {apiInfoQuery.isPending ? 'Fetching routes…' : 'No routes reported.'}
              </p>
            )}
          </article>
        </div>
      </section>

      <AgentCreator />

      <AgentVoiceConsole />

      <section className="rounded-2xl bg-slate-900/70 p-6 shadow-lg ring-1 ring-white/10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Example Data
            </p>
            <h2 className="text-2xl font-semibold text-white">Users from the backend</h2>
          </div>
          <button
            type="button"
            onClick={() => usersQuery.refetch()}
            className="inline-flex items-center rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={usersQuery.isRefetching}
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/5">
          <table className="min-w-full divide-y divide-slate-800/80 text-sm">
            <thead className="bg-slate-950/60 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {usersQuery.isPending && (
                <tr>
                  <td colSpan={3} className="px-4 py-5 text-center text-slate-400">
                    Loading users…
                  </td>
                </tr>
              )}

              {usersQuery.isError && (
                <tr>
                  <td colSpan={3} className="px-4 py-5 text-center text-rose-300">
                    {usersQuery.error instanceof Error
                      ? usersQuery.error.message
                      : 'Failed to load users.'}
                  </td>
                </tr>
              )}

              {usersQuery.data?.users.map((user) => (
                <tr key={user.id} className="bg-slate-950/30">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{user.id}</td>
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-slate-300">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Configure a custom backend URL via <code className="font-mono">VITE_API_BASE_URL</code> in
          <code className="font-mono">apps/frontend/.env</code>.
        </p>
      </section>
    </div>
  );
}
