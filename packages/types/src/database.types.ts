export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableDefinition<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      attachments: TableDefinition<
        {
          byte_size: number;
          created_at: string;
          deleted_at: string | null;
          failure_reason: string | null;
          file_name: string;
          id: string;
          media_type: string;
          status: string;
          storage_path: string;
          updated_at: string;
          uploaded_by: string;
          workspace_id: string;
        },
        {
          byte_size: number;
          created_at?: string;
          deleted_at?: string | null;
          failure_reason?: string | null;
          file_name: string;
          id?: string;
          media_type: string;
          status?: string;
          storage_path: string;
          updated_at?: string;
          uploaded_by: string;
          workspace_id: string;
        },
        {
          byte_size?: number;
          created_at?: string;
          deleted_at?: string | null;
          failure_reason?: string | null;
          file_name?: string;
          id?: string;
          media_type?: string;
          status?: string;
          storage_path?: string;
          updated_at?: string;
          uploaded_by?: string;
          workspace_id?: string;
        }
      >;
      conversations: TableDefinition<
        {
          created_at: string;
          created_by: string;
          id: string;
          status: string;
          title: string;
          updated_at: string;
          workspace_id: string;
        },
        {
          created_at?: string;
          created_by: string;
          id?: string;
          status?: string;
          title?: string;
          updated_at?: string;
          workspace_id: string;
        },
        {
          created_at?: string;
          created_by?: string;
          id?: string;
          status?: string;
          title?: string;
          updated_at?: string;
          workspace_id?: string;
        }
      >;
      drafts: TableDefinition<
        {
          content: string;
          conversation_id: string | null;
          created_at: string;
          created_by: string;
          direction: string;
          id: string;
          status: string;
          title: string;
          updated_at: string;
          workspace_id: string;
        },
        {
          content?: string;
          conversation_id?: string | null;
          created_at?: string;
          created_by: string;
          direction?: string;
          id?: string;
          status?: string;
          title?: string;
          updated_at?: string;
          workspace_id: string;
        },
        {
          content?: string;
          conversation_id?: string | null;
          created_at?: string;
          created_by?: string;
          direction?: string;
          id?: string;
          status?: string;
          title?: string;
          updated_at?: string;
          workspace_id?: string;
        }
      >;
      message_generations: TableDefinition<
        {
          completed_at: string | null;
          conversation_id: string;
          created_at: string;
          created_by: string;
          failure_code: string | null;
          failure_message: string | null;
          first_token_latency_ms: number | null;
          id: string;
          input_tokens: number | null;
          latency_ms: number | null;
          message_id: string;
          output_tokens: number | null;
          provider: string;
          provider_response_id: string | null;
          reasoning_tokens: number | null;
          requested_model: string;
          returned_model: string | null;
          started_at: string;
          status: string;
          total_tokens: number | null;
          updated_at: string;
          workspace_id: string;
        },
        {
          completed_at?: string | null;
          conversation_id: string;
          created_at?: string;
          created_by: string;
          failure_code?: string | null;
          failure_message?: string | null;
          first_token_latency_ms?: number | null;
          id?: string;
          input_tokens?: number | null;
          latency_ms?: number | null;
          message_id: string;
          output_tokens?: number | null;
          provider: string;
          provider_response_id?: string | null;
          reasoning_tokens?: number | null;
          requested_model: string;
          returned_model?: string | null;
          started_at?: string;
          status?: string;
          total_tokens?: number | null;
          updated_at?: string;
          workspace_id: string;
        },
        {
          completed_at?: string | null;
          conversation_id?: string;
          created_at?: string;
          created_by?: string;
          failure_code?: string | null;
          failure_message?: string | null;
          first_token_latency_ms?: number | null;
          id?: string;
          input_tokens?: number | null;
          latency_ms?: number | null;
          message_id?: string;
          output_tokens?: number | null;
          provider?: string;
          provider_response_id?: string | null;
          reasoning_tokens?: number | null;
          requested_model?: string;
          returned_model?: string | null;
          started_at?: string;
          status?: string;
          total_tokens?: number | null;
          updated_at?: string;
          workspace_id?: string;
        }
      >;
      messages: TableDefinition<
        {
          content: string;
          conversation_id: string;
          created_at: string;
          created_by: string | null;
          direction: string;
          id: string;
          role: string;
          sequence: number;
          status: string;
          updated_at: string;
          workspace_id: string;
        },
        {
          content?: string;
          conversation_id: string;
          created_at?: string;
          created_by?: string | null;
          direction?: string;
          id?: string;
          role: string;
          sequence: number;
          status?: string;
          updated_at?: string;
          workspace_id: string;
        },
        {
          content?: string;
          conversation_id?: string;
          created_at?: string;
          created_by?: string | null;
          direction?: string;
          id?: string;
          role?: string;
          sequence?: number;
          status?: string;
          updated_at?: string;
          workspace_id?: string;
        }
      >;
      sources: TableDefinition<
        {
          attachment_id: string;
          content: string;
          created_at: string;
          end_offset: number | null;
          id: string;
          ordinal: number;
          page_number: number | null;
          start_offset: number | null;
          workspace_id: string;
        },
        {
          attachment_id: string;
          content: string;
          created_at?: string;
          end_offset?: number | null;
          id?: string;
          ordinal: number;
          page_number?: number | null;
          start_offset?: number | null;
          workspace_id: string;
        },
        {
          attachment_id?: string;
          content?: string;
          created_at?: string;
          end_offset?: number | null;
          id?: string;
          ordinal?: number;
          page_number?: number | null;
          start_offset?: number | null;
          workspace_id?: string;
        }
      >;
      workspace_members: TableDefinition<
        {
          created_at: string;
          role: string;
          user_id: string;
          workspace_id: string;
        },
        {
          created_at?: string;
          role: string;
          user_id: string;
          workspace_id: string;
        },
        {
          created_at?: string;
          role?: string;
          user_id?: string;
          workspace_id?: string;
        }
      >;
      workspaces: TableDefinition<
        {
          archived_at: string | null;
          created_at: string;
          default_language: string;
          description: string | null;
          id: string;
          name: string;
          owner_id: string;
          updated_at: string;
        },
        {
          archived_at?: string | null;
          created_at?: string;
          default_language?: string;
          description?: string | null;
          id?: string;
          name: string;
          owner_id: string;
          updated_at?: string;
        },
        {
          archived_at?: string | null;
          created_at?: string;
          default_language?: string;
          description?: string | null;
          id?: string;
          name?: string;
          owner_id?: string;
          updated_at?: string;
        }
      >;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      begin_conversation_turn: {
        Args: {
          message_content: string | null;
          message_direction: string;
          requested_model: string;
          requested_provider: string;
          retry_message_id?: string | null;
          target_conversation_id: string;
          target_workspace_id: string;
        };
        Returns: {
          assistant_message_id: string;
          assistant_sequence: number;
          generation_id: string;
          prompt_content: string;
          user_message_id: string | null;
          user_sequence: number | null;
        }[];
      };
      checkpoint_conversation_generation: {
        Args: {
          first_token_ms?: number | null;
          partial_content: string;
          target_conversation_id: string;
          target_generation_id: string;
          target_message_id: string;
          target_workspace_id: string;
        };
        Returns: undefined;
      };
      finish_conversation_generation: {
        Args: {
          final_content: string;
          final_status: string;
          first_token_ms?: number | null;
          provider_failure_code?: string | null;
          provider_failure_message?: string | null;
          provider_input_tokens?: number | null;
          provider_output_tokens?: number | null;
          provider_reasoning_tokens?: number | null;
          provider_response_identifier?: string | null;
          provider_total_tokens?: number | null;
          returned_provider_model?: string | null;
          target_conversation_id: string;
          target_generation_id: string;
          target_message_id: string;
          target_workspace_id: string;
          total_latency_ms?: number | null;
        };
        Returns: undefined;
      };
      has_workspace_role: {
        Args: {
          allowed_roles: string[];
          target_workspace_id: string;
        };
        Returns: boolean;
      };
      is_workspace_member: {
        Args: {
          target_workspace_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
