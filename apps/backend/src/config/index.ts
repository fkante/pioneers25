import 'dotenv/config';

import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.number().default(3000),
    HOST: z.string().default('0.0.0.0'),
    DATABASE_URL: z.string().optional(),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    ELEVENLABS_API_KEY: z.string().min(1, 'ELEVENLABS_API_KEY is required to talk to ElevenLabs'),
    ELEVENLABS_DEFAULT_MODEL_ID: z.string().default('eleven_turbo_v2_5'),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  database: {
    url: env.DATABASE_URL,
  },
  logging: {
    level: env.LOG_LEVEL,
  },
  cors: {
    origin: env.CORS_ORIGIN,
  },
  elevenlabs: {
    apiKey: env.ELEVENLABS_API_KEY,
    defaultModelId: env.ELEVENLABS_DEFAULT_MODEL_ID,
  },
} as const;
