export interface Highlight {
  icon: string;
  title: string;
  text: string;
}

export interface FeatureDetail {
  slug: string;
  icon: string;
  title: string;
  /** Short one-liner shown on the card. */
  tagline: string;
  /** Tailwind gradient classes for the card / hero accent. */
  gradient: string;
  /** Bullet list shown on the home card. */
  bullets: string[];
  /** Longer intro shown on the detail page. */
  intro: string;
  /** Detailed highlight blocks on the detail page. */
  highlights: Highlight[];
  /** Optional headline stat for the detail page. */
  stat: { value: string; label: string };
}

export const features: FeatureDetail[] = [
  {
    slug: 'invitation',
    icon: '🎁',
    title: 'חוויית ההזמנה',
    tagline: 'הזמנה דיגיטלית שאי אפשר להתעלם ממנה',
    gradient: 'from-grape to-magenta',
    bullets: [
      'הזמנות מקטלוג עיצובים או עיצוב אישי',
      'וידאו אישי בתוך ההזמנה',
      'ניווט לאולם ישירות מההזמנה',
      'הוספה אוטומטית ליומן Google',
    ],
    intro:
      'ההזמנה היא הרושם הראשון של האירוע שלכם. עם INV4U היא הופכת לחוויה דיגיטלית מרהיבה — עיצוב מותאם אישית, וידאו, ניווט וקריאה לפעולה ברורה, הכל בלחיצה אחת מהנייד.',
    highlights: [
      {
        icon: '🎨',
        title: 'עיצוב שמספר סיפור',
        text: 'בחרו מקטלוג עיצובים מקצועיים או קבלו עיצוב אישי שמתאים בדיוק לסגנון האירוע שלכם.',
      },
      {
        icon: '🎬',
        title: 'וידאו אישי מוטמע',
        text: 'הוסיפו סרטון קצר ישירות בתוך ההזמנה — האורחים מתרגשים עוד לפני שאישרו הגעה.',
      },
      {
        icon: '🧭',
        title: 'ניווט ויומן בקליק',
        text: 'כפתור ניווט ישיר לאולם והוספה אוטומטית ליומן — פחות שאלות, יותר אישורים.',
      },
    ],
    stat: { value: 'בלחיצה', label: 'מההזמנה לניווט וליומן' },
  },
  {
    slug: 'confirmation',
    icon: '✅',
    title: 'אישורי הגעה',
    tagline: 'אישורים אוטומטיים — בלי להרים טלפון',
    gradient: 'from-brand-blue to-sky',
    bullets: [
      'אישור הגעה בוואטסאפ או SMS',
      'תזכורות אוטומטיות לפני האירוע',
      'שיחות טלפון חכמות למי שלא ענה',
      'דשבורד מרכזי למעקב בזמן אמת',
    ],
    intro:
      'הלב של INV4U. במקום שעות של שיחות טלפון, המערכת שולחת אישורי הגעה בוואטסאפ, מתזכרת אוטומטית, ואפילו מתקשרת בקול טבעי בעברית למי שלא ענה — ומעדכנת הכל בדשבורד אחד.',
    highlights: [
      {
        icon: '💬',
        title: 'וואטסאפ ו-SMS',
        text: 'האורחים מאשרים בלחיצה אחת מהשיחה שהם כבר נמצאים בה. שיעורי תגובה גבוהים פי כמה.',
      },
      {
        icon: '🤖',
        title: 'שיחות AI בעברית טבעית',
        text: 'מי שלא הגיב מקבל שיחה קולית חכמה שמדברת, מבינה ומאשרת — בדיוק כמו אדם אמיתי.',
      },
      {
        icon: '📊',
        title: 'דשבורד בזמן אמת',
        text: 'ראו בכל רגע מי אישר, מי דחה ומי טרם ענה, עם תמלול מלא של כל שיחה.',
      },
    ],
    stat: { value: 'אוטומטי', label: 'אישורי הגעה בוואטסאפ וב-AI' },
  },
  {
    slug: 'event-day',
    icon: '📱',
    title: 'ביום האירוע',
    tagline: 'שליטה מלאה — מהכניסה ועד ההושבה',
    gradient: 'from-brand-teal to-emerald-500',
    bullets: [
      'QR קוד לכניסה וספירת אורחים',
      'מעקב בין מי שאישר למי שהגיע בפועל',
      'סידור הושבה לפי אישורי הגעה',
    ],
    intro:
      'ביום האירוע הכל קורה מהר. INV4U נותן לכם שליטה מלאה: כניסה עם QR, ספירת אורחים חיה, והשוואה בין מי שאישר למי שהגיע בפועל — כדי שתדעו בדיוק מה קורה באולם.',
    highlights: [
      {
        icon: '🎫',
        title: 'כניסה עם QR',
        text: 'כל אורח נסרק בכניסה — ספירה מדויקת ואוטומטית בלי בלאגן ובלי רשימות נייר.',
      },
      {
        icon: '🪑',
        title: 'הושבה חכמה',
        text: 'סדרו את האורחים לפי אישורי הגעה אמיתיים, גררו בין שולחנות וראו סטטוס בצבעים.',
      },
      {
        icon: '⚡',
        title: 'אישר מול הגיע',
        text: 'מעקב חי בין מי שאישר למי שבאמת הגיע — שליטה מלאה לאורך כל הערב.',
      },
    ],
    stat: { value: 'בזמן אמת', label: 'ספירת אורחים וסטטוס חי' },
  },
  {
    slug: 'after-event',
    icon: '📸',
    title: 'אחרי האירוע',
    tagline: 'סוגרים את המעגל יפה',
    gradient: 'from-sunset to-gold',
    bullets: [
      'גלריית תמונות משותפת לאורחים',
      'הודעת תודה אוטומטית',
      'ייצוא רשימת אורחים לאקסל',
      'סיכום סופי של נוכחות',
    ],
    intro:
      'האירוע נגמר אבל החוויה ממשיכה. שלחו תודה אוטומטית, שתפו גלריית תמונות משותפת וקבלו סיכום מלא של הנוכחות — כל הנתונים מסודרים ומוכנים לייצוא.',
    highlights: [
      {
        icon: '🖼️',
        title: 'גלריה משותפת',
        text: 'כל האורחים מעלים ורואים את התמונות במקום אחד — הזיכרונות נשמרים יחד.',
      },
      {
        icon: '💌',
        title: 'תודה אוטומטית',
        text: 'הודעת תודה אישית נשלחת לכל מי שהגיע, אוטומטית, מיד אחרי האירוע.',
      },
      {
        icon: '📤',
        title: 'סיכום וייצוא',
        text: 'סיכום נוכחות מלא וייצוא לאקסל — נוח לחישובי תשלום ולמעקב.',
      },
    ],
    stat: { value: 'הכל סגור', label: 'סיכום, גלריה, ייצוא לאקסל' },
  },
];

export function getFeature(slug: string): FeatureDetail | undefined {
  return features.find((f) => f.slug === slug);
}
