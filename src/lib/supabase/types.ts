export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      attendee_events: {
        Row: {
          attendee_id: string;
          event_id: string;
        };
        Insert: {
          attendee_id: string;
          event_id: string;
        };
        Update: {
          attendee_id?: string;
          event_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendee_events_attendee_id_fkey";
            columns: ["attendee_id"];
            referencedRelation: "attendees";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendee_events_event_id_fkey";
            columns: ["event_id"];
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      attendees: {
        Row: {
          attendee_id: string | null;
          college_name: string | null;
          created_at: string;
          department: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          paid_event_count: number | null;
          payment_id: string | null;
          payment_status: string | null;
          phone_no: string | null;
        };
        Insert: {
          attendee_id?: string | null;
          college_name?: string | null;
          created_at?: string;
          department?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          paid_event_count?: number | null;
          payment_id?: string | null;
          payment_status?: string | null;
          phone_no?: string | null;
        };
        Update: {
          attendee_id?: string | null;
          college_name?: string | null;
          created_at?: string;
          department?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          paid_event_count?: number | null;
          payment_id?: string | null;
          payment_status?: string | null;
          phone_no?: string | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          active: boolean | null;
          category: string | null;
          coordinator_email: string | null;
          created_at: string;
          description: string | null;
          event_limit: number | null;
          event_type: string | null;
          format: string | null;
          id: string;
          image_url: string | null;
          max_group_size: number | null;
          min_group_size: number | null;
          name: string | null;
          price: number | null;
          registration_count: number | null;
          user_id: string | null;
        };
        Insert: {
          active?: boolean | null;
          category?: string | null;
          coordinator_email?: string | null;
          created_at?: string;
          description?: string | null;
          event_limit?: number | null;
          event_type?: string | null;
          format?: string | null;
          id?: string;
          image_url?: string | null;
          max_group_size?: number | null;
          min_group_size?: number | null;
          name?: string | null;
          price?: number | null;
          registration_count?: number | null;
          user_id?: string | null;
        };
        Update: {
          active?: boolean | null;
          category?: string | null;
          coordinator_email?: string | null;
          created_at?: string;
          description?: string | null;
          event_limit?: number | null;
          event_type?: string | null;
          format?: string | null;
          id?: string;
          image_url?: string | null;
          max_group_size?: number | null;
          min_group_size?: number | null;
          name?: string | null;
          price?: number | null;
          registration_count?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          email: string;
          full_name: string | null;
          id: string;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      commit_transaction: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      create_attendees_transaction: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      migrate_old_registrations: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      rollback_transaction: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      sync_event_registration_counts: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      update_all_events_registration_count: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];

export type Attendee = Tables<"attendees">;
export type AttendeeEvent = Tables<"attendee_events">;
export type Event = Tables<"events">;
export type Profile = Tables<"profiles">;
