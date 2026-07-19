import type { LucideIcon } from 'lucide-react';
import {
  MessageSquare,
  PhoneCall,
  Mail,
  BarChart3,
  Grid3x3,
  Users,
} from 'lucide-react';
import type { FeatureKey } from '@/database.types';
import { site } from '@/lib/site';

/**
 * The 6 dashboard features — single source of truth for icon / name / copy,
 * in display order. Keyed by the `feature_key` enum so it lines up 1:1 with the
 * `feature_access` rows. Icons are Lucide components (no emojis in UI chrome).
 * (Distinct from `lib/features.ts`, which powers the public marketing pages.)
 */
export interface FeatureMeta {
  key: FeatureKey;
  icon: LucideIcon;
  name: string;
  description: string;
}

export const FEATURE_CATALOG: FeatureMeta[] = [
  {
    key: 'whatsapp_invitations',
    icon: MessageSquare,
    name: 'הזמנות WhatsApp',
    description: 'הזמנות אישיות בוואטסאפ',
  },
  {
    key: 'ai_calling',
    icon: PhoneCall,
    name: 'שיחות AI',
    description: 'תיעוד מלא של כל שיחה — מי נענה, מתי, ומה נאמר',
  },
  {
    key: 'email_backup',
    icon: Mail,
    name: 'גיבוי אימייל',
    description: 'גיבוי באימייל',
  },
  {
    key: 'live_dashboard',
    icon: BarChart3,
    name: 'דשבורד חי',
    description: 'דשבורד בזמן אמת',
  },
  {
    key: 'seating_map',
    icon: Grid3x3,
    name: 'מפת הושבה',
    description: 'סידורי הושבה אינטראקטיביים',
  },
  {
    key: 'guest_management',
    icon: Users,
    name: 'ניהול מוזמנים',
    description: 'ניהול רשימת מוזמנים',
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
  'היי מאור, נרשמתי ל-Maorly ואשמח לסגור את חבילת האירוע שלי 🎉';

/** Prefilled WhatsApp text shown when a user clicks a locked feature. */
export function lockedFeatureWhatsapp(featureName: string): string {
  return `היי מאור, אשמח לפתוח את הפיצ'ר "${featureName}" בחשבון Maorly שלי`;
}
