import { testimonials } from '@/lib/testimonials';

/**
 * Customer testimonials, driven entirely by lib/testimonials.
 * Renders nothing while the array is empty — no placeholders, no fake quotes.
 */
export default function TestimonialsSection() {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-white px-5 py-16 md:py-24" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-extrabold text-brand-navy md:text-4xl">
          מה אומרים עלינו
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={`${t.name}-${t.quote.slice(0, 12)}`}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <blockquote className="text-base leading-relaxed text-gray-700 md:text-lg">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 text-sm text-gray-500">
                <span className="font-bold text-brand-navy">{t.name}</span>
                {' · '}
                {t.event}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
