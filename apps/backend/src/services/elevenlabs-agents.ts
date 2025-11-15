import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import type { TtsConversationalModel } from '@elevenlabs/elevenlabs-js/api/types/TtsConversationalModel';

import { config } from '../config/index.js';
import { AppError } from '../middleware/error-handler.js';

export const supportedAgentLanguages = ['en', 'fr', 'es'] as const;
export type AgentLanguage = (typeof supportedAgentLanguages)[number];

export const voiceGenders = ['female', 'male'] as const;
export type VoiceGender = (typeof voiceGenders)[number];

const ELEVENLABS_API_BASE_URL = 'https://api.elevenlabs.io';
const ELEVENLABS_SCRIBE_TOKEN_PATH = '/v1/single-use-token/realtime_scribe';

const languageVoiceCatalog = {
  en: {
    female: 'OYTbf65OHHFELVut7v2H', // Hope English Female
    male: 'gfRt6Z3Z8aTbpLfexQ7N', // Josh English Male
  },
  fr: {
    female: 'FpvROcY4IGWevepmBWO2', // Jessy French Female
    male: 'kENkNtk0xyzG09WW40xE', // Marcel French Male
  },
  es: {
    female: '86V9x9hrQds83qf7zaGn', // Marta Spanish Female
    male: '851ejYcv2BoNPjrkw93G', // Diego Spanish Male
  },
} as const satisfies Record<AgentLanguage, Record<VoiceGender, string>>;

export const supportedVoiceIds = languageVoiceCatalog;

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

const isVoiceIdForLanguage = (language: AgentLanguage, voiceId: string): boolean =>
  voiceGenders.some((gender) => supportedVoiceIds[language]?.[gender] === voiceId);

const resolveVoiceId = (language: AgentLanguage, voiceId: string): string => {
  if (isVoiceIdForLanguage(language, voiceId)) {
    return voiceId;
  }

  throw new AppError(
    400,
    `Voice ID "${voiceId}" is not available for language "${language}". Please pick the female or male preset voice.`
  );
};

type CreateAgentOptions = {
  name: string;
  systemPrompt: string;
  firstMessage?: string;
  language: AgentLanguage;
  voiceId: string;
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
  voiceId,
  modelId,
}: CreateAgentOptions) => {
  const resolvedVoiceId = resolveVoiceId(language, voiceId);
  const resolvedModelId = resolveModelId(modelId);

  try {
    console.log('Creating agent with voiceId:', resolvedVoiceId, 'and modelId:', resolvedModelId);
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
          voiceId: resolvedVoiceId,
          modelId: resolvedModelId,
        },
      },
    });
    console.log('Agent created:', agent);

    return {
      agentId: agent.agentId,
      voiceId: resolvedVoiceId,
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

type ConversationTokenApiResponse = {
  token?: string;
  expires_at?: string;
  expiresAt?: string;
  ttl?: number;
};

type ConversationTokenResult = {
  token: string;
  expiresAt: string | null;
  ttl: number | null;
};

export const requestConversationToken = async ({
  agentId,
  userId,
}: {
  agentId: string;
  userId?: string;
}): Promise<ConversationTokenResult> => {
  if (!agentId) {
    throw new AppError(400, 'agentId is required to request a conversation token.');
  }

  const url = new URL('/v1/convai/conversation/token', ELEVENLABS_API_BASE_URL);
  url.searchParams.set('agent_id', agentId);
  if (userId) {
    url.searchParams.set('user_id', userId);
  }

  try {
    const response = await fetch(url, {
      headers: {
        'xi-api-key': config.elevenlabs.apiKey,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new AppError(
        response.status,
        errorMessage || `Failed to fetch conversation token from ElevenLabs (status ${response.status}).`
      );
    }

    const payload = (await response.json()) as ConversationTokenApiResponse;

    if (!payload?.token) {
      throw new AppError(502, 'ElevenLabs response did not include a conversation token.');
    }

    return {
      token: payload.token,
      expiresAt: payload.expires_at ?? payload.expiresAt ?? null,
      ttl: typeof payload.ttl === 'number' ? payload.ttl : null,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error('Error requesting conversation token from ElevenLabs:', error);
    throw new AppError(
      502,
      'Unable to retrieve conversation token from ElevenLabs. Please try again later.'
    );
  }
};

type ScribeTokenResponse = {
  token?: string;
};

export const requestScribeToken = async (): Promise<{ token: string }> => {
  try {
    const response = await fetch(new URL(ELEVENLABS_SCRIBE_TOKEN_PATH, ELEVENLABS_API_BASE_URL), {
      method: 'POST',
      headers: {
        'xi-api-key': config.elevenlabs.apiKey,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new AppError(
        response.status,
        errorMessage || `Failed to fetch scribe token from ElevenLabs (status ${response.status}).`
      );
    }

    const payload = (await response.json()) as ScribeTokenResponse;

    if (!payload?.token) {
      throw new AppError(502, 'ElevenLabs response did not include a scribe token.');
    }

    return { token: payload.token };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error('Error requesting scribe token from ElevenLabs:', error);
    throw new AppError(
      502,
      'Unable to retrieve scribe token from ElevenLabs. Please try again later.'
    );
  }
};
