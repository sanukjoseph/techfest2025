export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      attendees: {
        Row: {
          id: string;
          created_at: string;
          full_name: string | null;
          college_name: string | null;
          department: string | null;
          email: string | null;
          phone_no: string | null;
          attendee_id: string | null;
          payment_id: string | null;
          payment_status: string | null;
          paid_event_count: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name?: string | null;
          college_name?: string | null;
          department?: string | null;
          email?: string | null;
          phone_no?: string | null;
          attendee_id?: string | null;
          payment_id?: string | null;
          payment_status?: string | null;
          paid_event_count?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          full_name?: string | null;
          college_name?: string | null;
          department?: string | null;
          email?: string | null;
          phone_no?: string | null;
          attendee_id?: string | null;
          payment_id?: string | null;
          payment_status?: string | null;
          paid_event_count?: number;
        };
        Relationships: [];
      };
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
      events: {
        Row: {
          id: string;
          active: boolean | null;
          category: string | null;
          created_at: string;
          description: string | null;
          event_limit: number | null;
          event_type: string | null;
          format: string | null;
          image_url: string | null;
          max_group_size: number | null;
          min_group_size: number | null;
          name: string | null;
          price: number | null;
          registration_count: number | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          active?: boolean | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          event_limit?: number | null;
          event_type?: string | null;
          format?: string | null;
          image_url?: string | null;
          max_group_size?: number | null;
          min_group_size?: number | null;
          name: string | null;
          price?: number | null;
          registration_count?: number | null;
          user_id: string;
        };
        Update: {
          id?: string;
          active?: boolean | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          event_limit?: number | null;
          event_type?: string | null;
          format?: string | null;
          image_url?: string | null;
          max_group_size?: number | null;
          min_group_size?: number | null;
          name?: string | null;
          price?: number | null;
          registration_count?: number | null;
          user_id?: string;
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
          id: string;
          avatar_url: string | null;
          email: string;
          full_name: string | null;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          id: string;
          avatar_url?: string | null;
          email: string;
          full_name?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          id?: string;
          avatar_url?: string | null;
          email: string;
          full_name?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_attendees_transaction: {
        Args: Record<string, never>;
        Returns: void;
      };
      commit_transaction: {
        Args: Record<string, never>;
        Returns: void;
      };
      migrate_old_registrations: {
        Args: Record<string, never>;
        Returns: void;
      };
      rollback_transaction: {
        Args: Record<string, never>;
        Returns: void;
      };
      sync_event_registration_counts: {
        Args: Record<string, never>;
        Returns: void;
      };
      update_all_events_registration_count: {
        Args: Record<string, never>;
        Returns: void;
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
