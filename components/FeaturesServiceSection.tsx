import Link from 'next/link';
import { features } from '@/lib/features';
import Reveal from './Reveal';

export default function FeaturesServiceSection() {
  return (
    <section className="relative overflow-hidden bg-mesh-light py-24 px-4" dir="rtl" id="features">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 text-center">
          <span className="inline-block rounded-full bg-grape/10 px-4 py-1.5 text-sm font-bold text-grape">
            פתרון מלא מקצה לקצה
          </span>
          <h2 className="mt-4 text-4xl font-black text-brand-navy md:text-5xl">
            מה כולל <span className="text-gradient">השירות</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-slate-600">
            מתחילת התהליך ועד סיומו — לחצו על כל שלב כדי לגלות בדיוק איך זה עובד
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal key={feature.slug} delay={i * 100}>
              <Link
                href={`/features/${feature.slug}`}
                className="group block h-full overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-6 flex items-center gap-4">
                  <span
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    {feature.icon}
                  </span>
                  <div>
                    <h3 className="text-2xl font-black text-brand-navy">{feature.title}</h3>
                    <p className="text-sm font-medium text-slate-500">{feature.tagline}</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {feature.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700">
                      <span
                        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${feature.gradient} text-xs font-bold text-white`}
                      >
                        ✓
                      </span>
                      <span className="font-medium">{b}</span>
                    </li>
                  ))}
                </ul>

                <span className="mt-6 inline-flex items-center gap-1 font-bold text-brand-blue transition-all group-hover:gap-2">
                  גלו עוד
                  <span className="transition-transform group-hover:-translate-x-1">←</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
