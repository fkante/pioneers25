import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

type UseCase = {
  industry: string
  problem: string
  solution: string
  image: string
}

const FEATURED_USE_CASES: Array<UseCase> = [
  {
    industry: 'Dentist',
    problem: 'Patients call after hours asking for emergency slots.',
    solution: 'Care Companion + Booking Boss',
    image:
      'https://images.unsplash.com/photo-1758205308179-4e00e0e4060b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    industry: 'E-commerce',
    problem: 'Customers ask about shipping regions and return windows before buying.',
    solution: 'Sales Pro + FAQ Ninja',
    image:
      'https://images.unsplash.com/photo-1658297063569-162817482fb6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    industry: 'Real Estate',
    problem: 'Leads call late at night asking about open houses and tours.',
    solution: 'Local Expert + Booking Boss',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    industry: 'Restaurant',
    problem: 'Reservations are missed, and people want to confirm menus or dietary options.',
    solution: 'Booking Boss + Menu Expert',
    image:
      'https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=1200&q=80',
  },
  {
    industry: 'Law Firm',
    problem: 'Potential clients need immediate consultation scheduling and case intake.',
    solution: 'Professional Guide + Legal Assistant',
    image:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    industry: 'Fitness Studio',
    problem: 'Members call to check class schedules, cancel sessions, or ask about packages.',
    solution: 'Booking Boss + Membership Manager',
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  },
]

const EXPANDED_USE_CASES = [
  {
    heading: 'SaaS startup',
    challenge: 'Free-trial users stall without onboarding guidance.',
    combo: 'FAQ Ninja + Professional Guide',
  },
  {
    heading: 'HVAC contractor',
    challenge: 'Callers need pricing, availability, and emergency info.',
    combo: 'Local Expert + Sales Pro',
  },
  {
    heading: 'Insurance agency',
    challenge: 'Policy holders need claims help 24/7.',
    combo: 'Policy Expert + Care Companion',
  },
  {
    heading: 'Salon & spa',
    challenge: 'Clients book, reschedule, or ask about service packages.',
    combo: 'Booking Boss + Service Expert',
  },
  {
    heading: 'Veterinary clinic',
    challenge: 'Pet owners request appointments and prescription refills.',
    combo: 'Care Companion + Pet Care Assistant',
  },
  {
    heading: 'Property management',
    challenge: 'Tenants report maintenance issues and ask about leases.',
    combo: 'Maintenance Coordinator + Local Expert',
  },
  {
    heading: 'Accounting firm',
    challenge: 'Clients need tax advice, scheduling, and follow-ups.',
    combo: 'Financial Assistant + Professional Guide',
  },
  {
    heading: 'Moving company',
    challenge: 'Customers need quotes, availability, and logistics support.',
    combo: 'Logistics Pro + Sales Expert',
  },
  {
    heading: 'IT support',
    challenge: 'Users report technical issues and expect instant troubleshooting.',
    combo: 'Tech Support + Issue Tracker',
  },
  {
    heading: 'Travel agency',
    challenge: 'Clients ask about packages, destinations, and changes.',
    combo: 'Travel Guide + Booking Boss',
  },
  {
    heading: 'Tutoring service',
    challenge: 'Parents schedule sessions and request progress updates.',
    combo: 'Education Expert + Scheduler',
  },
  {
    heading: 'Event planning',
    challenge: 'Clients coordinate vendors, venues, and last-minute changes.',
    combo: 'Event Coordinator + Booking Pro',
  },
]

export function UseCasesShowcase() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="rounded-[32px] border border-[#dbe3eb] bg-[#f0f4ef] p-6 shadow-[0_30px_70px_rgba(13,24,33,0.07)] sm:p-10">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6b7a8c]">Use cases</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#0d1821]">Real businesses. Real results.</h2>
        <p className="mt-2 text-lg text-[#4d5c6d]">
          Borrow the exact agent pairings we showcase on the marketing site, then tailor them inside your own workspace.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {FEATURED_USE_CASES.map((useCase) => (
          <article key={useCase.industry} className="overflow-hidden rounded-[24px] border border-[#dbe3eb] bg-white shadow-lg">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={useCase.image}
                alt={useCase.industry}
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = 'https://images.unsplash.com/photo-1522199794611-8e3563fd6863?auto=format&fit=crop&w=1200&q=80'
                }}
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-[#0d1821] shadow">
                {useCase.industry}
              </span>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">The challenge</p>
                <p className="mt-1 text-sm text-[#0d1821]">{useCase.problem}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">The solution</p>
                <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#bfcc94] px-3 py-1.5 text-sm font-semibold text-[#0d1821]">
                  {useCase.solution}
                </span>
              </div>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#dbe3eb] px-4 py-2 text-sm font-semibold text-[#344966] transition hover:border-[#344966]"
              >
                View {useCase.industry} playbook
                <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 space-y-4 rounded-[28px] border border-[#dbe3eb] bg-white/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b7a8c]">More examples</p>
            <p className="text-sm text-[#4d5c6d]">Industry pairings we highlight in the full Voiceagent site.</p>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="rounded-full border border-[#344966] px-4 py-2 text-sm font-semibold text-[#344966] transition hover:bg-[#344966] hover:text-white"
          >
            {expanded ? 'Hide list' : 'Show all'}
          </button>
        </div>

        <div className={`grid gap-4 transition-all ${expanded ? 'md:grid-cols-2' : 'md:grid-cols-3'} `}>
          {(expanded ? EXPANDED_USE_CASES : EXPANDED_USE_CASES.slice(0, 6)).map((item) => (
            <div
              key={item.heading}
              className="rounded-2xl border border-[#dbe3eb] bg-[#f9fbff] p-4 text-sm text-[#0d1821] shadow-sm"
            >
              <p className="text-base font-semibold text-[#0d1821]">{item.heading}</p>
              <p className="mt-1 text-xs text-[#6b7a8c]">{item.challenge}</p>
              <span className="mt-3 inline-flex items-center rounded-full bg-[#b4cded] px-3 py-1 text-xs font-semibold text-[#1d2b3c]">
                {item.combo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

