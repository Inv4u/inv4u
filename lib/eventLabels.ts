import type { EventType, EventStatus, EventRow, RsvpStatus } from '@/database.types';

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  wedding: 'חתונה',
  bar_mitzvah: 'בר מצווה',
  bat_mitzvah: 'בת מצווה',
  brit: 'ברית',
  corporate: 'אירוע עסקי',
  birthday: 'יום הולדת',
  other: 'אירוע',
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: 'טיוטה',
  active: 'פעיל',
  completed: 'הסתיים',
  archived: 'בארכיון',
};

export const RSVP_STATUS_LABELS: Record<RsvpStatus, string> = {
  pending: 'טרם ענה',
  attending: 'מגיע',
  not_attending: 'לא מגיע',
  maybe: 'אולי',
};

/** Best human title for an event: couple names, else honoree, else the type. */
export function eventTitle(e: Pick<EventRow,
  'event_type' | 'couple_name_1' | 'couple_name_2' | 'honoree_name'>): string {
  if (e.couple_name_1 && e.couple_name_2) {
    return `${e.couple_name_1} ו${e.couple_name_2}`;
  }
  if (e.couple_name_1) return e.couple_name_1;
  if (e.honoree_name) return e.honoree_name;
  return EVENT_TYPE_LABELS[e.event_type];
}

/** Format an ISO/`YYYY-MM-DD` date as a Hebrew date, or '' if null. */
export function formatHebrewDate(date: string | null): string {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('he-IL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return date;
  }
}
