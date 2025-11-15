import { createFileRoute } from '@tanstack/react-router';
import AgentCreator from '@/components/AgentCreator';

export const Route = createFileRoute('/agents')({
  component: AgentsPage,
});

function AgentsPage() {
  return (
    <div className="space-y-8 pb-16">
      <AgentCreator />
    </div>
  );
}
