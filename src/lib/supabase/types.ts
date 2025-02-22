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
          university_reg_no: string | null;
          attendee_id: string | null;
          general_pass: boolean | null;
          group_member_ids: string | null;
          winning_position: number | null;
          payment_id: string | null;
          event_ids: string[] | null;
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
          university_reg_no?: string | null;
          attendee_id?: string | null;
          general_pass?: boolean | null;
          group_member_ids?: string | null;
          winning_position?: number | null;
          payment_id?: string | null;
          event_ids?: string[] | null;
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
          university_reg_no?: string | null;
          attendee_id?: string | null;
          general_pass?: boolean | null;
          group_member_ids?: string | null;
          winning_position?: number | null;
          payment_id?: string | null;
          event_ids?: string[] | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          created_at: string;
          name: string | null;
          description: string | null;
          price: number | null;
          event_limit: number | null;
          image_url: string | null;
          user_id: string;
          event_type: string | null;
          category: string | null;
          format: string | null;
          num_winners: number | null;
          min_group_size: number | null;
          max_group_size: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name?: string | null;
          description?: string | null;
          price?: number | null;
          event_limit?: number | null;
          image_url?: string | null;
          user_id: string;
          event_type?: string | null;
          category?: string | null;
          format?: string | null;
          num_winners?: number | null;
          min_group_size?: number | null;
          max_group_size?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string | null;
          description?: string | null;
          price?: number | null;
          event_limit?: number | null;
          image_url?: string | null;
          user_id?: string;
          event_type?: string | null;
          category?: string | null;
          format?: string | null;
          num_winners?: number | null;
          min_group_size?: number | null;
          max_group_size?: number | null;
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
          updated_at: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          email: string;
        };
        Insert: {
          id: string;
          updated_at?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          email: string;
        };
        Update: {
          id?: string;
          updated_at?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          email: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
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
