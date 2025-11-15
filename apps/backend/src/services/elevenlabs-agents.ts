import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import type { TtsConversationalModel } from '@elevenlabs/elevenlabs-js/api/types/TtsConversationalModel';

import { config } from '../config/index.js';
import { AppError } from '../middleware/error-handler.js';

export const supportedAgentLanguages = ['en', 'fr', 'es'] as const;
export type AgentLanguage = (typeof supportedAgentLanguages)[number];

const supportedVoiceIds = {
  en: {
    female: 'OYTbf65OHHFELVut7v2H',
  },
  fr: {
    male: 'kENkNtk0xyzG09WW40xE',
    female: 'FpvROcY4IGWevepmBWO2',
  },
  es: {
    female: '86V9x9hrQds83qf7zaGn',
  },
} as const;

export const supportedModelIds = [
  'eleven_turbo_v2',
  'eleven_turbo_v2_5',
  'eleven_flash_v2',
  'eleven_flash_v2_5',
  'eleven_multilingual_v2',
  'eleven_expressive',
] as const satisfies readonly TtsConversationalModel[];

const defaultFirstMessages: Record<AgentLanguage, string> = {
  en: 'Hello! How can I help you today?',
  fr: "Bonjour! Comment puis-je vous aider aujourd'hui?",
  es: 'Hola! Como puedo ayudarte hoy?',
};

const elevenLabsClient = new ElevenLabsClient({
  apiKey: config.elevenlabs.apiKey,
});

const unique = (voiceIds: string[]) =>
  Array.from(
    new Set(voiceIds.map((voiceId) => voiceId.trim()).filter((voiceId) => voiceId.length > 0))
  );

const getLanguageVoices = (language: AgentLanguage): string[] =>
  Object.values(supportedVoiceIds[language] ?? {});

const selectVoiceId = (language: AgentLanguage, requestedVoiceIds?: string[]): string => {
  const voicePool = unique([
    ...(requestedVoiceIds ?? []),
    ...config.elevenlabs.defaultVoiceIds,
    ...getLanguageVoices(language),
  ]);

  if (!voicePool.length) {
    throw new AppError(
      400,
      'No ElevenLabs voice IDs available. Pass `voiceIds` in the request body, set ELEVENLABS_DEFAULT_VOICE_IDS, or add entries to supportedVoiceIds.'
    );
  }

  const randomIndex = Math.floor(Math.random() * voicePool.length);
  return voicePool[randomIndex]!;
};

type CreateAgentOptions = {
  name: string;
  systemPrompt: string;
  firstMessage?: string;
  language: AgentLanguage;
  voiceIds?: string[];
  modelId?: string;
};

const isSupportedModelId = (value: string): value is TtsConversationalModel =>
  (supportedModelIds as readonly string[]).includes(value);

const resolveModelId = (incoming?: string): TtsConversationalModel => {
  if (incoming) {
    if (isSupportedModelId(incoming)) {
      return incoming;
    }

    throw new AppError(
      400,
      `Unsupported ElevenLabs modelId "${incoming}". Supported values: ${supportedModelIds.join(', ')}`
    );
  }

  const fallback = config.elevenlabs.defaultModelId;

  if (!isSupportedModelId(fallback)) {
    throw new AppError(
      500,
      `Configured ELEVENLABS_DEFAULT_MODEL_ID "${fallback}" is not supported. Please update it to one of: ${supportedModelIds.join(', ')}`
    );
  }

  return fallback;
};

export const createConversationalAgent = async ({
  name,
  systemPrompt,
  firstMessage,
  language,
  voiceIds,
  modelId,
}: CreateAgentOptions) => {
  const voiceId = selectVoiceId(language, voiceIds);
  const resolvedModelId = resolveModelId(modelId);

  try {
    console.log('Creating agent with voiceId:', voiceId, 'and modelId:', resolvedModelId);
    const agent = await elevenLabsClient.conversationalAi.agents.create({
      name,
      conversationConfig: {
        agent: {
          prompt: {
            prompt: systemPrompt,
          },
          firstMessage: firstMessage ?? defaultFirstMessages[language],
          language,
        },
        tts: {
          voiceId,
          modelId: resolvedModelId,
        },
      },
    });
    console.log('Agent created:', agent);

    return {
      agentId: agent.agentId,
      voiceId,
      language,
      firstMessage: firstMessage ?? defaultFirstMessages[language],
      modelId: resolvedModelId,
    };
  } catch (error) {
    console.error('Error creating agent:', error);
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      502,
      'Failed to create agent with ElevenLabs. Please verify your API key and payload.'
    );
  }
};
