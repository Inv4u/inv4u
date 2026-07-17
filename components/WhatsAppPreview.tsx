const GOLD = '#C9A86C';

export default function WhatsAppPreview() {
  return (
    <section className="bg-[#F4F5F7] px-5 py-16 md:py-24" dir="rtl">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* chat mockup */}
        <div className="order-2 mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 lg:order-1">
          {/* header */}
          <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-[13px] font-bold ring-1 ring-white/25"
              style={{ color: GOLD, fontFamily: "'Frank Ruhl Libre', serif" }}
            >
              ד״י
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold">דנה ויוסי · אישורי הגעה</p>
              <p className="text-[11px] text-white/70">רועי מקליד…</p>
            </div>
            <span className="mr-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold">
              תצוגה מקדימה
            </span>
          </div>

          {/* thread */}
          <div className="space-y-2 bg-[#ECE5DD] px-3 py-4">
            <div className="mx-auto w-max rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-slate-500">
              היום
            </div>

            {/* outgoing invitation */}
            <div className="ms-auto max-w-[86%] rounded-2xl rounded-tr-sm bg-[#DCF8C6] p-3">
              <p className="text-[13px] font-bold text-slate-800">הוזמנתם לחתונה של דנה ויוסי</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-slate-600">
                יום חמישי, 14 באוגוסט · גני האירוע, ראשון לציון
              </p>
              <p className="mt-1.5 text-left text-[10px] text-slate-400">
                11:24 <span className="font-bold text-[#53BDEB]">✓✓</span>
              </p>
            </div>

            {/* incoming — confirmed */}
            <div className="me-auto max-w-[80%] rounded-2xl rounded-tl-sm bg-white p-3">
              <p className="text-[11px] font-bold text-brand-blue">רועי כהן</p>
              <p className="text-[13px] text-slate-700">מגיעים! 2 אנשים</p>
              <p className="text-left text-[10px] text-slate-400">11:26</p>
            </div>

            {/* incoming — maybe (a human imperfection) */}
            <div className="me-auto max-w-[80%] rounded-2xl rounded-tl-sm bg-white p-3">
              <p className="text-[11px] font-bold text-magenta">משפחת לוי</p>
              <p className="text-[13px] text-slate-700">אולי נצליח, נעדכן קרוב לתאריך 🙏</p>
              <p className="text-left text-[10px] text-slate-400">11:31</p>
            </div>

            {/* typing */}
            <div className="me-auto flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-3 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
            </div>
          </div>
        </div>

        {/* copy */}
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl font-extrabold leading-tight text-brand-navy md:text-4xl">
            ההזמנה חיה בתוך וואטסאפ
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-gray-600 md:text-lg">
            האורחים מקבלים ומאשרים באותה שיחה שהם כבר בה — בלי אפליקציה, בלי לינק מסובך.
            כל תשובה נכנסת ישר ללוח הבקרה.
          </p>
        </div>
      </div>
    </section>
  );
}
