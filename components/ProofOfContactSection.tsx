import { CheckCircle2, HelpCircle, PhoneMissed, Lock } from 'lucide-react';

type CallStatus = 'confirmed' | 'maybe' | 'no_answer';

interface CallLogRow {
  name: string;
  time: string;
  status: CallStatus;
  snippet: string;
}

// Illustrative data for the product-preview mockup — not live records.
const log: CallLogRow[] = [
  { name: 'משפחת לוי', time: '21:04', status: 'confirmed', snippet: 'אישרתי הגעה, 2 אנשים' },
  { name: 'דנה כהן', time: '20:47', status: 'confirmed', snippet: 'נגיע בשמחה, תודה' },
  { name: 'יוסי מזרחי', time: '20:29', status: 'maybe', snippet: 'עדיין לא בטוח, נעדכן' },
  { name: 'משפחת פרץ', time: '19:58', status: 'no_answer', snippet: 'אין מענה — AI ינסה שוב מחר' },
];

const statusMeta: Record<
  CallStatus,
  { label: string; icon: typeof CheckCircle2; text: string; bg: string }
> = {
  confirmed: { label: 'אושר', icon: CheckCircle2, text: 'text-emerald-600', bg: 'bg-emerald-50' },
  maybe: { label: 'אולי', icon: HelpCircle, text: 'text-amber-600', bg: 'bg-amber-50' },
  no_answer: { label: 'לא ענה', icon: PhoneMissed, text: 'text-gray-400', bg: 'bg-gray-100' },
};

/**
 * Proof of contact — the market's open wound is that promised RSVP calls are
 * never verifiable. Every AI call here is timestamped and transcribed, so the
 * couple can see who was reached, when, and what they said. Shown as a clearly
 * labelled product preview (not live data). Calm, no competitor mentions.
 */
export default function ProofOfContactSection() {
  return (
    <section className="bg-[#F4F5F7] px-5 py-16 md:py-24" dir="rtl">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* copy */}
        <div className="lg:order-2">
          <h2 className="text-3xl font-extrabold leading-tight text-brand-navy md:text-4xl">
            רואים כל שיחה — מי, מתי, ומה נאמר
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600 md:text-lg">
            כל שיחת AI מתועדת עם חותמת זמן ותמלול. אתם יודעים בדיוק עם מי דיברנו,
            מתי, ומה ענה — בזמן אמת, בלי לבדוק עם אף אחד.
          </p>

          {/* Task 10 — guest data ownership, brief and non-defensive */}
          <p className="mt-6 flex items-start gap-2 text-sm font-medium text-gray-500">
            <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-blue" strokeWidth={2} />
            רשימת המוזמנים שלכם היא שלכם בלבד — אתם שולטים בה.
          </p>
        </div>

        {/* product-preview mockup */}
        <div className="rounded-2xl border border-gray-200 bg-white lg:order-1">
          {/* window chrome */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
            </div>
            <span className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-[11px] font-bold text-brand-blue">
              תצוגה מקדימה
            </span>
          </div>

          {/* log */}
          <ul className="divide-y divide-gray-100">
            {log.map((row) => {
              const meta = statusMeta[row.status];
              const Icon = meta.icon;
              return (
                <li key={row.name} className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${meta.bg} ${meta.text}`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                    <span className="flex-1 truncate text-sm font-bold text-brand-navy">
                      {row.name}
                    </span>
                    <span className={`text-xs font-semibold ${meta.text}`}>{meta.label}</span>
                    <span dir="ltr" className="text-xs tabular-nums text-gray-400">
                      {row.time}
                    </span>
                  </div>
                  <p className="mt-1.5 pr-11 text-sm text-gray-500">
                    <span className="text-gray-300">״</span>
                    {row.snippet}
                    <span className="text-gray-300">״</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
