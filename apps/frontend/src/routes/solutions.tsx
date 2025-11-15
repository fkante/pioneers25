import { UseCasesShowcase } from '@/components/UseCasesShowcase';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/solutions')({
  component: SolutionsPage,
});

function SolutionsPage() {
  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-[32px] border border-[#dbe3eb] bg-white/90 p-6 shadow-[0_35px_80px_rgba(13,24,33,0.08)] sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#dbe3eb] bg-[#f0f4ef] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#4d5c6d]">
          Customer playbooks
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-[#0d1821]">
          See how teams deploy voice agents today
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-[#4d5c6d]">
          Explore the exact combinations of predefined agents we highlight on the marketing site,
          along with industry-specific challenges and outcomes.
        </p>
      </section>

      <UseCasesShowcase />
    </div>
  );
}
