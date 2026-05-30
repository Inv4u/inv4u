import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { features, getFeature } from '@/lib/features';
import Reveal from '@/components/Reveal';
import Header from '@/components/Header';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return { title: 'INV4U' };
  return {
    title: `${feature.title} · INV4U`,
    description: feature.tagline,
  };
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  const others = features.filter((f) => f.slug !== slug);

  return (
    <main className="w-full" dir="rtl">
      <Header />

      {/* hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${feature.gradient} px-4 pt-20 pb-28 text-white`}>
        <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-white/20 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-black/10 blur-3xl animate-blob animation-delay-300" />

        <div className="relative mx-auto max-w-4xl text-center">
          <Link
            href="/#features"
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold ring-1 ring-white/30 transition hover:bg-white/25"
          >
            → חזרה לכל היכולות
          </Link>
          <div className="animate-floaty mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 text-6xl ring-1 ring-white/30">
            {feature.icon}
          </div>
          <h1 className="text-4xl font-black md:text-6xl">{feature.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl font-medium text-white/90">
            {feature.tagline}
          </p>
        </div>
      </section>

      {/* intro + stat */}
      <section className="relative -mt-16 px-4">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-2xl md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-3">
            <p className="text-lg leading-relaxed text-slate-700 md:col-span-2">
              {feature.intro}
            </p>
            <div className={`rounded-2xl bg-gradient-to-br ${feature.gradient} p-6 text-center text-white`}>
              <div className="text-4xl font-black">{feature.stat.value}</div>
              <p className="mt-1 text-sm font-medium text-white/90">{feature.stat.label}</p>
            </div>
          </div>
        </div>
      </section>

      {/* highlights */}
      <section className="bg-mesh-light px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-black text-brand-navy md:text-4xl">
            איך זה <span className="text-gradient">עובד</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {feature.highlights.map((h, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="group h-full rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100 transition hover:-translate-y-2 hover:shadow-2xl">
                  <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-3xl shadow-lg transition-transform group-hover:scale-110`}>
                    {h.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-black text-brand-navy">{h.title}</h3>
                  <p className="leading-relaxed text-slate-600">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mesh px-4 py-20 text-center">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black text-white md:text-4xl">
            רוצים את זה לאירוע שלכם?
          </h2>
          <p className="mt-3 text-lg text-slate-200">השאירו פרטים ונחזור אליכם תוך 3 שעות</p>
          <Link href="/#contact" className="btn-primary mt-8">
            דברו איתנו
          </Link>
        </Reveal>
      </section>

      {/* explore other features */}
      <section className="bg-white px-4 py-16" dir="rtl">
        <div className="mx-auto max-w-5xl">
          <h3 className="mb-8 text-center text-2xl font-black text-brand-navy">
            יכולות נוספות
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {others.map((f) => (
              <Link
                key={f.slug}
                href={`/features/${f.slug}`}
                className="group flex items-center gap-4 rounded-2xl bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-2xl`}>
                  {f.icon}
                </span>
                <span className="font-bold text-brand-navy">{f.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FloatingWhatsApp />
    </main>
  );
}
