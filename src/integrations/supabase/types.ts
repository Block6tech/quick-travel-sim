export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_emails: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      banner_slides: {
        Row: {
          active: boolean
          created_at: string
          id: string
          image_url: string
          sort_order: number
          subtitle: string
          subtitle_ar: string
          title: string
          title_ar: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          subtitle?: string
          subtitle_ar?: string
          title?: string
          title_ar?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          subtitle?: string
          subtitle_ar?: string
          title?: string
          title_ar?: string
          updated_at?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          max_uses: number | null
          min_order_amount: number | null
          times_used: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_order_amount?: number | null
          times_used?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_order_amount?: number | null
          times_used?: number
        }
        Relationships: []
      }
      esim_actions_log: {
        Row: {
          action: string
          created_at: string
          id: string
          new_status: string | null
          notes: string | null
          order_id: string
          performed_by: string
          previous_status: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_status?: string | null
          notes?: string | null
          order_id: string
          performed_by: string
          previous_status?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_status?: string | null
          notes?: string | null
          order_id?: string
          performed_by?: string
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esim_actions_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          country: string
          country_code: string
          created_at: string
          data_total: number
          data_used: number
          discount_amount: number | null
          discount_code: string | null
          expires_at: string | null
          id: string
          phone_number: string | null
          plan_data: string
          plan_price: number
          plan_speed: string
          plan_validity: string
          status: string
          user_id: string
        }
        Insert: {
          country: string
          country_code: string
          created_at?: string
          data_total?: number
          data_used?: number
          discount_amount?: number | null
          discount_code?: string | null
          expires_at?: string | null
          id?: string
          phone_number?: string | null
          plan_data: string
          plan_price: number
          plan_speed: string
          plan_validity: string
          status?: string
          user_id: string
        }
        Update: {
          country?: string
          country_code?: string
          created_at?: string
          data_total?: number
          data_used?: number
          discount_amount?: number | null
          discount_code?: string | null
          expires_at?: string | null
          id?: string
          phone_number?: string | null
          plan_data?: string
          plan_price?: number
          plan_speed?: string
          plan_validity?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          friend_discount_type: string
          friend_discount_value: number
          id: string
          referral_count: number
          reward_type: string
          reward_value: number
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          friend_discount_type?: string
          friend_discount_value?: number
          id?: string
          referral_count?: number
          reward_type?: string
          reward_value?: number
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          friend_discount_type?: string
          friend_discount_value?: number
          id?: string
          referral_count?: number
          reward_type?: string
          reward_value?: number
          user_id?: string
        }
        Relationships: []
      }
      referral_uses: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          referral_code_id: string
          used_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          referral_code_id: string
          used_by: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          referral_code_id?: string
          used_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_uses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_uses_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_conditions: {
        Row: {
          content_ar: string
          content_en: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          content_ar: string
          content_en: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          content_ar?: string
          content_en?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_get_stats: {
        Args: never
        Returns: {
          active_orders: number
          total_orders: number
          total_referrals: number
          total_revenue: number
          total_users: number
        }[]
      }
      admin_get_users: {
        Args: never
        Returns: {
          created_at: string
          email: string
          id: string
          last_sign_in_at: string
        }[]
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
