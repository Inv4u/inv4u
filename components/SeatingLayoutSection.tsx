import React from 'react';

type Status = 'arrived' | 'confirmed' | 'pending' | 'declined';

const statusStyle: Record<Status, { dot: string; glow: string; label: string }> = {
  arrived: {
    dot: 'bg-gradient-to-br from-emerald-300 to-emerald-600',
    glow: 'shadow-[0_0_10px_rgba(16,185,129,0.7)]',
    label: 'הגיעו',
  },
  confirmed: {
    dot: 'bg-gradient-to-br from-sky-300 to-brand-blue',
    glow: 'shadow-[0_0_10px_rgba(26,86,219,0.6)]',
    label: 'אישרו הגעה',
  },
  pending: {
    dot: 'bg-gradient-to-br from-slate-200 to-slate-400',
    glow: '',
    label: 'טרם אישרו',
  },
  declined: {
    dot: 'bg-gradient-to-br from-rose-300 to-rose-500',
    glow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]',
    label: 'לא מגיעים',
  },
};

const legendOrder: Status[] = ['arrived', 'confirmed', 'pending', 'declined'];

interface TableData {
  number: number;
  seats: Status[];
}

const tables: TableData[] = [
  { number: 1, seats: ['arrived', 'arrived', 'confirmed', 'confirmed', 'pending', 'arrived'] },
  { number: 2, seats: ['confirmed', 'arrived', 'pending', 'pending', 'confirmed', 'declined'] },
  { number: 3, seats: ['arrived', 'arrived', 'arrived', 'confirmed', 'arrived', 'confirmed'] },
  { number: 4, seats: ['pending', 'confirmed', 'declined', 'pending', 'arrived', 'pending'] },
  { number: 5, seats: ['arrived', 'confirmed', 'arrived', 'declined', 'confirmed', 'arrived'] },
  { number: 6, seats: ['confirmed', 'pending', 'arrived', 'arrived', 'confirmed', 'pending'] },
];

function Table({ number, seats }: TableData) {
  const total = seats.length;
  return (
    <div className="group relative mx-auto h-28 w-28 transition-transform duration-300 hover:scale-110">
      {/* table top */}
      <div className="absolute inset-[26%] flex items-center justify-center rounded-full bg-gradient-to-br from-[#FFF6E6] to-[#E9C97E] font-black text-[#7A5B12] shadow-[0_6px_16px_rgba(0,0,0,0.45)] ring-1 ring-[#C9A227]/60">
        {number}
      </div>
      {seats.map((status, i) => {
        const angle = (360 / total) * i;
        const s = statusStyle[status];
        return (
          <span
            key={i}
            className={`absolute left-1/2 top-1/2 h-5 w-5 rounded-full border-2 border-white/80 ${s.dot} ${s.glow}`}
            style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-3rem)` }}
          />
        );
      })}
    </div>
  );
}

export default function SeatingLayoutSection() {
  return (
    <section className="bg-mesh px-4 py-24" dir="rtl" id="seating">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-white ring-1 ring-white/20">
            סידור הושבה חכם
          </span>
          <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
            ה<span className="text-gradient-warm">הושבה</span> שמסתדרת לבד
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-slate-200">
            גררו אורחים בין שולחנות, צפו בסטטוס הגעה בצבעים בזמן אמת, ונהלו את כל
            האולם ממסך אחד
          </p>
        </div>

        {/* premium glass stage */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl md:p-12">
          {/* ambient glows */}
          <div className="pointer-events-none absolute -top-24 right-1/4 h-64 w-64 rounded-full bg-grape/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-brand-teal/20 blur-3xl" />

          {/* legend */}
          <div className="relative mb-12 flex flex-wrap justify-center gap-3">
            {legendOrder.map((status) => {
              const s = statusStyle[status];
              return (
                <div
                  key={status}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15"
                >
                  <span className={`h-4 w-4 rounded-full border border-white/70 ${s.dot}`} />
                  <span className="text-sm font-medium text-slate-100">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* tables */}
          <div className="relative grid grid-cols-2 gap-10 md:grid-cols-3 md:gap-12">
            {tables.map((table) => (
              <div key={table.number} className="flex flex-col items-center">
                <Table number={table.number} seats={table.seats} />
                <span className="mt-4 rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-slate-200 ring-1 ring-white/10">
                  שולחן {table.number}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
