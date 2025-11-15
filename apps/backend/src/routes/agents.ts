import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { z } from 'zod';

import {
  createConversationalAgent,
  supportedAgentLanguages,
  supportedModelIds,
} from '../services/elevenlabs-agents.js';


export const agentsRouter = Router();

const createAgentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  systemPrompt: z.string().min(1, 'System prompt is required'),
  firstMessage: z.string().optional(),
  language: z.enum(supportedAgentLanguages).default('en'),
  voiceIds: z.array(z.string().min(1)).optional(),
  modelId: z.enum(supportedModelIds).optional(),
});

agentsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await createAgentSchema.parseAsync(req.body);

    const agent = await createConversationalAgent({
      name: payload.name,
      systemPrompt: payload.systemPrompt,
      firstMessage: payload.firstMessage,
      language: payload.language,
      voiceIds: payload.voiceIds,
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
