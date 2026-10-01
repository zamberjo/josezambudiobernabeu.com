export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  api: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      experience: {
        Row: {
          period: Json | null
          position: number | null
          role: string | null
          summary: Json | null
        }
        Insert: {
          period?: Json | null
          position?: number | null
          role?: string | null
          summary?: Json | null
        }
        Update: {
          period?: Json | null
          position?: number | null
          role?: string | null
          summary?: Json | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          body: Json | null
          cover: string | null
          excerpt: Json | null
          position: number | null
          published_on: string | null
          reading_time: number | null
          slug: string | null
          status: Database["public"]["Enums"]["post_status"] | null
          tags: string[] | null
          title: Json | null
        }
        Insert: {
          body?: Json | null
          cover?: string | null
          excerpt?: Json | null
          position?: number | null
          published_on?: string | null
          reading_time?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          tags?: string[] | null
          title?: Json | null
        }
        Update: {
          body?: Json | null
          cover?: string | null
          excerpt?: Json | null
          position?: number | null
          published_on?: string | null
          reading_time?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          tags?: string[] | null
          title?: Json | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          description: Json | null
          featured: boolean | null
          name: string | null
          position: number | null
          production_url: string | null
          project_url: string | null
          technologies: string[] | null
        }
        Insert: {
          description?: Json | null
          featured?: boolean | null
          name?: string | null
          position?: number | null
          production_url?: string | null
          project_url?: string | null
          technologies?: string[] | null
        }
        Update: {
          description?: Json | null
          featured?: boolean | null
          name?: string | null
          position?: number | null
          production_url?: string | null
          project_url?: string | null
          technologies?: string[] | null
        }
        Relationships: []
      }
      site_sections: {
        Row: {
          key: Database["public"]["Enums"]["site_section"] | null
          value: Json | null
        }
        Insert: {
          key?: Database["public"]["Enums"]["site_section"] | null
          value?: Json | null
        }
        Update: {
          key?: Database["public"]["Enums"]["site_section"] | null
          value?: Json | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          accent: boolean | null
          detail: Json | null
          level: number | null
          name: string | null
          position: number | null
        }
        Insert: {
          accent?: boolean | null
          detail?: Json | null
          level?: number | null
          name?: string | null
          position?: number | null
        }
        Update: {
          accent?: boolean | null
          detail?: Json | null
          level?: number | null
          name?: string | null
          position?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          created_at: string
          id: string
          period: Json
          position: number
          role: string
          summary: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          period: Json
          position?: number
          role: string
          summary: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          period?: Json
          position?: number
          role?: string
          summary?: Json
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          body: Json
          cover: string | null
          created_at: string
          excerpt: Json
          id: string
          position: number
          published_on: string | null
          reading_time: number | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          tags: string[]
          title: Json
          updated_at: string
        }
        Insert: {
          body?: Json
          cover?: string | null
          created_at?: string
          excerpt: Json
          id?: string
          position?: number
          published_on?: string | null
          reading_time?: number | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          tags?: string[]
          title: Json
          updated_at?: string
        }
        Update: {
          body?: Json
          cover?: string | null
          created_at?: string
          excerpt?: Json
          id?: string
          position?: number
          published_on?: string | null
          reading_time?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          tags?: string[]
          title?: Json
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: Json
          featured: boolean
          id: string
          name: string
          position: number
          production_url: string | null
          project_url: string
          technologies: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: Json
          featured?: boolean
          id?: string
          name: string
          position?: number
          production_url?: string | null
          project_url: string
          technologies?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: Json
          featured?: boolean
          id?: string
          name?: string
          position?: number
          production_url?: string | null
          project_url?: string
          technologies?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      site_sections: {
        Row: {
          key: Database["public"]["Enums"]["site_section"]
          updated_at: string
          value: Json
        }
        Insert: {
          key: Database["public"]["Enums"]["site_section"]
          updated_at?: string
          value: Json
        }
        Update: {
          key?: Database["public"]["Enums"]["site_section"]
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      skills: {
        Row: {
          accent: boolean
          created_at: string
          detail: Json
          id: string
          level: number
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          accent?: boolean
          created_at?: string
          detail: Json
          id?: string
          level: number
          name: string
          position?: number
          updated_at?: string
        }
        Update: {
          accent?: boolean
          created_at?: string
          detail?: Json
          id?: string
          level?: number
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_localized: { Args: { value: Json }; Returns: boolean }
      is_localized_array: { Args: { value: Json }; Returns: boolean }
      post_body_schema: { Args: never; Returns: Json }
      reorder: {
        Args: { collection: string; ids: string[] }
        Returns: undefined
      }
    }
    Enums: {
      post_status: "published" | "draft"
      site_section:
        | "meta"
        | "social"
        | "nav"
        | "hero"
        | "about"
        | "blog"
        | "education"
        | "quote"
        | "footer"
        | "ui"
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
  api: {
    Enums: {},
  },
  public: {
    Enums: {
      post_status: ["published", "draft"],
      site_section: [
        "meta",
        "social",
        "nav",
        "hero",
        "about",
        "blog",
        "education",
        "quote",
        "footer",
        "ui",
      ],
    },
  },
} as const

