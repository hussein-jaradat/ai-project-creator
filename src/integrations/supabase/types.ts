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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          asset_type: string
          campaign_id: string | null
          created_at: string
          created_by: string
          dimensions: Json | null
          duration_seconds: number | null
          file_size: number | null
          generation_job_id: string | null
          id: string
          is_approved: boolean | null
          is_favorite: boolean | null
          metadata: Json | null
          mime_type: string | null
          name: string | null
          quality_issues: Json | null
          quality_score: number | null
          thumbnail_url: string | null
          url: string
          workspace_id: string
        }
        Insert: {
          asset_type: string
          campaign_id?: string | null
          created_at?: string
          created_by: string
          dimensions?: Json | null
          duration_seconds?: number | null
          file_size?: number | null
          generation_job_id?: string | null
          id?: string
          is_approved?: boolean | null
          is_favorite?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          name?: string | null
          quality_issues?: Json | null
          quality_score?: number | null
          thumbnail_url?: string | null
          url: string
          workspace_id: string
        }
        Update: {
          asset_type?: string
          campaign_id?: string | null
          created_at?: string
          created_by?: string
          dimensions?: Json | null
          duration_seconds?: number | null
          file_size?: number | null
          generation_job_id?: string | null
          id?: string
          is_approved?: boolean | null
          is_favorite?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          name?: string | null
          quality_issues?: Json | null
          quality_score?: number | null
          thumbnail_url?: string | null
          url?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_generation_job_id_fkey"
            columns: ["generation_job_id"]
            isOneToOne: false
            referencedRelation: "generation_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_jobs: {
        Row: {
          analyzed_ideas: Json | null
          created_at: string
          error_message: string | null
          generated_caption: string | null
          generated_prompt: string | null
          generated_video_url: string | null
          id: string
          publish_status: Json | null
          research_query: string | null
          research_results: Json | null
          scheduled_at: string | null
          selected_idea: Json | null
          status: string
          target_platforms: string[] | null
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          analyzed_ideas?: Json | null
          created_at?: string
          error_message?: string | null
          generated_caption?: string | null
          generated_prompt?: string | null
          generated_video_url?: string | null
          id?: string
          publish_status?: Json | null
          research_query?: string | null
          research_results?: Json | null
          scheduled_at?: string | null
          selected_idea?: Json | null
          status?: string
          target_platforms?: string[] | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          analyzed_ideas?: Json | null
          created_at?: string
          error_message?: string | null
          generated_caption?: string | null
          generated_prompt?: string | null
          generated_video_url?: string | null
          id?: string
          publish_status?: Json | null
          research_query?: string | null
          research_results?: Json | null
          scheduled_at?: string | null
          selected_idea?: Json | null
          status?: string
          target_platforms?: string[] | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      automation_settings: {
        Row: {
          auto_publish: boolean | null
          created_at: string
          default_platforms: string[] | null
          id: string
          search_keywords: string[] | null
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          auto_publish?: boolean | null
          created_at?: string
          default_platforms?: string[] | null
          id?: string
          search_keywords?: string[] | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          auto_publish?: boolean | null
          created_at?: string
          default_platforms?: string[] | null
          id?: string
          search_keywords?: string[] | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      brand_kits: {
        Row: {
          additional_guidelines: string | null
          color_palette: Json | null
          created_at: string
          id: string
          is_default: boolean | null
          keywords: string[] | null
          logo_urls: Json | null
          name: string
          reference_examples: Json | null
          tone_of_voice: string | null
          typography: Json | null
          updated_at: string
          words_to_avoid: string[] | null
          workspace_id: string
        }
        Insert: {
          additional_guidelines?: string | null
          color_palette?: Json | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          keywords?: string[] | null
          logo_urls?: Json | null
          name: string
          reference_examples?: Json | null
          tone_of_voice?: string | null
          typography?: Json | null
          updated_at?: string
          words_to_avoid?: string[] | null
          workspace_id: string
        }
        Update: {
          additional_guidelines?: string | null
          color_palette?: Json | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          keywords?: string[] | null
          logo_urls?: Json | null
          name?: string
          reference_examples?: Json | null
          tone_of_voice?: string | null
          typography?: Json | null
          updated_at?: string
          words_to_avoid?: string[] | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_kits_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          brief: Json | null
          created_at: string
          created_by: string
          id: string
          name: string
          objective: string | null
          platforms: string[] | null
          project_id: string
          selected_strategy: Json | null
          status: string
          target_audience: string | null
          updated_at: string
          workflow_stage: string
        }
        Insert: {
          brief?: Json | null
          created_at?: string
          created_by: string
          id?: string
          name: string
          objective?: string | null
          platforms?: string[] | null
          project_id: string
          selected_strategy?: Json | null
          status?: string
          target_audience?: string | null
          updated_at?: string
          workflow_stage?: string
        }
        Update: {
          brief?: Json | null
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          objective?: string | null
          platforms?: string[] | null
          project_id?: string
          selected_strategy?: Json | null
          status?: string
          target_audience?: string | null
          updated_at?: string
          workflow_stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      captions: {
        Row: {
          asset_id: string | null
          call_to_action: string | null
          campaign_id: string | null
          caption_text: string
          created_at: string
          hashtags: string[] | null
          id: string
          is_selected: boolean | null
          platform: string | null
          tone: string | null
        }
        Insert: {
          asset_id?: string | null
          call_to_action?: string | null
          campaign_id?: string | null
          caption_text: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          is_selected?: boolean | null
          platform?: string | null
          tone?: string | null
        }
        Update: {
          asset_id?: string | null
          call_to_action?: string | null
          campaign_id?: string | null
          caption_text?: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          is_selected?: boolean | null
          platform?: string | null
          tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "captions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "captions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_strategies: {
        Row: {
          ai_reasoning: string | null
          campaign_id: string
          content_angle: string | null
          created_at: string
          energy_level: string | null
          example_headline: string | null
          hook_idea: string | null
          id: string
          is_selected: boolean | null
          mood: string | null
          title: string
          visual_style: string | null
        }
        Insert: {
          ai_reasoning?: string | null
          campaign_id: string
          content_angle?: string | null
          created_at?: string
          energy_level?: string | null
          example_headline?: string | null
          hook_idea?: string | null
          id?: string
          is_selected?: boolean | null
          mood?: string | null
          title: string
          visual_style?: string | null
        }
        Update: {
          ai_reasoning?: string | null
          campaign_id?: string
          content_angle?: string | null
          created_at?: string
          energy_level?: string | null
          example_headline?: string | null
          hook_idea?: string | null
          id?: string
          is_selected?: boolean | null
          mood?: string | null
          title?: string
          visual_style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creative_strategies_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      export_packages: {
        Row: {
          assets: Json | null
          campaign_id: string
          created_at: string
          created_by: string
          download_url: string | null
          expires_at: string | null
          format_preset: Json
          id: string
          name: string
          platform: string
        }
        Insert: {
          assets?: Json | null
          campaign_id: string
          created_at?: string
          created_by: string
          download_url?: string | null
          expires_at?: string | null
          format_preset: Json
          id?: string
          name: string
          platform: string
        }
        Update: {
          assets?: Json | null
          campaign_id?: string
          created_at?: string
          created_by?: string
          download_url?: string | null
          expires_at?: string | null
          format_preset?: Json
          id?: string
          name?: string
          platform?: string
        }
        Relationships: [
          {
            foreignKeyName: "export_packages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_content: {
        Row: {
          business_description: string | null
          caption: string | null
          created_at: string | null
          id: string
          image_url: string
          mood: string | null
          platform: string | null
          video_url: string | null
        }
        Insert: {
          business_description?: string | null
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          mood?: string | null
          platform?: string | null
          video_url?: string | null
        }
        Update: {
          business_description?: string | null
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          mood?: string | null
          platform?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      generation_jobs: {
        Row: {
          campaign_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          error_message: string | null
          id: string
          job_type: string
          max_retries: number | null
          model: string
          parameters: Json | null
          priority: number | null
          progress: number | null
          prompt: string
          result_metadata: Json | null
          result_url: string | null
          retry_count: number | null
          seed: string | null
          started_at: string | null
          status: string
          workspace_id: string
        }
        Insert: {
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          error_message?: string | null
          id?: string
          job_type: string
          max_retries?: number | null
          model: string
          parameters?: Json | null
          priority?: number | null
          progress?: number | null
          prompt: string
          result_metadata?: Json | null
          result_url?: string | null
          retry_count?: number | null
          seed?: string | null
          started_at?: string | null
          status?: string
          workspace_id: string
        }
        Update: {
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          error_message?: string | null
          id?: string
          job_type?: string
          max_retries?: number | null
          model?: string
          parameters?: Json | null
          priority?: number | null
          progress?: number | null
          prompt?: string
          result_metadata?: Json | null
          result_url?: string | null
          retry_count?: number | null
          seed?: string | null
          started_at?: string | null
          status?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_jobs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generation_jobs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          provider: string | null
          updated_at: string | null
          user_code: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          provider?: string | null
          updated_at?: string | null
          user_code?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          provider?: string | null
          updated_at?: string | null
          user_code?: string | null
        }
        Relationships: []
      }
      project_memory: {
        Row: {
          content: string
          created_at: string
          id: string
          memory_type: string
          project_id: string
          relevance_score: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          memory_type: string
          project_id: string
          relevance_score?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          memory_type?: string
          project_id?: string
          relevance_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_memory_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          brand_kit_id: string | null
          cover_image_url: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          metadata: Json | null
          name: string
          status: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          brand_kit_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          status?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          brand_kit_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_brand_kit_id_fkey"
            columns: ["brand_kit_id"]
            isOneToOne: false
            referencedRelation: "brand_kits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          created_at: string
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          settings: Json | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          settings?: Json | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          settings?: Json | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_user_code: { Args: never; Returns: string }
      get_user_workspace_ids: { Args: { _user_id: string }; Returns: string[] }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_workspace_member: {
        Args: { _roles?: string[]; _user_id: string; _workspace_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
