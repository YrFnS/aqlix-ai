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
      attachment_processing_runs: TableDefinition<
        {
          attachment_id: string;
          attempt: number;
          character_count: number;
          completed_at: string | null;
          created_at: string;
          created_by: string;
          failure_code: string | null;
          failure_message: string | null;
          id: string;
          processor: string;
          processor_version: string;
          source_count: number;
          started_at: string;
          status: string;
          updated_at: string;
          workspace_id: string;
        },
        {
          attachment_id: string;
          attempt: number;
          character_count?: number;
          completed_at?: string | null;
          created_at?: string;
          created_by: string;
          failure_code?: string | null;
          failure_message?: string | null;
          id?: string;
          processor: string;
          processor_version: string;
          source_count?: number;
          started_at?: string;
          status?: string;
          updated_at?: string;
          workspace_id: string;
        },
        {
          attachment_id?: string;
          attempt?: number;
          character_count?: number;
          completed_at?: string | null;
          created_at?: string;
          created_by?: string;
          failure_code?: string | null;
          failure_message?: string | null;
          id?: string;
          processor?: string;
          processor_version?: string;
          source_count?: number;
          started_at?: string;
          status?: string;
          updated_at?: string;
          workspace_id?: string;
        }
      >;
      attachments: TableDefinition<
        {
          byte_size: number;
          content_sha256: string | null;
          created_at: string;
          deleted_at: string | null;
          failure_code: string | null;
          failure_reason: string | null;
          file_name: string;
          id: string;
          media_type: string;
          processed_at: string | null;
          processor_version: string | null;
          source_count: number;
          status: string;
          storage_path: string;
          updated_at: string;
          uploaded_by: string;
          workspace_id: string;
        },
        {
          byte_size: number;
          content_sha256?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          failure_code?: string | null;
          failure_reason?: string | null;
          file_name: string;
          id?: string;
          media_type: string;
          processed_at?: string | null;
          processor_version?: string | null;
          source_count?: number;
          status?: string;
          storage_path: string;
          updated_at?: string;
          uploaded_by: string;
          workspace_id: string;
        },
        {
          byte_size?: number;
          content_sha256?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          failure_code?: string | null;
          failure_reason?: string | null;
          file_name?: string;
          id?: string;
          media_type?: string;
          processed_at?: string | null;
          processor_version?: string | null;
          source_count?: number;
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
      draft_generations: TableDefinition<
        {
          action: string;
          applied_at: string | null;
          base_version: number;
          completed_at: string | null;
          created_at: string;
          created_by: string;
          discarded_at: string | null;
          draft_id: string;
          failure_code: string | null;
          failure_message: string | null;
          first_token_latency_ms: number | null;
          id: string;
          input_tokens: number | null;
          instruction: string;
          latency_ms: number | null;
          output_tokens: number | null;
          proposed_content: string;
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
          action: string;
          applied_at?: string | null;
          base_version: number;
          completed_at?: string | null;
          created_at?: string;
          created_by: string;
          discarded_at?: string | null;
          draft_id: string;
          failure_code?: string | null;
          failure_message?: string | null;
          first_token_latency_ms?: number | null;
          id?: string;
          input_tokens?: number | null;
          instruction: string;
          latency_ms?: number | null;
          output_tokens?: number | null;
          proposed_content?: string;
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
          action?: string;
          applied_at?: string | null;
          base_version?: number;
          completed_at?: string | null;
          created_at?: string;
          created_by?: string;
          discarded_at?: string | null;
          draft_id?: string;
          failure_code?: string | null;
          failure_message?: string | null;
          first_token_latency_ms?: number | null;
          id?: string;
          input_tokens?: number | null;
          instruction?: string;
          latency_ms?: number | null;
          output_tokens?: number | null;
          proposed_content?: string;
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
      draft_provenance: TableDefinition<
        {
          attachment_id: string | null;
          citation_order: number;
          conversation_id: string | null;
          created_at: string;
          draft_id: string;
          end_line_snapshot: number | null;
          file_name_snapshot: string;
          id: string;
          label: string;
          media_type_snapshot: string;
          origin_message_id: string | null;
          page_number_snapshot: number | null;
          source_id: string | null;
          source_ordinal_snapshot: number;
          start_line_snapshot: number | null;
          workspace_id: string;
        },
        {
          attachment_id?: string | null;
          citation_order: number;
          conversation_id?: string | null;
          created_at?: string;
          draft_id: string;
          end_line_snapshot?: number | null;
          file_name_snapshot: string;
          id?: string;
          label: string;
          media_type_snapshot: string;
          origin_message_id?: string | null;
          page_number_snapshot?: number | null;
          source_id?: string | null;
          source_ordinal_snapshot: number;
          start_line_snapshot?: number | null;
          workspace_id: string;
        },
        {
          attachment_id?: string | null;
          citation_order?: number;
          conversation_id?: string | null;
          created_at?: string;
          draft_id?: string;
          end_line_snapshot?: number | null;
          file_name_snapshot?: string;
          id?: string;
          label?: string;
          media_type_snapshot?: string;
          origin_message_id?: string | null;
          page_number_snapshot?: number | null;
          source_id?: string | null;
          source_ordinal_snapshot?: number;
          start_line_snapshot?: number | null;
          workspace_id?: string;
        }
      >;
      draft_versions: TableDefinition<
        {
          content: string;
          created_at: string;
          created_by: string;
          direction: string;
          draft_id: string;
          generation_id: string | null;
          id: string;
          kind: string;
          restored_from_version: number | null;
          source_kind: string;
          title: string;
          version_number: number;
          workspace_id: string;
        },
        {
          content: string;
          created_at?: string;
          created_by: string;
          direction: string;
          draft_id: string;
          generation_id?: string | null;
          id?: string;
          kind: string;
          restored_from_version?: number | null;
          source_kind: string;
          title: string;
          version_number: number;
          workspace_id: string;
        },
        {
          content?: string;
          created_at?: string;
          created_by?: string;
          direction?: string;
          draft_id?: string;
          generation_id?: string | null;
          id?: string;
          kind?: string;
          restored_from_version?: number | null;
          source_kind?: string;
          title?: string;
          version_number?: number;
          workspace_id?: string;
        }
      >;
      drafts: TableDefinition<
        {
          archived_at: string | null;
          content: string;
          conversation_id: string | null;
          created_at: string;
          created_by: string;
          current_version: number;
          direction: string;
          id: string;
          kind: string;
          last_saved_at: string;
          origin_message_id: string | null;
          provenance_count: number;
          status: string;
          title: string;
          updated_at: string;
          version_count: number;
          workspace_id: string;
        },
        {
          archived_at?: string | null;
          content?: string;
          conversation_id?: string | null;
          created_at?: string;
          created_by: string;
          current_version?: number;
          direction?: string;
          id?: string;
          kind?: string;
          last_saved_at?: string;
          origin_message_id?: string | null;
          provenance_count?: number;
          status?: string;
          title?: string;
          updated_at?: string;
          version_count?: number;
          workspace_id: string;
        },
        {
          archived_at?: string | null;
          content?: string;
          conversation_id?: string | null;
          created_at?: string;
          created_by?: string;
          current_version?: number;
          direction?: string;
          id?: string;
          kind?: string;
          last_saved_at?: string;
          origin_message_id?: string | null;
          provenance_count?: number;
          status?: string;
          title?: string;
          updated_at?: string;
          version_count?: number;
          workspace_id?: string;
        }
      >;
      message_citations: TableDefinition<
        {
          attachment_id: string | null;
          citation_order: number;
          conversation_id: string;
          created_at: string;
          end_line_snapshot: number | null;
          file_name_snapshot: string;
          id: string;
          label: string;
          media_type_snapshot: string;
          message_id: string;
          page_number_snapshot: number | null;
          source_id: string | null;
          source_ordinal_snapshot: number;
          start_line_snapshot: number | null;
          workspace_id: string;
        },
        {
          attachment_id?: string | null;
          citation_order: number;
          conversation_id: string;
          created_at?: string;
          end_line_snapshot?: number | null;
          file_name_snapshot: string;
          id?: string;
          label: string;
          media_type_snapshot: string;
          message_id: string;
          page_number_snapshot?: number | null;
          source_id?: string | null;
          source_ordinal_snapshot: number;
          start_line_snapshot?: number | null;
          workspace_id: string;
        },
        {
          attachment_id?: string | null;
          citation_order?: number;
          conversation_id?: string;
          created_at?: string;
          end_line_snapshot?: number | null;
          file_name_snapshot?: string;
          id?: string;
          label?: string;
          media_type_snapshot?: string;
          message_id?: string;
          page_number_snapshot?: number | null;
          source_id?: string | null;
          source_ordinal_snapshot?: number;
          start_line_snapshot?: number | null;
          workspace_id?: string;
        }
      >;
      message_generations: TableDefinition<
        {
          citation_count: number;
          completed_at: string | null;
          conversation_id: string;
          created_at: string;
          created_by: string;
          failure_code: string | null;
          failure_message: string | null;
          first_token_latency_ms: number | null;
          grounding_mode: string;
          id: string;
          input_tokens: number | null;
          latency_ms: number | null;
          message_id: string;
          output_tokens: number | null;
          provider: string;
          provider_response_id: string | null;
          reasoning_tokens: number | null;
          requested_model: string;
          retrieved_source_count: number;
          returned_model: string | null;
          started_at: string;
          status: string;
          total_tokens: number | null;
          updated_at: string;
          workspace_id: string;
        },
        {
          citation_count?: number;
          completed_at?: string | null;
          conversation_id: string;
          created_at?: string;
          created_by: string;
          failure_code?: string | null;
          failure_message?: string | null;
          first_token_latency_ms?: number | null;
          grounding_mode?: string;
          id?: string;
          input_tokens?: number | null;
          latency_ms?: number | null;
          message_id: string;
          output_tokens?: number | null;
          provider: string;
          provider_response_id?: string | null;
          reasoning_tokens?: number | null;
          requested_model: string;
          retrieved_source_count?: number;
          returned_model?: string | null;
          started_at?: string;
          status?: string;
          total_tokens?: number | null;
          updated_at?: string;
          workspace_id: string;
        },
        {
          citation_count?: number;
          completed_at?: string | null;
          conversation_id?: string;
          created_at?: string;
          created_by?: string;
          failure_code?: string | null;
          failure_message?: string | null;
          first_token_latency_ms?: number | null;
          grounding_mode?: string;
          id?: string;
          input_tokens?: number | null;
          latency_ms?: number | null;
          message_id?: string;
          output_tokens?: number | null;
          provider?: string;
          provider_response_id?: string | null;
          reasoning_tokens?: number | null;
          requested_model?: string;
          retrieved_source_count?: number;
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
          end_line: number | null;
          end_offset: number | null;
          id: string;
          ordinal: number;
          page_number: number | null;
          search_vector: unknown;
          start_line: number | null;
          start_offset: number | null;
          workspace_id: string;
        },
        {
          attachment_id: string;
          content: string;
          created_at?: string;
          end_line?: number | null;
          end_offset?: number | null;
          id?: string;
          ordinal: number;
          page_number?: number | null;
          search_vector?: never;
          start_line?: number | null;
          start_offset?: number | null;
          workspace_id: string;
        },
        {
          attachment_id?: string;
          content?: string;
          created_at?: string;
          end_line?: number | null;
          end_offset?: number | null;
          id?: string;
          ordinal?: number;
          page_number?: number | null;
          search_vector?: never;
          start_line?: number | null;
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
      apply_draft_generation: {
        Args: {
          target_draft_id: string;
          target_generation_id: string;
          target_workspace_id: string;
        };
        Returns: number;
      };
      attachment_id_from_storage_path: {
        Args: { object_name: string };
        Returns: string | null;
      };
      begin_attachment_processing: {
        Args: {
          normalized_media_type: string;
          original_byte_size: number;
          original_content_sha256: string;
          original_file_name: string;
          requested_processor: string;
          requested_processor_version: string;
          target_workspace_id: string;
        };
        Returns: {
          attachment_id: string;
          object_path: string;
          processing_run_id: string;
        }[];
      };
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
      begin_draft_generation: {
        Args: {
          requested_action: string;
          requested_instruction: string;
          requested_model: string;
          requested_provider: string;
          target_draft_id: string;
          target_workspace_id: string;
        };
        Returns: {
          base_content: string;
          base_direction: string;
          base_title: string;
          base_version: number;
          draft_kind: string;
          generation_id: string;
        }[];
      };
      can_delete_workspace_document_object: {
        Args: { object_name: string };
        Returns: boolean;
      };
      can_insert_workspace_document_object: {
        Args: { object_name: string };
        Returns: boolean;
      };
      can_read_workspace_document_object: {
        Args: { object_name: string };
        Returns: boolean;
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
      checkpoint_draft_generation: {
        Args: {
          first_token_ms?: number | null;
          partial_content: string;
          target_draft_id: string;
          target_generation_id: string;
          target_workspace_id: string;
        };
        Returns: undefined;
      };
      create_draft_from_message: {
        Args: {
          requested_content: string;
          requested_direction: string;
          requested_kind: string;
          requested_title: string;
          target_conversation_id: string;
          target_message_id: string;
          target_workspace_id: string;
        };
        Returns: {
          current_version: number;
          draft_id: string;
          provenance_count: number;
        }[];
      };
      delete_attachment_record: {
        Args: {
          target_attachment_id: string;
          target_workspace_id: string;
        };
        Returns: boolean;
      };
      delete_draft_record: {
        Args: {
          target_draft_id: string;
          target_workspace_id: string;
        };
        Returns: boolean;
      };
      discard_draft_generation: {
        Args: {
          target_draft_id: string;
          target_generation_id: string;
          target_workspace_id: string;
        };
        Returns: boolean;
      };
      fail_attachment_processing: {
        Args: {
          processing_failure_code: string;
          processing_failure_message: string;
          target_attachment_id: string;
          target_processing_run_id: string;
          target_workspace_id: string;
        };
        Returns: undefined;
      };
      finalize_attachment_processing: {
        Args: {
          extracted_passages: Json;
          normalized_character_count: number;
          target_attachment_id: string;
          target_processing_run_id: string;
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
      finish_draft_generation: {
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
          target_draft_id: string;
          target_generation_id: string;
          target_workspace_id: string;
          total_latency_ms?: number | null;
        };
        Returns: undefined;
      };
      finish_grounded_conversation_generation: {
        Args: {
          cited_sources?: Json;
          final_content: string;
          first_token_ms?: number | null;
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
      is_workspace_active: {
        Args: { target_workspace_id: string };
        Returns: boolean;
      };
      is_workspace_member: {
        Args: { target_workspace_id: string };
        Returns: boolean;
      };
      normalize_mixed_script_search_text: {
        Args: { value: string };
        Returns: string;
      };
      save_draft_version: {
        Args: {
          expected_version: number;
          requested_content: string;
          requested_direction: string;
          requested_kind: string;
          requested_restored_from_version?: number | null;
          requested_source_kind?: string;
          requested_title: string;
          target_draft_id: string;
          target_workspace_id: string;
        };
        Returns: {
          created: boolean;
          version_number: number;
        }[];
      };
      search_workspace_sources: {
        Args: {
          result_limit?: number;
          source_query: string;
          target_workspace_id: string;
        };
        Returns: {
          attachment_id: string;
          content: string;
          end_line: number | null;
          file_name: string;
          media_type: string;
          ordinal: number;
          page_number: number | null;
          rank: number;
          source_id: string;
          start_line: number | null;
        }[];
      };
      set_draft_archived: {
        Args: {
          should_archive: boolean;
          target_draft_id: string;
          target_workspace_id: string;
        };
        Returns: boolean;
      };
      set_generation_grounding_context: {
        Args: {
          requested_grounding_mode: string;
          retrieved_sources: number;
          target_conversation_id: string;
          target_generation_id: string;
          target_message_id: string;
          target_workspace_id: string;
        };
        Returns: undefined;
      };
      workspace_id_from_storage_path: {
        Args: { object_name: string };
        Returns: string | null;
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
    ? keyof DatabaseWithoutInternals[DefaultSchemaCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
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
