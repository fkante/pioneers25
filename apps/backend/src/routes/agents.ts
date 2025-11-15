import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { z } from 'zod';

import {
  createConversationalAgent,
  requestConversationToken,
  supportedAgentLanguages,
  supportedModelIds,
  supportedVoiceIds,
} from '../services/elevenlabs-agents.js';


export const agentsRouter = Router();

const allowedVoiceIds = Object.values(supportedVoiceIds).flatMap((voices) => Object.values(voices));
const voiceIdEnumValues = allowedVoiceIds as [
  (typeof allowedVoiceIds)[number],
  ...(typeof allowedVoiceIds)[number][],
];

const createAgentSchema = z
  .object({
    name: z.string().min(1, 'Agent name is required'),
    systemPrompt: z.string().min(1, 'System prompt is required'),
    firstMessage: z.string().optional(),
    language: z.enum(supportedAgentLanguages).default('en'),
    voiceId: z.enum(voiceIdEnumValues),
    modelId: z.enum(supportedModelIds).optional(),
  })
  .superRefine((payload, ctx) => {
    const voicesForLanguage = supportedVoiceIds[payload.language];
    if (!voicesForLanguage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Unsupported language "${payload.language}"`,
        path: ['language'],
      });
      return;
    }

    if (!Object.values(voicesForLanguage).includes(payload.voiceId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Voice ID "${payload.voiceId}" is not available for language "${payload.language}".`,
        path: ['voiceId'],
      });
    }
  });

const conversationTokenSchema = z.object({
  agentId: z.string().min(1, 'agentId is required'),
  userId: z
    .string()
    .trim()
    .min(1)
    .optional(),
});

agentsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await createAgentSchema.parseAsync(req.body);

    const agent = await createConversationalAgent({
      name: payload.name,
      systemPrompt: payload.systemPrompt,
      firstMessage: payload.firstMessage,
      language: payload.language,
      voiceId: payload.voiceId,
      modelId: payload.modelId,
    });

    res.status(201).json({
      agentId: agent.agentId,
      name: payload.name,
      language: agent.language,
      voiceId: agent.voiceId,
      firstMessage: agent.firstMessage,
      modelId: agent.modelId,
    });
  } catch (error) {
    next(error);
  }
});

agentsRouter.post('/conversation-token', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await conversationTokenSchema.parseAsync(req.body);

    const token = await requestConversationToken({
      agentId: payload.agentId,
      userId: payload.userId,
    });

    res.json(token);
  } catch (error) {
    next(error);
  }
});
