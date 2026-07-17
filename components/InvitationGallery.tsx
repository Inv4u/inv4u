import React from 'react';

/* ------------------------------------------------------------------ *
 *  Invitation gallery — 8 fully typographic designs, each a distinct  *
 *  point of view (not one template recolored). Rendered as CSS/HTML   *
 *  so they stay crisp and editable. No photos, no people.             *
 *  Gold/cream/navy breathe HERE (the editorial moment).               *
 * ------------------------------------------------------------------ */

const GOLD = '#C9A86C';
const GOLD_SOFT = '#E7D7B8';
const GOLD_DEEP = '#9C7C3F';
const CREAM = '#FBF7EF';
const IVORY = '#F6F1E7';
const NAVY = '#0D1B4B';
const BLUSH = '#F1E7E1';

const FRANK = "'Frank Ruhl Libre', serif";
const HEEBO = "'Heebo', sans-serif";
const ASSISTANT = "'Assistant', sans-serif";
const SUEZ = "'Suez One', serif";
const CORMORANT = "'Cormorant Garamond', serif";

// Wrapper: fixed portrait aspect, own background per design.
function Card({
  bg,
  children,
  style,
}: {
  bg: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-lg"
      style={{ background: bg, ...style }}
    >
      {children}
    </div>
  );
}

/* 1 — Classic: serif, gold, formal, symmetrical */
function Classic() {
  return (
    <Card bg={CREAM}>
      <div
        className="m-3 flex flex-1 flex-col items-center justify-center gap-3 border px-4 text-center"
        style={{ borderColor: GOLD_SOFT }}
      >
        <p className="text-[9px] tracking-[0.45em] text-slate-500" style={{ paddingRight: '0.45em' }}>
          הזמנה לחתונה
        </p>
        <div className="flex flex-col items-center leading-none" style={{ fontFamily: FRANK }}>
          <span className="text-[2rem] text-slate-800">רוני</span>
          <span className="my-0.5 text-[1.4rem]" style={{ fontFamily: CORMORANT, color: GOLD }}>
            &amp;
          </span>
          <span className="text-[2rem] text-slate-800">אלון</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-px w-8" style={{ background: GOLD_SOFT }} />
          <span className="text-[7px]" style={{ color: GOLD }}>◆</span>
          <span className="h-px w-8" style={{ background: GOLD_SOFT }} />
        </div>
        <div style={{ fontFamily: FRANK }}>
          <p className="text-[12px] font-medium text-slate-700">שבת · 12 בספטמבר 2026</p>
          <p className="mt-0.5 text-[10px] text-slate-500">אולמי הגן · הרצליה</p>
        </div>
      </div>
    </Card>
  );
}

/* 2 — Modern minimal: sans, navy, airy, asymmetric (left/top aligned) */
function ModernMinimal() {
  return (
    <Card bg="#FFFFFF">
      <div className="flex flex-1 flex-col justify-between p-6" style={{ fontFamily: HEEBO }}>
        <p className="text-[9px] font-bold tracking-[0.3em]" style={{ color: NAVY }}>
          שמרו את התאריך
        </p>
        <div className="leading-[1.1]">
          <div className="text-[2.4rem] font-extrabold" style={{ color: NAVY }}>מאיה</div>
          <div className="text-[2.4rem] font-light" style={{ color: NAVY }}>ליאור</div>
        </div>
        <div>
          <span className="mb-2 block h-px w-10" style={{ background: NAVY }} />
          <p className="text-[11px] font-medium text-slate-600">23.10.2026 · תל אביב</p>
        </div>
      </div>
    </Card>
  );
}

