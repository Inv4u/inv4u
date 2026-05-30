import { site, telHref, mailHref, whatsappHref } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="bg-[#070A1F] px-4 py-14 text-slate-300" dir="rtl">
      <div className="mx-auto max-w-6xl">
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
              <li><a href="/#calculator" className="hover:text-white">מחשבון חיסכון</a></li>
              <li><a href="/#faq" className="hover:text-white">שאלות נפוצות</a></li>
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
