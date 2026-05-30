'use client';

import React, { useState } from 'react';

// Estimate model (tweak freely):
const MINUTES_PER_GUEST = 4; // manual calling, tracking & reminders per guest
const MEAL_COST = 300; // ₪ per plate (2026 Israeli market average for a standard wedding meal)
const WASTE_RATE = 0.08; // share of meals saved thanks to accurate confirmations

function formatILS(n: number) {
  return n.toLocaleString('he-IL', { maximumFractionDigits: 0 });
}

export default function SavingsCalculatorSection() {
  const [guests, setGuests] = useState(300);

  const hoursSaved = Math.round((guests * MINUTES_PER_GUEST) / 60);
  const mealsSaved = Math.round(guests * WASTE_RATE);
  const moneySaved = mealsSaved * MEAL_COST;

  const results = [
    {
      icon: '⏰',
      value: `${hoursSaved}`,
      unit: 'שעות',
      label: 'זמן שתחסכו בניהול האירוע',
      gradient: 'from-brand-blue to-sky',
    },
    {
      icon: '🍽️',
      value: `${mealsSaved}`,
      unit: 'מנות',
      label: 'מנות מיותרות שלא תזמינו',
      gradient: 'from-grape to-magenta',
    },
    {
      icon: '💰',
      value: `₪${formatILS(moneySaved)}`,
      unit: '',
      label: 'כסף שיישאר לכם בכיס',
      gradient: 'from-brand-teal to-emerald-500',
    },
  ];

  return (
    <section className="bg-mesh-light px-4 py-24" dir="rtl" id="calculator">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-brand-teal/15 px-4 py-1.5 text-sm font-bold text-emerald-700">
            מחשבון חיסכון
          </span>
          <h2 className="mt-4 text-4xl font-black text-brand-navy md:text-5xl">
            כמה <span className="text-gradient">תחסכו</span> עם INV4U?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-slate-600">
            הזיזו את הסליידר לפי מספר האורחים וראו את החיסכון בזמן ובכסף
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl md:p-12">
          {/* slider */}
          <div className="mb-10">
            <div className="mb-4 flex items-end justify-between">
              <label htmlFor="guests" className="font-bold text-slate-700">
                מספר אורחים
              </label>
              <span className="text-4xl font-black text-gradient">{guests}</span>
            </div>
            <input
              id="guests"
              type="range"
              min={50}
              max={1000}
              step={10}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-l from-brand-blue via-grape to-magenta accent-grape"
            />
            <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
              <span>50</span>
              <span>1000</span>
            </div>
          </div>

          {/* results */}
          <div className="grid gap-5 sm:grid-cols-3">
            {results.map((r, i) => (
              <div
                key={i}
                className={`rounded-2xl bg-gradient-to-br ${r.gradient} p-6 text-center text-white shadow-lg`}
              >
                <div className="text-3xl">{r.icon}</div>
                <div className="mt-2 text-3xl font-black tabular-nums md:text-4xl">
                  {r.value}
                  {r.unit && <span className="text-lg font-bold"> {r.unit}</span>}
                </div>
                <p className="mt-1 text-sm font-medium text-white/90">{r.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            * הערכה בלבד, מבוססת על ממוצעים בשוק (כ-{MINUTES_PER_GUEST} דק׳ ניהול לאורח,
₪{MEAL_COST} למנה (ממוצע שוק 2026), ~{Math.round(WASTE_RATE * 100)}% מנות עודפות נחסכות).
          </p>

          <div className="mt-8 text-center">
            <a href="#contact" className="btn-primary">
              רוצים להתחיל לחסוך?
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
