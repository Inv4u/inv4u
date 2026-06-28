import type { FeatureKey } from '@/database.types';
import { site } from '@/lib/site';

/**
 * The 6 dashboard features — single source of truth for icon / name / copy,
 * in display order. Keyed by the `feature_key` enum so it lines up 1:1 with the
 * `feature_access` rows. (Distinct from `lib/features.ts`, which powers the
 * public marketing pages.)
 */
export interface FeatureMeta {
  key: FeatureKey;
  icon: string;
  name: string;
  description: string;
}

export const FEATURE_CATALOG: FeatureMeta[] = [
  {
    key: 'whatsapp_invitations',
    icon: '📱',
    name: 'הזמנות WhatsApp',
    description: 'שליחת הזמנות מותאמות אישית לכל אורח דרך WhatsApp',
  },
  {
    key: 'ai_calling',
    icon: '🤖',
    name: 'שיחות AI אוטומטיות',
    description: 'AI מתקשר לאורחים שלא הגיבו ומקבל אישור הגעה בעברית',
  },
  {
    key: 'email_backup',
    icon: '📧',
    name: 'גיבוי אימייל',
    description: 'שליחת הזמנות בנוסף גם דרך אימייל למי שאין לו WhatsApp',
  },
  {
    key: 'live_dashboard',
    icon: '📊',
    name: 'דשבורד חי',
    description: 'מעקב בזמן אמת אחר אישורי ההגעה, הצגה במחשב ובטלפון',
  },
  {
    key: 'seating_map',
    icon: '🪑',
    name: 'מפת הושבה אינטראקטיבית',
    description: 'סידור מקומות חכם, מקושר לדשבורד',
  },
  {
    key: 'guest_management',
    icon: '📋',
    name: 'ניהול רשימת מוזמנים',
    description: 'העלאה, עריכה, חלוקה לקבוצות, ייצוא',
  },
];

export function getFeatureMeta(key: FeatureKey): FeatureMeta | undefined {
  return FEATURE_CATALOG.find((f) => f.key === key);
}

/** Build a wa.me link to Maor with a prefilled Hebrew message. */
export function whatsappTo(message: string): string {
  return `https://wa.me/${site.phoneE164}?text=${encodeURIComponent(message)}`;
}

/** Prefilled WhatsApp text for the dashboard "let's close your package" banner. */
export const DASHBOARD_BANNER_WHATSAPP =
  'היי מאור, נרשמתי ל-inv4u ואשמח לסגור את חבילת האירוע שלי 🎉';

/** Prefilled WhatsApp text shown when a user clicks a locked feature. */
export function lockedFeatureWhatsapp(featureName: string): string {
  return `היי מאור, אשמח לפתוח את הפיצ'ר "${featureName}" בחשבון inv4u שלי`;
}
