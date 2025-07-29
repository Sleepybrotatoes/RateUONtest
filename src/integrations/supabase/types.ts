export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          requirements: Json | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          requirements?: Json | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          requirements?: Json | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          bookmarkable_id: string
          bookmarkable_type: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          bookmarkable_id: string
          bookmarkable_type: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          bookmarkable_id?: string
          bookmarkable_type?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      buildings: {
        Row: {
          accessibility_rating: number | null
          building_type: string | null
          cleanliness_rating: number | null
          code: string | null
          contact_info: Json | null
          created_at: string | null
          description: string | null
          facilities: string[] | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
          operating_hours: Json | null
          overall_rating: number | null
          study_spaces_rating: number | null
          total_reviews: number | null
          updated_at: string | null
          wifi_rating: number | null
        }
        Insert: {
          accessibility_rating?: number | null
          building_type?: string | null
          cleanliness_rating?: number | null
          code?: string | null
          contact_info?: Json | null
          created_at?: string | null
          description?: string | null
          facilities?: string[] | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name: string
          operating_hours?: Json | null
          overall_rating?: number | null
          study_spaces_rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          wifi_rating?: number | null
        }
        Update: {
          accessibility_rating?: number | null
          building_type?: string | null
          cleanliness_rating?: number | null
          code?: string | null
          contact_info?: Json | null
          created_at?: string | null
          description?: string | null
          facilities?: string[] | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string
          operating_hours?: Json | null
          overall_rating?: number | null
          study_spaces_rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          wifi_rating?: number | null
        }
        Relationships: []
      }
      cafes: {
        Row: {
          atmosphere_rating: number | null
          building_id: string | null
          contact_info: Json | null
          created_at: string | null
          cuisine_type: string[] | null
          description: string | null
          food_quality_rating: number | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          menu_url: string | null
          name: string
          operating_hours: Json | null
          overall_rating: number | null
          price_range: string | null
          service_rating: number | null
          total_reviews: number | null
          updated_at: string | null
          value_rating: number | null
        }
        Insert: {
          atmosphere_rating?: number | null
          building_id?: string | null
          contact_info?: Json | null
          created_at?: string | null
          cuisine_type?: string[] | null
          description?: string | null
          food_quality_rating?: number | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          menu_url?: string | null
          name: string
          operating_hours?: Json | null
          overall_rating?: number | null
          price_range?: string | null
          service_rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          value_rating?: number | null
        }
        Update: {
          atmosphere_rating?: number | null
          building_id?: string | null
          contact_info?: Json | null
          created_at?: string | null
          cuisine_type?: string[] | null
          description?: string | null
          food_quality_rating?: number | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          menu_url?: string | null
          name?: string
          operating_hours?: Json | null
          overall_rating?: number | null
          price_range?: string | null
          service_rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          value_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cafes_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      course_professors: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          professor_id: string
          semester: string | null
          year: number | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          professor_id: string
          semester?: string | null
          year?: number | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          professor_id?: string
          semester?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "course_professors_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_professors_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          created_at: string | null
          credits: number | null
          department: string | null
          description: string | null
          difficulty_rating: number | null
          id: string
          level: string | null
          name: string
          overall_rating: number | null
          prerequisites: string[] | null
          total_reviews: number | null
          updated_at: string | null
          usefulness_rating: number | null
          workload_rating: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          credits?: number | null
          department?: string | null
          description?: string | null
          difficulty_rating?: number | null
          id?: string
          level?: string | null
          name: string
          overall_rating?: number | null
          prerequisites?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          usefulness_rating?: number | null
          workload_rating?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          credits?: number | null
          department?: string | null
          description?: string | null
          difficulty_rating?: number | null
          id?: string
          level?: string | null
          name?: string
          overall_rating?: number | null
          prerequisites?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          usefulness_rating?: number | null
          workload_rating?: number | null
        }
        Relationships: []
      }
      flags: {
        Row: {
          created_at: string | null
          description: string | null
          flaggable_id: string
          flaggable_type: string
          id: string
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          flaggable_id: string
          flaggable_type: string
          id?: string
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          flaggable_id?: string
          flaggable_type?: string
          id?: string
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      forum_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string | null
          downvotes: number | null
          flag_reason: string | null
          id: string
          is_anonymous: boolean | null
          is_flagged: boolean | null
          is_moderated: boolean | null
          thread_id: string
          updated_at: string | null
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          downvotes?: number | null
          flag_reason?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          is_moderated?: boolean | null
          thread_id: string
          updated_at?: string | null
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          downvotes?: number | null
          flag_reason?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          is_moderated?: boolean | null
          thread_id?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          category_id: string | null
          content: string
          created_at: string | null
          downvotes: number | null
          flag_reason: string | null
          id: string
          is_anonymous: boolean | null
          is_flagged: boolean | null
          is_locked: boolean | null
          is_moderated: boolean | null
          is_pinned: boolean | null
          last_reply_at: string | null
          last_reply_user_id: string | null
          reply_count: number | null
          title: string
          updated_at: string | null
          upvotes: number | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string | null
          downvotes?: number | null
          flag_reason?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          is_locked?: boolean | null
          is_moderated?: boolean | null
          is_pinned?: boolean | null
          last_reply_at?: string | null
          last_reply_user_id?: string | null
          reply_count?: number | null
          title: string
          updated_at?: string | null
          upvotes?: number | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string | null
          downvotes?: number | null
          flag_reason?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          is_locked?: boolean | null
          is_moderated?: boolean | null
          is_pinned?: boolean | null
          last_reply_at?: string | null
          last_reply_user_id?: string | null
          reply_count?: number | null
          title?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          is_flagged: boolean | null
          is_moderated: boolean | null
          related_id: string
          related_type: string
          url: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          is_moderated?: boolean | null
          related_id: string
          related_type: string
          url: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          is_moderated?: boolean | null
          related_id?: string
          related_type?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      professors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          email: string | null
          id: string
          name: string
          office_location: string | null
          overall_rating: number | null
          title: string | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          name: string
          office_location?: string | null
          overall_rating?: number | null
          title?: string | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          name?: string
          office_location?: string | null
          overall_rating?: number | null
          title?: string | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          is_banned: boolean | null
          karma_points: number | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_banned?: boolean | null
          karma_points?: number | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_banned?: boolean | null
          karma_points?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string
          created_at: string | null
          downvotes: number | null
          flag_reason: string | null
          id: string
          is_anonymous: boolean | null
          is_flagged: boolean | null
          is_moderated: boolean | null
          is_verified: boolean | null
          overall_rating: number
          reviewable_id: string
          reviewable_type: string
          semester: string | null
          specific_ratings: Json | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          upvotes: number | null
          user_id: string
          year: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          downvotes?: number | null
          flag_reason?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          is_moderated?: boolean | null
          is_verified?: boolean | null
          overall_rating: number
          reviewable_id: string
          reviewable_type: string
          semester?: string | null
          specific_ratings?: Json | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          upvotes?: number | null
          user_id: string
          year?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          downvotes?: number | null
          flag_reason?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          is_moderated?: boolean | null
          is_verified?: boolean | null
          overall_rating?: number
          reviewable_id?: string
          reviewable_type?: string
          semester?: string | null
          specific_ratings?: Json | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          votable_id: string
          votable_type: string
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          votable_id: string
          votable_type: string
          vote_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          votable_id?: string
          votable_type?: string
          vote_type?: string
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
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "moderator" | "admin"
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
      app_role: ["user", "moderator", "admin"],
    },
  },
} as const
