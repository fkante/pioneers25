import type { AgentLanguage } from '../services/elevenlabs-agents.js';
import { createConversationalAgent } from '../services/elevenlabs-agents.js';

type TestScenario = {
  name: string;
  systemPrompt: string;
  language: AgentLanguage;
  firstMessage?: string;
};

const scenarios: TestScenario[] = [
  {
    name: 'Test English Agent',
    systemPrompt: 'You are a knowledgeable, concise English-speaking assistant.',
    language: 'en',
  },
  {
    name: 'Test French Agent',
    systemPrompt: 'Tu es un assistant francophone chaleureux et professionnel.',
    language: 'fr',
    firstMessage: 'Bonjour! Comment puis-je vous aider?',
  },
];

const main = async () => {
  console.log('🚀 Creating sample ElevenLabs conversational agents...\n');

  const results = [];

  for (const scenario of scenarios) {
    console.log(`→ Creating agent: ${scenario.name} (${scenario.language})`);
    const agent = await createConversationalAgent(scenario);
    results.push({ scenario: scenario.name, ...agent });
  }

  console.log('\n✅ Created agents:');
  console.table(
    results.map((agent) => ({
      Scenario: agent.scenario,
      AgentId: agent.agentId,
      Language: agent.language,
      VoiceId: agent.voiceId,
      ModelId: agent.modelId,
      FirstMessage: agent.firstMessage,
    }))
  );
};

main().catch((error) => {
  console.error('❌ Failed to create test agents:', error);
  process.exit(1);
});
