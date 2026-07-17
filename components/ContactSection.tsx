'use client';

import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { site, telHref, mailHref, whatsappHref } from '@/lib/site';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    // Honeypot: hidden from real users, bots tend to auto-fill it.
    company: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }

      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', company: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Form submission failed:', err);
      setError('אירעה שגיאה בשליחת הפרטים. אנא נסו שוב.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#F4F5F7] px-5 py-16 md:py-24" dir="rtl" id="contact">
      <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-2 lg:gap-16">
        {/* primary action — WhatsApp consultation */}
        <div>
          <h2 className="text-3xl font-extrabold leading-tight text-brand-navy md:text-4xl">
            מוכנים? בואו נדבר
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 md:text-lg">
            שיחת ייעוץ קצרה, בלי התחייבות. נחזור אליכם תוך 3 שעות.
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 w-full sm:w-auto"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.523 5.27l-.999 3.648 3.965-1.039zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            דברו איתנו בוואטסאפ
          </a>

          {/* secondary — phone + email, visually subordinate */}
          <div className="mt-6 space-y-3 text-sm">
            <a href={telHref} className="flex items-center gap-2 text-gray-600 hover:text-brand-navy">
              <Phone className="h-4 w-4 text-brand-blue" strokeWidth={2} />
              <span dir="ltr">{site.phoneDisplay}</span>
            </a>
            <a href={mailHref} className="flex items-center gap-2 text-gray-600 hover:text-brand-navy">
              <Mail className="h-4 w-4 text-brand-blue" strokeWidth={2} />
              <span dir="ltr">{site.email}</span>
            </a>
          </div>
        </div>

        {/* alternative — leave details */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <p className="mb-5 text-base font-bold text-brand-navy">או השאירו פרטים ונחזור אליכם</p>

          <div className="space-y-4">
            {/* Honeypot — hidden from humans, bots fill it. */}
            <div
              aria-hidden="true"
              className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden opacity-0"
            >
              <label htmlFor="company">Company (leave empty)</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-gray-700">
                שם מלא
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                placeholder="השם שלכם"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-gray-700">
                טלפון
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                placeholder="050-0000000"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                אימייל
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                placeholder="name@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'שולח…' : submitted ? 'קיבלנו, תודה!' : 'שליחה'}
            </button>

            {error && <p className="text-center text-sm font-semibold text-rose-600">{error}</p>}

            {submitted && (
              <p className="text-center text-sm font-semibold text-emerald-600">
                נשלח בהצלחה — נחזור אליכם בקרוב.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
