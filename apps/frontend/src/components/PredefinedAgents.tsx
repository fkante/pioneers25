import {
  ArrowRight,
  Calendar,
  Globe,
  Heart,
  HelpCircle,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import type { LucideIcon } from 'lucide-react';

type AgentDefinition = {
  id: number;
  name: string;
  icon: LucideIcon;
  industry: string;
  useCase: string;
  tone: string;
  description: string;
  languages: Array<string>;
  color: keyof typeof colorTokens;
};

const industries = [
  'All',
  'E-commerce',
  'Healthcare',
  'Legal',
  'SaaS',
  'Services',
  'Contractors',
] as const;
const useCases = ['All', 'Sales', 'Support', 'Booking'] as const;

const colorTokens = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', accent: 'text-blue-600' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-700', accent: 'text-pink-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', accent: 'text-purple-600' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', accent: 'text-emerald-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', accent: 'text-orange-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', accent: 'text-teal-600' },
};

const PREDEFINED_AGENTS: Array<AgentDefinition> = [
  {
    id: 1,
    name: 'Sales Pro',
    icon: ShoppingBag,
    industry: 'E-commerce',
    useCase: 'Sales',
    tone: 'Confident',
    description:
      'Perfect for e-commerce stores. Handles product questions, upsells, and closes sales in a confident, persuasive tone.',
    languages: ['English', 'Spanish'],
    color: 'blue',
  },
  {
    id: 2,
    name: 'Care Companion',
    icon: Heart,
    industry: 'Healthcare',
    useCase: 'Booking',
    tone: 'Friendly',
    description:
      'Ideal for clinics and senior services. Speaks slowly, kindly, and schedules appointments with empathy.',
    languages: ['English'],
    color: 'pink',
  },
  {
    id: 3,
    name: '24/7 Receptionist',
    icon: Phone,
    industry: 'Legal',
    useCase: 'Support',
    tone: 'Professional',
    description:
      'Answers calls after hours, takes messages, routes urgent requests. Works for law firms, hotels, and offices.',
    languages: ['English', 'French'],
    color: 'purple',
  },
  {
    id: 4,
    name: 'FAQ Ninja',
    icon: HelpCircle,
    industry: 'SaaS',
    useCase: 'Support',
    tone: 'Precise',
    description:
      'Trained on support pages. Answers common implementation questions instantly for SaaS and dev tools.',
    languages: ['English', 'Spanish', 'German'],
    color: 'green',
  },
  {
    id: 5,
    name: 'Booking Boss',
    icon: Calendar,
    industry: 'Services',
    useCase: 'Booking',
    tone: 'Friendly',
    description:
      'Books appointments, confirms times, sends reminders. Used by therapists, salons, and consultants.',
    languages: ['English', 'Spanish'],
    color: 'orange',
  },
  {
    id: 6,
    name: 'Local Expert',
    icon: MapPin,
    industry: 'Contractors',
    useCase: 'Sales',
    tone: 'Calm',
    description:
      'Speaks with regional nuance and local knowledge. Great for contractors, plumbers, and delivery services.',
    languages: ['English'],
    color: 'teal',
  },
];

