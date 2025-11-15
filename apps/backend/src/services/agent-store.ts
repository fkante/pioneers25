import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { TtsConversationalModel } from '@elevenlabs/elevenlabs-js/api/types/TtsConversationalModel';

import type { AgentLanguage } from './elevenlabs-agents.js';

const dataFileUrl = new URL('../../data/agents.json', import.meta.url);
const DATA_FILE_PATH = fileURLToPath(dataFileUrl);
const DATA_DIR_PATH = path.dirname(DATA_FILE_PATH);

export type StoredAgentRecord = {
  agentId: string;
  name: string;
  systemPrompt: string;
  firstMessage: string;
  language: AgentLanguage;
  voiceId: string;
  modelId: TtsConversationalModel;
  createdAt: string;
};

const readStore = async (): Promise<StoredAgentRecord[]> => {
  try {
    const payload = await fs.readFile(DATA_FILE_PATH, 'utf8');
    const parsed = JSON.parse(payload);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (entry): entry is StoredAgentRecord =>
          !!entry &&
          typeof entry === 'object' &&
          typeof entry.agentId === 'string' &&
          typeof entry.name === 'string'
      );
    }
    return [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeStore = async (records: StoredAgentRecord[]) => {
  await fs.mkdir(DATA_DIR_PATH, { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(records, null, 2), 'utf8');
};

export const listAgents = async (): Promise<StoredAgentRecord[]> => {
  const records = await readStore();
  return records.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const persistAgentRecord = async (record: StoredAgentRecord): Promise<StoredAgentRecord> => {
  const existingRecords = await readStore();
  const filtered = existingRecords.filter((entry) => entry.agentId !== record.agentId);
  await writeStore([record, ...filtered]);
  return record;
};

