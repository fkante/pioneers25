import { fetchApiInfo, fetchUsers } from '@/lib/api-client';

import { PredefinedAgents } from '@/components/PredefinedAgents';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

const statusStyles = {
  online: {
    label: 'Connected',
    badgeClass:
      'border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_8px_20px_rgba(16,185,129,0.25)]',
  },
  loading: {
    label: 'Connecting…',
    badgeClass:
      'border border-amber-200 bg-amber-50 text-amber-700 shadow-[0_8px_20px_rgba(251,191,36,0.25)]',
  },
  error: {
    label: 'Connection failed',
    badgeClass:
      'border border-rose-200 bg-rose-50 text-rose-700 shadow-[0_8px_20px_rgba(244,63,94,0.25)]',
  },
};

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
  const statusPreset = statusStyles[status as keyof typeof statusStyles] ?? statusStyles.loading;
  const endpoints = apiInfoQuery.data ? Object.entries(apiInfoQuery.data.endpoints) : [];
  const totalUsers = usersQuery.data?.users?.length ?? 0;

  return (
    <div className="space-y-12 pb-16">
      <PredefinedAgents />
    </div>
  );
}
