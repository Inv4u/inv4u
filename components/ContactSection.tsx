'use client';

import React, { useState } from 'react';
import { site, telHref, mailHref, whatsappHref } from '@/lib/site';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    // Honeypot: hidden from real users, bots tend to auto-fill it.
    company: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    <section className="relative overflow-hidden bg-mesh px-4 py-24" dir="rtl" id="contact">
      <div className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-grape/30 blur-3xl animate-blob" />

      <div className="relative mx-auto grid max-w-5xl items-stretch gap-8 lg:grid-cols-2">
        {/* contact info panel */}
        <div className="flex flex-col justify-center text-white">
          <h2 className="text-4xl font-black md:text-5xl">
            מעוניינים? <span className="text-gradient-warm">נדבר</span>
          </h2>
          <p className="mt-4 text-xl text-slate-200">
            השאירו פרטים ונחזור אליכם לשיחת ייעוץ והתאמת חבילה לאירוע שלכם — תוך 3 שעות.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href={telHref}
              className="flex items-center gap-4 rounded-2xl glass p-4 transition hover:bg-white/15"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-sky text-2xl">
                📞
              </span>
              <div>
                <div className="text-sm text-slate-300">חייגו אלינו</div>
                <div dir="ltr" className="text-lg font-black text-white">{site.phoneDisplay}</div>
              </div>
            </a>

            <a
              href={mailHref}
              className="flex items-center gap-4 rounded-2xl glass p-4 transition hover:bg-white/15"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-grape to-magenta text-2xl">
                ✉️
              </span>
              <div>
                <div className="text-sm text-slate-300">כתבו לנו</div>
                <div dir="ltr" className="text-lg font-black text-white">{site.email}</div>
              </div>
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl glass p-4 transition hover:bg-white/15"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366] text-2xl">
                💬
              </span>
              <div>
                <div className="text-sm text-slate-300">וואטסאפ</div>
                <div className="text-lg font-black text-white">שלחו לנו הודעה</div>
              </div>
            </a>
          </div>
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-8 shadow-2xl md:p-10"
        >
          <div className="space-y-5">
            {/* Honeypot — hidden from humans, bots fill it. Not display:none so
                naive bots still see it; pushed off-screen and excluded from a11y. */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden opacity-0" >
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
              <label htmlFor="name" className="mb-2 block font-bold text-slate-800">
                שם מלא
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-medium transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                placeholder="הכנסו את שמכם"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block font-bold text-slate-800">
                מספר טלפון
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-medium transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                placeholder="הכנסו את מספר הטלפון"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block font-bold text-slate-800">
                אימייל
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-medium transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                placeholder="הכנסו את כתובת האימייל"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-gradient-to-r from-brand-blue to-grape py-4 px-6 text-lg font-bold text-white shadow-lg shadow-grape/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-grape/50 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'שולח...'
                : submitted
                ? '🎉 תודה! קיבלנו את הפרטים'
                : 'השאירו פרטים'}
            </button>

            {error && (
              <p className="text-center font-bold text-rose-600">{error}</p>
            )}

            {submitted && (
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 text-center">
                <p className="font-bold text-emerald-700">
                  הודעה נשלחה בהצלחה! נחזור אליכם בקרוב.
                </p>
              </div>
            )}

            <p className="text-center font-medium text-slate-500">
              נחזור אליכם תוך 3 שעות בטלפון
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
