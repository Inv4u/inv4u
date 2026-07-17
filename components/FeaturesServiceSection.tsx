import Link from 'next/link';
import { Sparkles, PhoneCall, QrCode, Images, ArrowLeft, type LucideIcon } from 'lucide-react';
import { getFeature } from '@/lib/features';

// Local Lucide mapping — the marketing data (lib/features) keeps emojis for the
// detail pages, but the homepage chrome uses icons.
const icons: Record<string, LucideIcon> = {
  confirmation: PhoneCall,
  invitation: Sparkles,
  'event-day': QrCode,
  'after-event': Images,
};

// Confirmation leads (the core), then the rest of the lifecycle.
const order = ['confirmation', 'invitation', 'event-day', 'after-event'];

export default function FeaturesServiceSection() {
  const items = order.map((slug) => getFeature(slug)).filter(Boolean);

  return (
    <section className="bg-white px-5 py-16 md:py-24" dir="rtl" id="features">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-extrabold text-brand-navy md:text-4xl">מה כולל השירות</h2>
        <p className="mt-3 max-w-md text-base text-gray-500 md:text-lg">
          כל מה שצריך — מההזמנה ועד היום שאחרי.
        </p>

        {/* asymmetric bento: the core feature is a wide navy card, the rest compact */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((f, i) => {
            if (!f) return null;
            const Icon = icons[f.slug];
            const emphasized = i === 0;

            return (
              <Link
                key={f.slug}
                href={`/features/${f.slug}`}
                className={`group flex flex-col rounded-2xl border p-6 transition-colors ${
                  emphasized
                    ? 'border-brand-navy bg-brand-navy text-white md:col-span-2 md:p-8'
                    : 'border-gray-200 bg-white hover:border-brand-navy/30'
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${emphasized ? 'text-white' : 'text-brand-blue'}`}
                  strokeWidth={2}
                />
                <h3
                  className={`mt-4 font-bold ${
                    emphasized ? 'text-2xl text-white md:text-3xl' : 'text-lg text-brand-navy'
                  }`}
                >
                  {f.title}
                </h3>
                <p
                  className={`mt-1 flex-1 text-sm leading-relaxed ${
                    emphasized ? 'text-slate-300 md:text-base' : 'text-gray-500'
                  }`}
                >
                  {f.tagline}
                </p>
                <span
                  className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${
                    emphasized ? 'text-white' : 'text-brand-blue'
                  }`}
                >
                  פרטים
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
