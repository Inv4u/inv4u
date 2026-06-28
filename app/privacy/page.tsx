import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | INV4U",
  description:
    "מדיניות הפרטיות של INV4U: איזה מידע אנו אוספים, כיצד אנו משתמשים בו, אילו שירותי צד שלישי אנו מפעילים ומהן זכויותיך.",
  alternates: {
    canonical: "https://inv4u.vercel.app/privacy",
    languages: {
      "he-IL": "https://inv4u.vercel.app/privacy",
      en: "https://inv4u.vercel.app/privacy/en",
    },
  },
};

const LAST_UPDATED = "28 ביוני 2026";

export default function PrivacyPageHe() {
  return (
    <main className="min-h-screen bg-white text-slate-700" dir="rtl">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-brand-navy">
            INV<span className="text-brand-blue">4</span>U
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              className="text-slate-500 transition hover:text-brand-navy"
            >
              חזרה לאתר
            </Link>
            <Link
              href="/privacy/en"
              className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-600 transition hover:border-brand-blue hover:text-brand-blue"
            >
              English
            </Link>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* Header */}
        <div className="mb-10 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-extrabold text-brand-navy sm:text-4xl">
            מדיניות <span className="text-brand-blue">פרטיות</span>
          </h1>
          <p className="mt-3 text-slate-500">עדכון אחרון: {LAST_UPDATED}</p>
        </div>

        <article className="space-y-2">
          {/* 1. Introduction */}
          <Section title="1. מבוא — מי אנחנו">
            <P>
              INV4U (להלן: &ldquo;אנחנו&rdquo;, &ldquo;אנו&rdquo; או
              &ldquo;השירות&rdquo;) הוא עוסק פטור הרשום בישראל, המספק פלטפורמה
              ליצירת הזמנות דיגיטליות חכמות לאירועים, שליחתן לאורחים, איסוף אישורי
              הגעה וביצוע שיחות מעקב אוטומטיות.
            </P>
            <P>
              בעל העסק והאחראי על המידע הוא מאור יוסף סלם. מדיניות פרטיות זו
              מסבירה איזה מידע אישי אנו אוספים, כיצד אנו משתמשים בו, עם מי אנו
              חולקים אותו ומהן זכויותיך ביחס למידע שלך. המדיניות חלה על אתר
              האינטרנט שלנו בכתובת{" "}
              <A href="https://inv4u.vercel.app">https://inv4u.vercel.app</A> ועל
              כלל השירותים שאנו מציעים דרכו.
            </P>
            <P>
              אנו פועלים בהתאם לחוק הגנת הפרטיות, התשמ&rdquo;א-1981 והתקנות מכוחו,
              וכן בהתאם לעקרונות תקנת הגנת המידע הכללית של האיחוד האירופי (GDPR)
              עבור מבקרים מהאיחוד האירופי.
            </P>
          </Section>

          {/* 2. Information we collect */}
          <Section title="2. המידע שאנו אוספים">
            <P>
              אנו מבחינים בין מידע שאנו אוספים <strong>כיום</strong> לבין מידע
              שאנו מתכננים לאסוף ב<strong>שירותים עתידיים</strong> שטרם הושקו.
            </P>

            <H3>מידע שאנו אוספים כיום</H3>
            <UL>
              <li>
                <strong>פרטי יצירת קשר שאתה מוסר ביוזמתך</strong> דרך טופס יצירת
                הקשר / השארת הפרטים: שם מלא, מספר טלפון וכתובת דוא&rdquo;ל, וכן
                פרטי הפנייה (סוג אירוע, מספר אורחים משוער, תאריך והודעה חופשית).
              </li>
              <li>
                <strong>מידע טכני בסיסי</strong> הנאסף אוטומטית בכל ביקור באתר,
                כמקובל בכל אתר אינטרנט: כתובת IP, סוג הדפדפן ומערכת ההפעלה.
              </li>
              <li>
                <strong>רשומות תשלום וחיוב</strong> — פרטים מינימליים הדרושים
                להפקת קבלות והתאמת תשלומים שתבצע בהעברה בנקאית, בביט או במזומן
                (ראה סעיף &ldquo;תשלומים וחיוב&rdquo;).
              </li>
            </UL>

            <H3>מידע חשבון (בעת הרשמה)</H3>
            <P>
              כאשר אתה יוצר חשבון באתר, אנו אוספים ושומרים את הפרטים הבאים לצורך
              הפעלת החשבון:
            </P>
            <UL>
              <li>
                <strong>שם מלא</strong> שמסרת בעת ההרשמה.
              </li>
              <li>
                <strong>כתובת דוא&rdquo;ל</strong> ו/או <strong>מספר טלפון</strong>{" "}
                המשמשים להתחברות וליצירת קשר לגבי האירוע שלך.
              </li>
              <li>
                <strong>סיסמה</strong> — נשמרת אך ורק בצורה{" "}
                <strong>מוצפנת (hashed)</strong> באמצעות שירות האימות של Supabase.
                לעולם איננו רואים או שומרים את הסיסמה כטקסט גלוי.
              </li>
              <li>
                <strong>פרטי האירוע ורשימת המוזמנים</strong> — לאחר סגירת חבילה,
                כאשר אנו או אתה מזינים את פרטי האירוע (סוג, תאריך, אולם) ואת רשימת
                המוזמנים (שמות וטלפונים). פרטי האורחים מעובדים עבורך ובאחריותך לקבל
                את הסכמת אורחיך לפנייה.
              </li>
            </UL>

            <FutureBox>
              <h3 className="mb-3 text-lg font-bold text-brand-blue">
                שירותים עתידיים — מידע שטרם נאסף
              </h3>
              <p className="mb-3 text-sm text-slate-500">
                הסעיפים הבאים מתארים איסוף מידע המתוכנן לשלבים הבאים של השירות.
                איסוף זה <strong>אינו פעיל כיום</strong>, ויחול עליו עדכון מדיניות
                זו עם השקתו בפועל.
              </p>
              <UL>
                <li>
                  <strong>פרטי אירועים ורשימות אורחים</strong> — עם השקת מודול
                  יצירת האירועים: שמות האורחים ופרטי האירוע שמזין מארגן האירוע.
                </li>
                <li>
                  <strong>פרטי קשר של אורחים</strong> לצורך שליחת הזמנות, בכפוף
                  להסכמת מארגן האירוע ולאחריותו לקבל את הסכמת אורחיו.
                </li>
                <li>
                  <strong>הודעות WhatsApp לאורחי האירוע</strong> שיישלחו באמצעות
                  WhatsApp Business API.
                </li>
                <li>
                  <strong>הקלטות ותמלולים של שיחות קוליות</strong> שיבוצעו כשיחות
                  מעקב אוטומטיות מבוססות בינה מלאכותית לאורחים שלא השיבו.
                </li>
                <li>
                  <strong>תשלומי כרטיס אשראי מקוונים באמצעות Stripe</strong> (ראה
                  סעיף &ldquo;תשלומים וחיוב&rdquo;). נתוני הכרטיס יטופלו על ידי
                  Stripe; לעולם לא נשמור מספרי כרטיס אשראי בשרתינו.
                </li>
              </UL>
            </FutureBox>
          </Section>

          {/* 3. How we use the information */}
          <Section title="3. כיצד אנו משתמשים במידע">
            <UL>
              <li>ליצירת קשר חוזר ומענה לפניות שהשארת דרך הטופס.</li>
              <li>
                <strong>ליצירת חשבונך וניהולו</strong>, לאימות התחברות, וליצירת קשר
                איתך לגבי האירוע שלך והתאמת החבילה המתאימה.
              </li>
              <li>למתן השירות, תפעולו ושיפורו, ולהתאמת הצעות מחיר לצרכיך.</li>
              <li>
                לשליחת התראות תפעוליות לבעל העסק על פניות חדשות (בדוא&rdquo;ל
                וב-WhatsApp).
              </li>
              <li>
                להפקת קבלות, התאמת תשלומים ועמידה בחובות חשבונאיות ומיסויות.
              </li>
              <li>לאבטחת האתר, מניעת שימוש לרעה ושמירה על תקינות השירות.</li>
              <li>לעמידה בחובות חוקיות ורגולטוריות החלות עלינו.</li>
              <li>
                בשירותים עתידיים: לשליחת הזמנות לאורחים, איסוף אישורי הגעה, ביצוע
                שיחות מעקב ועיבוד תשלומים מקוונים — בכפוף להסכמות הרלוונטיות.
              </li>
            </UL>
          </Section>

          {/* 4. Third-party services */}
          <Section title="4. שירותי צד שלישי שאנו מפעילים">
            <P>
              אנו נעזרים בספקי שירות חיצוניים לצורך הפעלת השירות. ספקים אלה מעבדים
              מידע מטעמנו ובהתאם למדיניות הפרטיות שלהם:
            </P>
            <H3>בשימוש כיום</H3>
            <UL>
              <li>
                <strong>Supabase</strong> — אחסון המידע במסד נתונים PostgreSQL
                וכן שירות האימות (ניהול חשבונות והצפנת סיסמאות) (שרתים באיחוד
                האירופי / ארה&rdquo;ב).
              </li>
              <li>
                <strong>Vercel</strong> — אירוח האתר ותשתית ההגשה.
              </li>
              <li>
                <strong>Gmail / Google (SMTP)</strong> — שליחת הודעות דוא&rdquo;ל
                והתראות.
              </li>
              <li>
                <strong>Twilio</strong> — שליחת התראות WhatsApp לבעל העסק.
              </li>
            </UL>
            <H3 className="text-brand-blue">מתוכננים לשירותים עתידיים</H3>
            <UL>
              <li>
                <strong>Stripe</strong> — עיבוד תשלומי כרטיס אשראי מקוונים (פרטי
                הכרטיס מעובדים אצל Stripe בלבד ואינם נשמרים אצלנו).
              </li>
              <li>
                <strong>ElevenLabs</strong> — הפקת קול לשיחות מעקב אוטומטיות.
              </li>
              <li>
                <strong>OpenAI Whisper</strong> — תמלול שיחות קוליות.
              </li>
              <li>
                <strong>Anthropic Claude</strong> — עיבוד שפה והפעלת לוגיקת השיחה
                החכמה.
              </li>
            </UL>
          </Section>

          {/* 5. Payments and billing */}
          <Section title="5. תשלומים וחיוב">
            <P>
              אנו מציעים מספר אמצעי תשלום. בכל אמצעי אנו אוספים אך ורק את המידע
              המינימלי הדרוש להפקת קבלות, להתאמת התשלומים (reconciliation) ולעמידה
              בחובותינו החשבונאיות והמיסויות.
            </P>
            <H3>אמצעי תשלום הנהוגים כיום</H3>
            <UL>
              <li>
                <strong>העברה בנקאית</strong> — אנו מקבלים את פרטי הבנק הדרושים
                לזיהוי התשלום והתאמתו. איננו שומרים מידע בנקאי רגיש מעבר לנדרש
                לצורך ההתאמה.
              </li>
              <li>
                <strong>ביט (Bit)</strong> — התשלום מתבצע דרך אפליקציית Bit. אנו
                מקבלים אישור על ביצוע התשלום אך איננו שומרים את פרטי אמצעי התשלום
                שלך.
              </li>
              <li>
                <strong>מזומן</strong> — לא נאסף כל מידע תשלום דיגיטלי. נשמרות רק
                רשומות קבלה לצרכים חשבונאיים.
              </li>
            </UL>
            <P>
              <strong>שמירת רשומות:</strong> אנו שומרים רשומות חיוב וקבלות למשך
              התקופה הנדרשת על פי דיני המס בישראל — נכון להיום, שבע (7) שנים עבור
              עוסק פטור.
            </P>
            <FutureBox>
              <h3 className="mb-3 text-lg font-bold text-brand-blue">
                שירות עתידי — תשלום מקוון
              </h3>
              <UL>
                <li>
                  <strong>Stripe</strong> — לתשלומי כרטיס אשראי מקוונים דרך האתר.
                  לעולם לא נשמור מספרי כרטיס אשראי; כל נתוני הכרטיס יטופלו בתשתית
                  התואמת לתקן PCI של Stripe. תשלומי כרטיס מקוונים{" "}
                  <strong>אינם זמינים עדיין</strong>.
                </li>
              </UL>
            </FutureBox>
          </Section>

          {/* 6. Data retention */}
          <Section title="6. שמירת המידע">
            <P>
              אנו שומרים מידע אישי כל עוד הוא נחוץ למטרות שלשמן נאסף — לרבות מתן
              השירות, מענה לפניות ועמידה בחובות חוקיות וחשבונאיות. רשומות חיוב
              וקבלות נשמרות למשך התקופה הנדרשת בדיני המס בישראל (כיום שבע (7) שנים
              עבור עוסק פטור). מידע פניות שאינו פעיל יימחק או יהפוך לאנונימי בתום
              פרק זמן סביר, אלא אם קיימת חובה חוקית לשמרו לתקופה ארוכה יותר. תוכל
              לבקש את מחיקת המידע שלך בכל עת (ראה סעיף &ldquo;זכויותיך&rdquo;).
            </P>
          </Section>

          {/* 7. Data security */}
          <Section title="7. אבטחת מידע">
            <P>
              אנו נוקטים אמצעים טכניים וארגוניים סבירים להגנה על המידע מפני גישה,
              שימוש או חשיפה בלתי מורשים, לרבות הצפנה בתעבורה (HTTPS), בקרת גישה
              והסתמכות על ספקי תשתית מאובטחים. עם זאת, אף שיטת העברה או אחסון אינה
              מאובטחת ב-100%, ואיננו יכולים להבטיח אבטחה מוחלטת.
            </P>
          </Section>

          {/* 8. Your rights */}
          <Section title="8. זכויותיך">
            <P>
              בהתאם לחוק הגנת הפרטיות הישראלי ולתקנת ה-GDPR (ככל שהיא חלה עליך),
              עומדות לך הזכויות הבאות ביחס למידע האישי שלך:
            </P>
            <UL>
              <li>הזכות לעיין במידע שאנו מחזיקים אודותיך.</li>
              <li>הזכות לבקש תיקון מידע שגוי או לא מעודכן.</li>
              <li>הזכות לבקש מחיקת המידע (&ldquo;הזכות להישכח&rdquo;).</li>
              <li>הזכות להתנגד לעיבוד מסוים או להגביל אותו.</li>
              <li>
                הזכות לחזור בך מהסכמה שנתת, ללא פגיעה בחוקיות העיבוד שקדם לכך.
              </li>
              <li>הזכות להגיש תלונה לרשות להגנת הפרטיות בישראל.</li>
            </UL>
            <P>
              למימוש זכויותיך, פנה אלינו בכתובת הדוא&rdquo;ל המפורטת בסעיף
              &ldquo;יצירת קשר&rdquo;. נטפל בפנייתך בתוך זמן סביר ובהתאם לדין.
            </P>
          </Section>

          {/* 9. International transfers */}
          <Section title="9. העברת מידע בינלאומית">
            <P>
              חלק מספקי השירות שלנו מאחסנים או מעבדים מידע מחוץ לישראל, לרבות
              באיחוד האירופי ובארצות הברית. בעת העברת מידע למדינות אלה, אנו
              מסתמכים על מנגנונים חוקיים מקובלים להגנה על המידע, ובוחרים בספקים
              המחויבים לסטנדרטים מקובלים של אבטחת מידע ופרטיות.
            </P>
          </Section>

          {/* 10. Cookies */}
          <Section title="10. עוגיות (Cookies) וטכנולוגיות מעקב">
            <P>
              האתר עשוי לעשות שימוש בעוגיות חיוניות ובנתונים טכניים בסיסיים
              הנדרשים לתפעולו התקין. איננו משתמשים כיום בעוגיות פרסום או מעקב
              שיווקי של צד שלישי. תוכל לחסום עוגיות דרך הגדרות הדפדפן שלך, אך הדבר
              עלול לפגוע בחלק מהפונקציות של האתר.
            </P>
          </Section>

          {/* 11. Children */}
          <Section title="11. פרטיות ילדים">
            <P>
              השירות אינו מיועד לקטינים מתחת לגיל 18, ואיננו אוספים ביודעין מידע
              אישי מילדים. אם נודע לך כי קטין מסר לנו מידע ללא הסכמת הורה או
              אפוטרופוס, אנא פנה אלינו ונפעל למחיקת המידע.
            </P>
          </Section>

          {/* 12. Changes */}
          <Section title="12. שינויים במדיניות זו">
            <P>
              אנו רשאים לעדכן מדיניות פרטיות זו מעת לעת, במיוחד עם השקת שירותים
              חדשים. גרסה מעודכנת תפורסם בעמוד זה לצד תאריך עדכון חדש. מומלץ לעיין
              בעמוד מעת לעת. המשך השימוש בשירות לאחר עדכון מהווה הסכמה למדיניות
              המעודכנת.
            </P>
          </Section>

          {/* 13. Contact */}
          <Section title="13. יצירת קשר">
            <P>בכל שאלה, בקשה או פנייה בנושא פרטיות ניתן לפנות אלינו:</P>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
              <p className="mb-1">
                <strong>שם העסק:</strong> INV4U (עוסק פטור, רשום בישראל)
              </p>
              <p className="mb-1">
                <strong>בעל העסק:</strong> מאור יוסף סלם
              </p>
              <p className="mb-1">
                <strong>כתובת:</strong> שלום שבזי 10, פתח תקווה, ישראל
              </p>
              <p className="mb-1">
                <strong>דוא&rdquo;ל:</strong>{" "}
                <A href="mailto:inv4u.business@gmail.com">
                  inv4u.business@gmail.com
                </A>
              </p>
              <p>
                <strong>אתר:</strong>{" "}
                <A href="https://inv4u.vercel.app">https://inv4u.vercel.app</A>
              </p>
            </div>
          </Section>
        </article>

        {/* Footer toggle */}
        <div className="mt-14 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          This policy is also available in{" "}
          <A href="/privacy/en">English</A>.
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-6">
      <h2 className="mb-3 text-xl font-bold text-brand-navy">{title}</h2>
      {children}
    </section>
  );
}

function H3({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`mt-6 mb-3 text-lg font-bold text-brand-navy ${className}`}>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-relaxed text-slate-600">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mb-4 list-disc space-y-2 pr-6 leading-relaxed text-slate-600 marker:text-brand-blue">
      {children}
    </ul>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="font-medium text-brand-blue underline-offset-4 hover:underline"
    >
      {children}
    </a>
  );
}

function FutureBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-brand-blue/20 bg-slate-50 p-6">
      {children}
    </div>
  );
}
