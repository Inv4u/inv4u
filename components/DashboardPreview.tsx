import { CheckCircle2, HelpCircle, XCircle, Clock } from 'lucide-react';

type Status = 'confirmed' | 'declined' | 'maybe' | 'pending';

const statusMeta: Record<Status, { label: string; text: string; bg: string; icon: typeof CheckCircle2 }> = {
  confirmed: { label: 'אישרו', text: 'text-emerald-600', bg: 'bg-emerald-500', icon: CheckCircle2 },
  declined: { label: 'לא מגיעים', text: 'text-rose-500', bg: 'bg-rose-400', icon: XCircle },
  maybe: { label: 'אולי', text: 'text-amber-600', bg: 'bg-amber-400', icon: HelpCircle },
  pending: { label: 'ממתין', text: 'text-gray-400', bg: 'bg-gray-300', icon: Clock },
};

// Illustrative preview data — not live records.
const summary: { key: Status; count: number }[] = [
  { key: 'confirmed', count: 148 },
  { key: 'declined', count: 24 },
  { key: 'maybe', count: 12 },
  { key: 'pending', count: 31 },
];
const total = summary.reduce((n, s) => n + s.count, 0);

const guests: { name: string; party: number; status: Status }[] = [
  { name: 'משפחת לוי', party: 4, status: 'confirmed' },
  { name: 'דנה כהן', party: 2, status: 'confirmed' },
  { name: 'אבי מזרחי', party: 1, status: 'maybe' },
  { name: 'משפחת פרץ', party: 5, status: 'pending' },
  { name: 'נועה בר', party: 2, status: 'declined' },
];

export default function DashboardPreview() {
  return (
    <section className="bg-white px-5 py-16 md:py-24" dir="rtl">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        {/* copy */}
        <div>
          <h2 className="text-3xl font-extrabold leading-tight text-brand-navy md:text-4xl">
            כל האישורים במקום אחד
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-gray-600 md:text-lg">
            מי אישר, מי עוד לא, וכמה אורחים בסך הכל — מתעדכן בזמן אמת. בלי אקסלים, בלי לספור ביד.
          </p>
        </div>

        {/* dashboard mockup */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <span className="text-sm font-bold text-brand-navy">לוח בקרה · אישורי הגעה</span>
            <span className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-[11px] font-bold text-brand-blue">
              תצוגה מקדימה
            </span>
          </div>

          <div className="p-4">
            {/* stat cards */}
            <div className="grid grid-cols-4 gap-2 text-center">
              {summary.map((s) => {
                const m = statusMeta[s.key];
                return (
                  <div key={s.key} className="rounded-lg border border-gray-100 py-2.5">
                    <div className={`text-xl font-extrabold ${m.text}`}>{s.count}</div>
                    <div className="mt-0.5 text-[10px] text-gray-500">{m.label}</div>
                  </div>
                );
              })}
            </div>

            {/* proportion bar */}
            <div className="mt-4 flex h-2 overflow-hidden rounded-full">
              {summary.map((s) => (
                <span
                  key={s.key}
                  className={statusMeta[s.key].bg}
                  style={{ width: `${(s.count / total) * 100}%` }}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {total} מוזמנים · {Math.round((summary[0].count / total) * 100)}% אישרו
            </p>

            {/* guest list */}
            <ul className="mt-4 divide-y divide-gray-100">
              {guests.map((g) => {
                const m = statusMeta[g.status];
                const Icon = m.icon;
                return (
                  <li key={g.name} className="flex items-center gap-3 py-2.5">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-brand-navy">
                      {g.name.slice(0, 1)}
                    </span>
                    <span className="flex-1 truncate text-sm font-semibold text-brand-navy">
                      {g.name}
                    </span>
                    <span className="text-xs text-gray-400">{g.party} אורחים</span>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${m.text}`}>
                      <Icon className="h-4 w-4" strokeWidth={2.2} />
                      {m.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