/* 3 — Ornate: deep gold, double frame, corner diamonds, heavy serif */
function Ornate() {
  const corner = 'absolute text-[8px]';
  return (
    <Card bg={IVORY}>
      <div className="absolute inset-2 border" style={{ borderColor: GOLD }} />
      <div className="absolute inset-[0.6rem] border" style={{ borderColor: GOLD_SOFT }} />
      <span className={`${corner} left-2.5 top-2.5`} style={{ color: GOLD }}>◆</span>
      <span className={`${corner} right-2.5 top-2.5`} style={{ color: GOLD }}>◆</span>
      <span className={`${corner} bottom-2.5 left-2.5`} style={{ color: GOLD }}>◆</span>
      <span className={`${corner} bottom-2.5 right-2.5`} style={{ color: GOLD }}>◆</span>

      <div className="flex flex-1 flex-col items-center justify-center gap-2.5 px-6 text-center">
        <p className="text-[9px] tracking-[0.4em]" style={{ color: GOLD_DEEP, paddingRight: '0.4em' }}>
          ברוב שמחה
        </p>
        <div className="flex items-center gap-3 leading-none" style={{ fontFamily: FRANK, fontWeight: 700 }}>
          <span className="text-[1.9rem] text-slate-800">טל</span>
          <span className="text-[1.1rem]" style={{ color: GOLD }}>◆</span>
          <span className="text-[1.9rem] text-slate-800">ניר</span>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: GOLD }}>
          <span className="h-px w-6" style={{ background: GOLD }} />
          <span className="text-[7px]">❖</span>
          <span className="h-px w-6" style={{ background: GOLD }} />
        </div>
        <div style={{ fontFamily: FRANK }}>
          <p className="text-[11px] font-medium text-slate-700">יום שישי · 5 ביוני 2026</p>
          <p className="mt-0.5 text-[10px] text-slate-500">גני וונדרלנד · קיסריה</p>
        </div>
      </div>
    </Card>
  );
}

/* 4 — Editorial: oversized display type, magazine layout, one gold accent */
function Editorial() {
  return (
    <Card bg="#FFFFFF">
      {/* gold vertical bar on the right edge (RTL leading edge) */}
      <span className="absolute right-0 top-0 h-full w-1.5" style={{ background: GOLD }} />
      <div className="flex flex-1 flex-col justify-between py-6 pr-7 pl-4">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold tracking-[0.3em] text-slate-400" style={{ fontFamily: HEEBO }}>
            2026
          </span>
          <span className="text-[8px] tracking-[0.3em] text-slate-400" style={{ fontFamily: CORMORANT }}>
            THE WEDDING
          </span>
        </div>
        <div className="leading-[0.92]" style={{ fontFamily: SUEZ, color: '#1a1a1a' }}>
          <div className="text-[2.7rem]">דנה</div>
          <div className="pr-6 text-[2.7rem]" style={{ color: GOLD }}>עומר</div>
        </div>
        <p className="text-[10px] font-semibold text-slate-600" style={{ fontFamily: HEEBO }}>
          18.07.2026 — הסטודיו, יפו
        </p>
      </div>
    </Card>
  );
}

/* 5 — Soft/romantic: light weights, muted blush, delicate */
function Romantic() {
  return (
    <Card bg={BLUSH}>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-[1.15rem] italic" style={{ fontFamily: CORMORANT, color: GOLD_DEEP }}>
          Save the Date
        </p>
        <div className="flex flex-col items-center gap-1" style={{ fontFamily: ASSISTANT, fontWeight: 300 }}>
          <span className="text-[1.9rem] text-stone-700">שירה</span>
          <span className="text-[0.9rem] text-stone-400">ו</span>
          <span className="text-[1.9rem] text-stone-700">דניאל</span>
        </div>
        <span className="h-px w-16" style={{ background: GOLD_SOFT }} />
        <div style={{ fontFamily: ASSISTANT, fontWeight: 300 }}>
          <p className="text-[11px] text-stone-600">4 בספטמבר 2026</p>
          <p className="mt-0.5 text-[10px] text-stone-500">חוות רונית · השרון</p>
        </div>
      </div>
    </Card>
  );
}

/* 6 — Bold: navy field, cream type, high contrast */
function Bold() {
  return (
    <Card bg={NAVY}>
      <div className="flex flex-1 flex-col justify-between p-6" style={{ fontFamily: HEEBO }}>
        <p className="text-[9px] font-bold tracking-[0.35em]" style={{ color: GOLD }}>
          החתונה של
        </p>
        <div className="text-[2.5rem] font-extrabold leading-[1.05]" style={{ color: CREAM }}>
          <div>עדי</div>
          <div style={{ color: GOLD }}>&amp; רון</div>
        </div>
        <div>
          <span className="mb-2 block h-0.5 w-12" style={{ background: GOLD }} />
          <p className="text-[11px] font-medium" style={{ color: '#CBD1E0' }}>
            30.08.2026 · LAGO, ראשון לציון
          </p>
        </div>
      </div>
    </Card>
  );
}

