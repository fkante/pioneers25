import { AgentVoiceConsole } from '@/components/AgentVoiceConsole';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console')({
  component: LiveConsolePage,
});

function LiveConsolePage() {
  return (
    <div className="space-y-8 pb-16">
      <AgentVoiceConsole />
    </div>
  );
}