export function PredefinedAgents() {
  const [industryFilter, setIndustryFilter] = useState<(typeof industries)[number]>('All');
  const [useCaseFilter, setUseCaseFilter] = useState<(typeof useCases)[number]>('All');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');

  const filteredAgents = useMemo(() => {
    return PREDEFINED_AGENTS.filter((agent) => {
      const industryMatch = industryFilter === 'All' || agent.industry === industryFilter;
      const useCaseMatch = useCaseFilter === 'All' || agent.useCase === useCaseFilter;
      return industryMatch && useCaseMatch;
    });
  }, [industryFilter, useCaseFilter]);

  const handleAnalyze = () => {
    if (!url.trim()) {
      return;
    }
    setStatus('analyzing');
    window.setTimeout(() => {
      setStatus('complete');
      window.setTimeout(() => setStatus('idle'), 2500);
    }, 1500);
  };

  return (
    <section className="rounded-[32px] border border-[#dbe3eb] bg-white/90 p-6 shadow-[0_30px_70px_rgba(13,24,33,0.07)] sm:p-10">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6b7a8c]">
              Prebuilt templates
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[#0d1821]">
              Launch with proven agents
            </h2>
            <p className="mt-2 text-sm text-[#4d5c6d]">
              Filter by industry or use case, then drop the agent straight into the creator form.
              These presets mirror the Voiceagent landing page catalogue.
            </p>
          </header>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">
                Filter by industry
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {industries.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setIndustryFilter(option)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      option === industryFilter
                        ? 'border-[#344966] bg-[#344966] text-white'
                        : 'border-[#dbe3eb] text-[#4d5c6d] hover:border-[#344966]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">
                Filter by use case
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {useCases.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setUseCaseFilter(option)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      option === useCaseFilter
                        ? 'border-[#344966] bg-[#344966] text-white'
                        : 'border-[#dbe3eb] text-[#4d5c6d] hover:border-[#344966]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#344966] bg-gradient-to-br from-[#b4cded] to-[#bfcc94] p-6 text-[#0d1821] lg:w-[360px]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1d2b3c]">
            Instant analysis
          </p>
          <h3 className="mt-2 text-2xl font-semibold">Have us draft your custom agent</h3>
          <p className="mt-2 text-sm text-[#1d2b3c]/80">
            Drop in your website and we will outline tone, call flows, and FAQs to feed into Agent
            Creator.
          </p>

          <label className="mt-6 flex flex-col gap-2 text-sm font-medium">
            <span>Website URL</span>
            <div className="relative">
              <Globe
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4d5c6d]"
                size={18}
              />
              <input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://yourbusiness.com"
                className="w-full rounded-2xl border border-white/50 bg-white/70 px-10 py-3 text-sm text-[#0d1821] outline-none ring-[#344966]/20 focus:border-[#344966] focus:ring-2"
              />
            </div>
          </label>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!url.trim() || status === 'analyzing'}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#344966] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(52,73,102,0.45)] transition hover:bg-[#1d2b3c] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'analyzing' ? 'Analyzing…' : 'Analyze my site'}
            {status !== 'analyzing' && <ArrowRight size={18} className="ml-2" />}
          </button>

          <div className="mt-4 rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-[#1d2b3c]">
            {status === 'analyzing' && (
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#344966] border-t-transparent" />
                <span>Scanning services, tone, and FAQs…</span>
              </div>
            )}
            {status === 'complete' && (
              <div className="flex items-center gap-3 text-emerald-600">
                <Sparkles size={18} />
                <span>Insights ready! Paste them into Agent Creator above.</span>
              </div>
            )}
            {status === 'idle' && (
              <p className="text-[#4d5c6d]">
                We’ll summarize the scripts that match your brand once you send a URL.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredAgents.map((agent) => {
          const palette = colorTokens[agent.color];
          const Icon = agent.icon;
          return (
            <article
              key={agent.id}
              className="rounded-[24px] border border-[#dbe3eb] bg-[#f9fbff] p-6 shadow-[0_10px_30px_rgba(13,24,33,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(13,24,33,0.15)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${palette.bg}`}
                >
                  <Icon className={palette.accent} size={24} />
                </div>
                <span className="rounded-full border border-[#dbe3eb] px-3 py-1 text-xs font-semibold text-[#4d5c6d]">
                  {agent.tone}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#0d1821]">{agent.name}</h3>
              <p className="mt-2 text-sm text-[#4d5c6d]">{agent.description}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-[#f0f4ef] px-3 py-1 font-semibold text-[#4d5c6d]">
                  {agent.industry}
                </span>
                <span className="rounded-full bg-[#f0f4ef] px-3 py-1 font-semibold text-[#4d5c6d]">
                  {agent.useCase}
                </span>
              </div>

              <p className="mt-3 text-xs font-medium text-[#6b7a8c]">
                Languages: <span className="font-normal">{agent.languages.join(', ')}</span>
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-[#344966] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d2b3c]"
                >
                  Deploy now
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-full border border-[#dbe3eb] px-4 py-2 text-sm font-semibold text-[#344966] transition hover:border-[#344966]"
                >
                  Preview
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[#dbe3eb] bg-[#f0f4ef] p-5">
        <div className="flex items-center gap-3 text-sm font-medium text-[#0d1821]">
          <Search size={18} />
          <span>{filteredAgents.length} preset agents match your filters.</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setIndustryFilter('All');
            setUseCaseFilter('All');
          }}
          className="rounded-full border border-[#344966] px-4 py-2 text-sm font-semibold text-[#344966] transition hover:bg-[#344966] hover:text-white"
        >
          Reset filters
        </button>
      </div>
    </section>
  );
}
