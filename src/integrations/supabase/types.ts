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
      categories: {
        Row: {
          created_at: string
          icon: string
          id: string
          mentor_count: number
          name: string
          subcategories: string[] | null
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          mentor_count?: number
          name: string
          subcategories?: string[] | null
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          mentor_count?: number
          name?: string
          subcategories?: string[] | null
        }
        Relationships: []
      }
      learner_profiles: {
        Row: {
          created_at: string
          experience_level: string | null
          favorite_mentors: string[] | null
          id: string
          learning_goals: string | null
          skill_progress: Json | null
          skills_interested: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          experience_level?: string | null
          favorite_mentors?: string[] | null
          id?: string
          learning_goals?: string | null
          skill_progress?: Json | null
          skills_interested?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          experience_level?: string | null
          favorite_mentors?: string[] | null
          id?: string
          learning_goals?: string | null
          skill_progress?: Json | null
          skills_interested?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_profiles: {
        Row: {
          bio: string | null
          category_id: string | null
          certifications: Json | null
          created_at: string
          currency: string | null
          current_company: string | null
          education: Json | null
          experience_years: number | null
          free_consultation: boolean | null
          headline: string | null
          hourly_rate: number | null
          id: string
          id_document: string | null
          is_available_now: boolean
          is_verified: boolean
          job_role: string | null
          languages: string[] | null
          location: string | null
          package_deals: Json | null
          past_experience: Json | null
          rating: number | null
          response_time: string | null
          review_count: number | null
          sessions_completed: number | null
          skills: Json | null
          time_off: Json | null
          time_zone: string | null
          total_students: number | null
          updated_at: string
          user_id: string
          weekly_schedule: Json | null
          work_verification: string | null
        }
        Insert: {
          bio?: string | null
          category_id?: string | null
          certifications?: Json | null
          created_at?: string
          currency?: string | null
          current_company?: string | null
          education?: Json | null
          experience_years?: number | null
          free_consultation?: boolean | null
          headline?: string | null
          hourly_rate?: number | null
          id?: string
          id_document?: string | null
          is_available_now?: boolean
          is_verified?: boolean
          job_role?: string | null
          languages?: string[] | null
          location?: string | null
          package_deals?: Json | null
          past_experience?: Json | null
          rating?: number | null
          response_time?: string | null
          review_count?: number | null
          sessions_completed?: number | null
          skills?: Json | null
          time_off?: Json | null
          time_zone?: string | null
          total_students?: number | null
          updated_at?: string
          user_id: string
          weekly_schedule?: Json | null
          work_verification?: string | null
        }
        Update: {
          bio?: string | null
          category_id?: string | null
          certifications?: Json | null
          created_at?: string
          currency?: string | null
          current_company?: string | null
          education?: Json | null
          experience_years?: number | null
          free_consultation?: boolean | null
          headline?: string | null
          hourly_rate?: number | null
          id?: string
          id_document?: string | null
          is_available_now?: boolean
          is_verified?: boolean
          job_role?: string | null
          languages?: string[] | null
          location?: string | null
          package_deals?: Json | null
          past_experience?: Json | null
          rating?: number | null
          response_time?: string | null
          review_count?: number | null
          sessions_completed?: number | null
          skills?: Json | null
          time_off?: Json | null
          time_zone?: string | null
          total_students?: number | null
          updated_at?: string
          user_id?: string
          weekly_schedule?: Json | null
          work_verification?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_profiles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          languages: string[] | null
          location: string | null
          onboarding_completed: boolean
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          languages?: string[] | null
          location?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          languages?: string[] | null
          location?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          bid_amount: number
          created_at: string
          estimated_sessions: number | null
          id: string
          mentor_id: string
          message: string | null
          requirement_id: string
          status: string
          updated_at: string
        }
        Insert: {
          bid_amount: number
          created_at?: string
          estimated_sessions?: number | null
          id?: string
          mentor_id: string
          message?: string | null
          requirement_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          bid_amount?: number
          created_at?: string
          estimated_sessions?: number | null
          id?: string
          mentor_id?: string
          message?: string | null
          requirement_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      requirements: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string
          deadline: string | null
          description: string
          id: string
          learner_id: string
          mode: string | null
          proposal_count: number | null
          skills: string[] | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          learner_id: string
          mode?: string | null
          proposal_count?: number | null
          skills?: string[] | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          learner_id?: string
          mode?: string | null
          proposal_count?: number | null
          skills?: string[] | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          learner_id: string
          mentor_id: string
          rating: number
          session_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          learner_id: string
          mentor_id: string
          rating: number
          session_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          learner_id?: string
          mentor_id?: string
          rating?: number
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          duration: number
          id: string
          learner_id: string
          meeting_url: string | null
          mentor_id: string
          notes: string | null
          recording_url: string | null
          scheduled_date: string
          scheduled_time: string
          status: string
          topic: string
          total_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration?: number
          id?: string
          learner_id: string
          meeting_url?: string | null
          mentor_id: string
          notes?: string | null
          recording_url?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: string
          topic?: string
          total_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration?: number
          id?: string
          learner_id?: string
          meeting_url?: string | null
          mentor_id?: string
          notes?: string | null
          recording_url?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string
          topic?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "learner" | "mentor" | "admin"
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
    Enums: {
      app_role: ["learner", "mentor", "admin"],
    },
  },
} as const
