import Reveal from './Reveal';

const rows: { without: string; with: string }[] = [
  { without: 'שעות על הטלפון כדי לאסוף אישורי הגעה', with: 'אישורים אוטומטיים בוואטסאפ ובשיחות AI' },
  { without: 'אי-ודאות כמה אורחים באמת יגיעו', with: 'ידיעה מדויקת בזמן אמת מי מגיע' },
  { without: 'מנות מיותרות שמתבזבזות', with: 'הזמנת מנות מדויקת לפי אישורים אמיתיים' },
  { without: 'רשימות אורחים בנייר ובאקסל מבולגן', with: 'דשבורד אחד מסודר לכל האורחים' },
  { without: 'תזכורות ידניות מתישות לכל אורח', with: 'תזכורות אוטומטיות חכמות' },
  { without: 'בלאגן ועומס בכניסה ביום האירוע', with: 'כניסה חלקה עם QR וספירה אוטומטית' },
];

export default function ComparisonSection() {
  return (
    <section className="bg-brand-navy px-4 py-24" dir="rtl" id="comparison">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-14 text-center">
          <h2 className="text-4xl font-black text-white md:text-5xl">
            <span className="text-slate-400">בלי</span> INV4U{' '}
            <span className="text-slate-400">מול</span>{' '}
            <span className="text-gradient-warm">עם</span> INV4U
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-slate-300">
            ההבדל בין אירוע מלחיץ לאירוע שמתנהל בשבילכם
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {/* without */}
          <Reveal>
            <div className="h-full rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-2xl">
                  😩
                </span>
                <h3 className="text-2xl font-black text-slate-300">בלי INV4U</h3>
              </div>
              <ul className="space-y-4">
                {rows.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-sm font-bold text-rose-400">
                      ✗
                    </span>
                    <span className="font-medium line-through decoration-rose-500/40">
                      {r.without}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* with */}
          <Reveal delay={150}>
            <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-grape via-brand-blue to-brand-teal p-8 shadow-2xl">
              <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
              <div className="relative mb-6 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
                  🚀
                </span>
                <h3 className="text-2xl font-black text-white">עם INV4U</h3>
              </div>
              <ul className="relative space-y-4">
                {rows.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-white">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-600">
                      ✓
                    </span>
                    <span className="font-semibold">{r.with}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
