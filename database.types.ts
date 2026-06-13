/**
 * Hand-authored types mirroring supabase/migrations/*.sql.
 *
 * NOTE: once the migrations are applied to the live database, these can be
 * regenerated authoritatively with:
 *   npx supabase gen types typescript --project-id <id> > database.types.ts
 * Until then this file is the source of truth for the app code.
 */

export type UserRole = 'event_owner' | 'admin';
export type EventType =
  | 'wedding'
  | 'bar_mitzvah'
  | 'bat_mitzvah'
  | 'brit'
  | 'corporate'
  | 'other';
export type EventStatus = 'draft' | 'active' | 'completed' | 'archived';
export type RsvpStatus = 'pending' | 'attending' | 'not_attending' | 'maybe';
export type NotificationType =
  | 'new_signup'
  | 'approval_needed'
  | 'approved'
  | 'system';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  role: UserRole;
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
  created_at: string;
  updated_at: string;
}

export interface Invitation {
  id: string;
  guest_id: string;
  channel: string;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  whatsapp_message_id: string | null;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  type: NotificationType;
  recipient_profile_id: string | null;
  related_profile_id: string | null;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
}

/** Shape consumed by `createClient<Database>()` from @supabase/supabase-js. */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; full_name?: string };
        Update: Partial<Profile>;
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
      notifications: {
        Row: NotificationRow;
        Insert: Partial<NotificationRow> & {
          type: NotificationType;
          title: string;
        };
        Update: Partial<NotificationRow>;
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
        };
        Returns: undefined;
      };
    };
  };
}
