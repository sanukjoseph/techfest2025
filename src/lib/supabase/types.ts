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
          school_id: string | null;
          attendee_id: string | null;
          payment_id: string | null;
          event_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name?: string | null;
          college_name?: string | null;
          department?: string | null;
          email?: string | null;
          phone_no?: string | null;
          school_id?: string | null;
          attendee_id?: string | null;
          payment_id?: string | null;
          event_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          full_name?: string | null;
          college_name?: string | null;
          department?: string | null;
          email?: string | null;
          phone_no?: string | null;
          school_id?: string | null;
          attendee_id?: string | null;
          payment_id?: string | null;
          event_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "attendees_event_id_fkey";
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
          num_winners: number | null;
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
          name?: string | null;
          num_winners?: number | null;
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
          num_winners?: number | null;
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
        Args: {
          attendees_data: Json;
        };
        Returns: {
          id: string;
          created_at: string;
          full_name: string | null;
          college_name: string | null;
          department: string | null;
          email: string | null;
          phone_no: string | null;
          attendee_id: string | null;
          payment_id: string | null;
          event_id: string | null;
        }[];
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
export type Event = Tables<"events">;
export type Profile = Tables<"profiles">;
