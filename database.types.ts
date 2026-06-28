/**
 * Hand-authored types mirroring supabase/migrations/*.sql (Session 2 schema:
 * users + per-feature feature_access — the locked-dashboard model).
 *
 * Once the migrations are applied to the live database these can be regenerated
 * authoritatively with:
 *   npx supabase gen types typescript --project-id <id> > database.types.ts
 * Until then this file is the source of truth for the app code.
 */

export type UserRole = 'event_owner' | 'admin';

export type FeatureKey =
  | 'whatsapp_invitations'
  | 'ai_calling'
  | 'email_backup'
  | 'live_dashboard'
  | 'seating_map'
  | 'guest_management';

export type EventType =
  | 'wedding'
  | 'bar_mitzvah'
  | 'bat_mitzvah'
  | 'brit'
  | 'corporate'
  | 'birthday'
  | 'other';

export type EventStatus = 'draft' | 'active' | 'completed' | 'archived';
export type RsvpStatus = 'pending' | 'attending' | 'not_attending' | 'maybe';
export type InviteChannel = 'whatsapp' | 'email' | 'ai_call';
export type InviteStatus = 'queued' | 'sent' | 'delivered' | 'failed' | 'opened';
export type NotificationType =
  | 'new_signup'
  | 'rsvp_received'
  | 'lead_inquiry'
  | 'system_alert';

/** The 6 feature keys, in display order. */
export const FEATURE_KEYS: FeatureKey[] = [
  'whatsapp_invitations',
  'ai_calling',
  'email_backup',
  'live_dashboard',
  'seating_map',
  'guest_management',
];

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface FeatureAccess {
  id: string;
  user_id: string;
  feature_key: FeatureKey;
  unlocked: boolean;
  unlocked_at: string | null;
  unlocked_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRow {
  id: string;
  owner_id: string;
  event_type: EventType;
  event_date: string | null;
  venue_name: string | null;
  venue_address: string | null;
  couple_name_1: string | null;
  couple_name_2: string | null;
  honoree_name: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  event_id: string;
  full_name: string;
  phone: string | null;
  party_size: number;
  rsvp_status: RsvpStatus;
  rsvp_response_at: string | null;
  invite_token: string;
  dietary_notes: string | null;
  table_assignment: number | null;
  created_at: string;
  updated_at: string;
}

export interface Invitation {
  id: string;
  guest_id: string;
  channel: InviteChannel;
  status: InviteStatus;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  twilio_message_id: string | null;
  twilio_call_sid: string | null;
  created_at: string;
}

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  read_at: string | null;
  related_user_id: string | null;
  related_event_id: string | null;
  created_at: string;
}

/** Shape consumed by `createClient<Database>()` from @supabase/supabase-js. */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Partial<User> & { id: string };
        Update: Partial<User>;
        Relationships: [];
      };
      feature_access: {
        Row: FeatureAccess;
        Insert: Partial<FeatureAccess> & {
          user_id: string;
          feature_key: FeatureKey;
        };
        Update: Partial<FeatureAccess>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: Partial<EventRow> & { owner_id: string };
        Update: Partial<EventRow>;
        Relationships: [];
      };
      guests: {
        Row: Guest;
        Insert: Partial<Guest> & { event_id: string; full_name: string };
        Update: Partial<Guest>;
        Relationships: [];
      };
      invitations: {
        Row: Invitation;
        Insert: Partial<Invitation> & { guest_id: string };
        Update: Partial<Invitation>;
        Relationships: [];
      };
      admin_notifications: {
        Row: AdminNotification;
        Insert: Partial<AdminNotification> & {
          type: NotificationType;
          title: string;
        };
        Update: Partial<AdminNotification>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_guest_by_token: {
        Args: { token: string };
        Returns: {
          guest_id: string;
          full_name: string;
          party_size: number;
          rsvp_status: RsvpStatus;
          dietary_notes: string | null;
          table_assignment: number | null;
          event_type: EventType;
          event_date: string | null;
          venue_name: string | null;
          venue_address: string | null;
          couple_name_1: string | null;
          couple_name_2: string | null;
          honoree_name: string | null;
        }[];
      };
      respond_rsvp: {
        Args: {
          token: string;
          new_status: RsvpStatus;
          new_party_size?: number | null;
          new_dietary_notes?: string | null;
        };
        Returns: undefined;
      };
    };
  };
}
