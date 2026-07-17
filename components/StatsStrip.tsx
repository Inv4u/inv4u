import { stats } from '@/lib/stats';

/**
 * Social-proof numbers strip, driven entirely by lib/stats.
 * Renders nothing while the array is empty — no fake numbers.
 */
export default function StatsStrip() {
  if (stats.length === 0) return null;

  return (
    <section className="bg-brand-navy px-5 py-12" dir="rtl">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 text-center">
        {stats.map((s) => (
          <div key={s.label} className="min-w-[8rem]">
            <div dir="ltr" className="text-3xl font-extrabold text-white md:text-4xl">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-slate-300">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
