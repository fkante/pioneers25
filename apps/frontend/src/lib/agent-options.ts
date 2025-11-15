export const AGENT_LANGUAGES = [
  { value: 'en', label: 'English', description: 'Default global assistant' },
  { value: 'fr', label: 'French', description: 'Francophone audiences' },
  { value: 'es', label: 'Spanish', description: 'Latin American and EU Spanish' },
] as const

export type AgentLanguage = (typeof AGENT_LANGUAGES)[number]['value']

export const AGENT_MODELS = [
  { value: 'eleven_turbo_v2', label: 'Eleven Turbo v2', description: 'Balanced quality & latency' },
  { value: 'eleven_turbo_v2_5', label: 'Eleven Turbo v2.5', description: 'Latest turbo stack' },
  { value: 'eleven_flash_v2', label: 'Eleven Flash v2', description: 'Fast responses' },
  { value: 'eleven_flash_v2_5', label: 'Eleven Flash v2.5', description: 'Fastest + multilingual' },
  { value: 'eleven_multilingual_v2', label: 'Eleven Multilingual v2', description: 'Broader language support' },
  { value: 'eleven_expressive', label: 'Eleven Expressive', description: 'High emotional depth' },
] as const

export type AgentModelId = (typeof AGENT_MODELS)[number]['value']

export const VOICE_GENDERS = ['female', 'male'] as const
export type VoiceGender = (typeof VOICE_GENDERS)[number]

const LANGUAGE_VOICE_OPTIONS = {
  en: {
    female: { id: 'OYTbf65OHHFELVut7v2H', label: 'Hope · English Female' },
    male: { id: 'pNInz6obpgDQGcFmaJgB', label: 'Josh · English Male' },
  },
  fr: {
    female: { id: 'FpvROcY4IGWevepmBWO2', label: 'Jessy · French Female' },
    male: { id: 'kENkNtk0xyzG09WW40xE', label: 'Marcel · French Male' },
  },
  es: {
    female: { id: '86V9x9hrQds83qf7zaGn', label: 'Marta · Spanish Female' },
    male: { id: '3hY5K8BtxzpZyBt5S2Qv', label: 'Diego · Spanish Male' },
  },
} as const satisfies Record<AgentLanguage, Record<VoiceGender, { id: string; label: string }>>

export type AgentVoiceOption = {
  id: string
  label: string
  gender: VoiceGender
  language: AgentLanguage
}

export const getLanguageVoiceOptions = (language: AgentLanguage): Array<AgentVoiceOption> => {
  const catalog = LANGUAGE_VOICE_OPTIONS[language]
  return VOICE_GENDERS.map((gender) => {
    const entry = catalog[gender]
    return {
      id: entry.id,
      label: entry.label,
      gender,
      language,
    }
  })
}

export const getDefaultVoiceId = (language: AgentLanguage) => LANGUAGE_VOICE_OPTIONS[language].female.id

export const DEFAULT_SYSTEM_PROMPT =
  'You are a knowledgeable, friendly voice agent. Keep answers concise and focus on actionable next steps.'