/* 7 — Bar mitzvah: confident, youthful, navy + gold, single honoree */
function BarMitzvah() {
  return (
    <Card bg="#FFFFFF">
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex items-center gap-2">
          <span className="h-8 w-1" style={{ background: GOLD }} />
          <p className="text-[10px] font-bold tracking-[0.25em]" style={{ color: NAVY, fontFamily: HEEBO }}>
            בר מצווה
          </p>
        </div>
        <div className="leading-none" style={{ fontFamily: SUEZ }}>
          <div className="text-[3rem]" style={{ color: NAVY }}>איתמר</div>
          <div className="mt-1 text-[1.1rem] text-slate-500" style={{ fontFamily: HEEBO, fontWeight: 700 }}>
            עולה לתורה
          </div>
        </div>
        <div style={{ fontFamily: HEEBO }}>
          <span className="mb-2 block h-px w-10" style={{ background: GOLD }} />
          <p className="text-[11px] font-semibold text-slate-700">שבת · 7 בנובמבר 2026</p>
          <p className="text-[10px] text-slate-500">היכל התרבות · פתח תקווה</p>
        </div>
      </div>
    </Card>
  );
}

/* 8 — Brit: gentle, fresh, soft palette, delicate */
function Brit() {
  return (
    <Card bg="#F4F1E9">
      <div className="flex flex-1 flex-col items-center justify-center gap-2.5 px-6 text-center">
        <p className="text-[9px] tracking-[0.35em] text-sky-700/70" style={{ fontFamily: ASSISTANT, fontWeight: 600 }}>
          הזמנה לברית
        </p>
        <p className="text-[11px] text-slate-500" style={{ fontFamily: ASSISTANT, fontWeight: 300 }}>
          שמחים להזמינכם לברית בננו
        </p>
        <h3 className="text-[1.8rem] text-slate-800" style={{ fontFamily: FRANK, fontWeight: 500 }}>
          בשעה טובה
        </h3>
        <div className="flex items-center gap-2">
          <span className="h-px w-7 bg-sky-200" />
          <span className="text-[7px] text-sky-300">✦</span>
          <span className="h-px w-7 bg-sky-200" />
        </div>
        <div style={{ fontFamily: ASSISTANT, fontWeight: 300 }}>
          <p className="text-[11px] text-slate-600">יום שלישי · 9:00 בבוקר</p>
          <p className="mt-0.5 text-[10px] text-slate-500">משפחת כהן · מודיעין</p>
        </div>
      </div>
    </Card>
  );
}

const designs: { id: string; label: string; Comp: React.ComponentType }[] = [
  { id: 'classic', label: 'קלאסי', Comp: Classic },
  { id: 'modern', label: 'מודרני', Comp: ModernMinimal },
  { id: 'ornate', label: 'מפואר', Comp: Ornate },
  { id: 'editorial', label: 'עריכתי', Comp: Editorial },
  { id: 'romantic', label: 'רומנטי', Comp: Romantic },
  { id: 'bold', label: 'נועז', Comp: Bold },
  { id: 'bar', label: 'בר מצווה', Comp: BarMitzvah },
  { id: 'brit', label: 'ברית', Comp: Brit },
];

export default function InvitationGallery() {
  return (
    <section className="bg-[#FAF8F4] py-16 md:py-24" dir="rtl" id="gallery">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-3xl font-extrabold text-brand-navy md:text-4xl">
          הזמנה שנראית כמו שלכם
        </h2>
        <p className="mt-3 max-w-md text-base text-gray-500 md:text-lg">
          כל סגנון מעוצב מאפס — לא תבנית אחת בכמה צבעים. בוחרים כיוון, ומתאימים אותו לאירוע.
        </p>
      </div>

      {/* horizontal scroll on mobile, grid on desktop */}
      <div className="mx-auto mt-10 max-w-6xl">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:grid md:grid-cols-3 md:overflow-visible md:px-5 lg:grid-cols-4">
          {designs.map(({ id, label, Comp }) => (
            <figure
              key={id}
              className="w-52 shrink-0 snap-start sm:w-56 md:w-auto"
            >
              <div className="ring-1 ring-black/5">
                <Comp />
              </div>
              <figcaption className="mt-2 text-center text-xs font-medium text-gray-400">
                {label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
