type Seat = 'taken' | 'maybe' | 'empty';

const GOLD = '#C9A86C';

interface TableData {
  n: number;
  seats: Seat[];
}

// Illustrative preview data — not live records.
const tables: TableData[] = [
  { n: 1, seats: ['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'maybe', 'empty'] },
  { n: 2, seats: ['taken', 'taken', 'taken', 'empty', 'taken', 'taken', 'taken', 'taken'] },
  { n: 3, seats: ['taken', 'taken', 'maybe', 'taken', 'taken', 'empty', 'taken', 'taken'] },
  { n: 4, seats: ['taken', 'empty', 'taken', 'taken', 'taken', 'taken', 'empty', 'maybe'] },
  { n: 5, seats: ['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'taken'] },
  { n: 6, seats: ['taken', 'taken', 'empty', 'taken', 'maybe', 'taken', 'taken', 'empty'] },
];

const seatStyle: Record<Seat, string> = {
  taken: 'bg-white',
  maybe: 'bg-amber-300',
  empty: 'border border-dashed border-white/30',
};

function Table({ n, seats }: TableData) {
  const taken = seats.filter((s) => s === 'taken').length;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        {/* table top */}
        <div
          className="absolute inset-[30%] flex items-center justify-center rounded-full text-sm font-bold text-brand-navy"
          style={{ background: GOLD }}
        >
          {n}
        </div>
        {seats.map((s, i) => {
          const angle = (360 / seats.length) * i;
          return (
            <span
              key={i}
              className={`absolute left-1/2 top-1/2 h-3.5 w-3.5 rounded-full ${seatStyle[s]}`}
              style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-2.6rem)` }}
            />
          );
        })}
      </div>
      <span className="text-xs text-slate-300">
        שולחן {n} · {taken}/{seats.length}
      </span>
    </div>
  );
}

export default function SeatingPreview() {
  return (
    <section className="bg-brand-navy px-5 py-16 md:py-24" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-white md:text-4xl">
              סידור הושבה חכם
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-slate-300 md:text-lg">
              מסדרים אורחים לפי אישורי הגעה אמיתיים. רואים מי ישב, מי עדיין לא, ואיפה יש מקום פנוי.
            </p>
          </div>
          <span className="mt-1 flex-shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white">
            תצוגה מקדימה
          </span>
        </div>

        {/* legend */}
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-white" /> ישבו</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-300" /> אולי</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border border-dashed border-white/40" /> פנוי</span>
        </div>

        {/* tables */}
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6">
          {tables.map((t) => (
            <Table key={t.n} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
