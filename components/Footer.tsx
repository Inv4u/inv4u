import { site, telHref, mailHref, whatsappHref } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="bg-[#070A1F] px-4 py-14 text-slate-300" dir="rtl">
      <div className="mx-auto max-w-6xl">
        {/* gentle closing CTA */}
        <div className="mb-12 flex flex-col items-center gap-4 border-b border-white/10 pb-12 text-center sm:flex-row sm:justify-between sm:text-right">
          <div>
            <h3 className="text-2xl font-black text-white md:text-3xl">
              יש לכם שאלה? קבעו שיחה
            </h3>
            <p className="mt-2 text-slate-400">
              נשמח לעזור ולהתאים לכם בדיוק את מה שצריך לאירוע שלכם.
            </p>
          </div>
          <a
            href="/#contact"
            className="flex-shrink-0 rounded-full border-2 border-white/30 px-7 py-3 font-bold text-white transition hover:bg-white hover:text-brand-navy"
          >
            קבעו שיחה
          </a>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-3xl font-black text-white">
              INV<span className="text-gradient-warm">4</span>U
            </div>
            <p className="mt-3 max-w-xs leading-relaxed text-slate-400">
              הטכנולוגיה שמנהלת את האירוע שלך — הזמנות, אישורי הגעה אוטומטיים
              וניהול אורחים, הכל ממקום אחד.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-black text-white">ניווט מהיר</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="/#features" className="hover:text-white">יכולות</a></li>
              <li><a href="/#roadmap" className="hover:text-white">מסלולי אירועים</a></li>
              <li><a href="/#consultation" className="hover:text-white">שיחת ייעוץ</a></li>
              <li><a href="/#faq" className="hover:text-white">שאלות נפוצות</a></li>
              <li><a href="/privacy" className="hover:text-white">מדיניות פרטיות</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-black text-white">צרו קשר</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href={telHref} dir="ltr" className="inline-block hover:text-white">
                  📞 {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={mailHref} dir="ltr" className="inline-block hover:text-white">
                  ✉️ {site.email}
                </a>
              </li>
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  💬 וואטסאפ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} INV4U · כל הזכויות שמורות
        </div>
      </div>
    </footer>
  );
}
