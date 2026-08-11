begin;

-- Pin mutable helper search paths and keep cleanup service-only.
alter function public.update_updated_at_column()
  set search_path = pg_catalog, public;
alter function public.update_cultural_islamic_rules_updated_at()
  set search_path = pg_catalog, public;
alter function public.cleanup_expired_validation_results()
  set search_path = pg_catalog, public;
alter function public.update_cultural_islamic_knowledge_updated_at()
  set search_path = pg_catalog, public;
alter function public.update_user_compliance_preferences_updated_at()
  set search_path = pg_catalog, public;

revoke all on function public.cleanup_expired_validation_results()
  from public, anon, authenticated;
grant execute on function public.cleanup_expired_validation_results()
  to service_role;

-- Product policies: cache auth identity once per statement rather than once per
-- candidate row. Function references are private because the preceding
-- migration relocated privileged implementations out of the exposed schema.
drop policy if exists workspaces_insert_owner on public.workspaces;
create policy workspaces_insert_owner
  on public.workspaces as permissive for insert to authenticated
  with check (owner_id = (select auth.uid()));

drop policy if exists workspaces_select_member_or_owner on public.workspaces;
create policy workspaces_select_member_or_owner
  on public.workspaces as permissive for select to authenticated
  using (
    owner_id = (select auth.uid())
    or private.is_workspace_member(id)
  );

drop policy if exists conversations_insert_editor on public.conversations;
create policy conversations_insert_editor
  on public.conversations as permissive for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and private.has_workspace_role(
      workspace_id,
      array['owner'::text, 'editor'::text]
    )
  );

drop policy if exists messages_insert_editor on public.messages;
create policy messages_insert_editor
  on public.messages as permissive for insert to authenticated
  with check (
    (created_by is null or created_by = (select auth.uid()))
    and private.has_workspace_role(
      workspace_id,
      array['owner'::text, 'editor'::text]
    )
  );

drop policy if exists message_generations_insert_editor
  on public.message_generations;
create policy message_generations_insert_editor
  on public.message_generations as permissive for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and private.has_workspace_role(
      workspace_id,
      array['owner'::text, 'editor'::text]
    )
  );

drop policy if exists user_ai_settings_select_own on public.user_ai_settings;
create policy user_ai_settings_select_own
  on public.user_ai_settings as permissive for select to authenticated
  using (user_id = (select auth.uid()));

-- Remove broad grants from legacy cultural/authentication tables and keep only
-- operations backed by an explicit account-scoped policy.
revoke all on table
  public.iraqi_user_authentication,
  public.authentication_cultural_context,
  public.iraqi_authentication_sessions,
  public.professional_domain_authentication,
  public.cultural_mfa_configuration,
  public.cultural_islamic_rules,
  public.content_validation_results,
  public.user_compliance_preferences,
  public.compliance_violations,
  public.cultural_islamic_knowledge
from anon, authenticated;

grant select, insert, update on public.iraqi_user_authentication
  to authenticated;
grant select, insert, update on public.authentication_cultural_context
  to authenticated;
grant select, insert on public.iraqi_authentication_sessions
  to authenticated;
grant select, insert, update on public.professional_domain_authentication
  to authenticated;
grant select, insert, update on public.cultural_mfa_configuration
  to authenticated;
grant select on public.cultural_islamic_rules
  to authenticated;
grant select, insert, update, delete on public.user_compliance_preferences
  to authenticated;
grant select on public.compliance_violations
  to authenticated;
grant select on public.cultural_islamic_knowledge
  to authenticated;

-- Replace every legacy public-role policy with a deliberately scoped contract.
drop policy if exists "Users can insert own authentication"
  on public.iraqi_user_authentication;
drop policy if exists "Users can update own authentication"
  on public.iraqi_user_authentication;
drop policy if exists "Users can view own authentication"
  on public.iraqi_user_authentication;

create policy iraqi_user_authentication_select_own
  on public.iraqi_user_authentication for select to authenticated
  using (id = (select auth.uid()));
create policy iraqi_user_authentication_insert_own
  on public.iraqi_user_authentication for insert to authenticated
  with check (id = (select auth.uid()));
create policy iraqi_user_authentication_update_own
  on public.iraqi_user_authentication for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "Users can insert own cultural context"
  on public.authentication_cultural_context;
drop policy if exists "Users can update own cultural context"
  on public.authentication_cultural_context;
drop policy if exists "Users can view own cultural context"
  on public.authentication_cultural_context;

create policy authentication_cultural_context_select_own
  on public.authentication_cultural_context for select to authenticated
  using (user_id = (select auth.uid()));
create policy authentication_cultural_context_insert_own
  on public.authentication_cultural_context for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy authentication_cultural_context_update_own
  on public.authentication_cultural_context for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Users can insert own sessions"
  on public.iraqi_authentication_sessions;
drop policy if exists "Users can view own sessions"
  on public.iraqi_authentication_sessions;

create policy iraqi_authentication_sessions_select_own
  on public.iraqi_authentication_sessions for select to authenticated
  using (user_id = (select auth.uid()));
create policy iraqi_authentication_sessions_insert_own
  on public.iraqi_authentication_sessions for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "Users can insert own professional data"
  on public.professional_domain_authentication;
drop policy if exists "Users can update own professional data"
  on public.professional_domain_authentication;
drop policy if exists "Users can view own professional data"
  on public.professional_domain_authentication;

create policy professional_domain_authentication_select_own
  on public.professional_domain_authentication for select to authenticated
  using (user_id = (select auth.uid()));
create policy professional_domain_authentication_insert_own
  on public.professional_domain_authentication for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy professional_domain_authentication_update_own
  on public.professional_domain_authentication for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Users can insert own MFA config"
  on public.cultural_mfa_configuration;
drop policy if exists "Users can update own MFA config"
  on public.cultural_mfa_configuration;
drop policy if exists "Users can view own MFA config"
  on public.cultural_mfa_configuration;

create policy cultural_mfa_configuration_select_own
  on public.cultural_mfa_configuration for select to authenticated
  using (user_id = (select auth.uid()));
create policy cultural_mfa_configuration_insert_own
  on public.cultural_mfa_configuration for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy cultural_mfa_configuration_update_own
  on public.cultural_mfa_configuration for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists cultural_islamic_rules_insert_policy
  on public.cultural_islamic_rules;
drop policy if exists cultural_islamic_rules_select_policy
  on public.cultural_islamic_rules;
drop policy if exists cultural_islamic_rules_update_policy
  on public.cultural_islamic_rules;

create policy cultural_islamic_rules_select_active
  on public.cultural_islamic_rules for select to authenticated
  using (is_active = true);

drop policy if exists content_validation_results_insert_policy
  on public.content_validation_results;
drop policy if exists content_validation_results_select_policy
  on public.content_validation_results;

drop policy if exists user_compliance_preferences_delete_policy
  on public.user_compliance_preferences;
drop policy if exists user_compliance_preferences_insert_policy
  on public.user_compliance_preferences;
drop policy if exists user_compliance_preferences_select_policy
  on public.user_compliance_preferences;
drop policy if exists user_compliance_preferences_update_policy
  on public.user_compliance_preferences;

create policy user_compliance_preferences_select_own
  on public.user_compliance_preferences for select to authenticated
  using (user_id = (select auth.uid()));
create policy user_compliance_preferences_insert_own
  on public.user_compliance_preferences for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy user_compliance_preferences_update_own
  on public.user_compliance_preferences for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy user_compliance_preferences_delete_own
  on public.user_compliance_preferences for delete to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists compliance_violations_insert_policy
  on public.compliance_violations;
drop policy if exists compliance_violations_select_policy
  on public.compliance_violations;
drop policy if exists compliance_violations_update_policy
  on public.compliance_violations;

create policy compliance_violations_select_own
  on public.compliance_violations for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists cultural_islamic_knowledge_insert_policy
  on public.cultural_islamic_knowledge;
drop policy if exists cultural_islamic_knowledge_select_policy
  on public.cultural_islamic_knowledge;
drop policy if exists cultural_islamic_knowledge_update_policy
  on public.cultural_islamic_knowledge;

create policy cultural_islamic_knowledge_select_verified
  on public.cultural_islamic_knowledge for select to authenticated
  using (is_verified = true);

-- Cover every currently unindexed public foreign key. Names are stable and
-- derived from the constraint names so future audits can trace each index.
create index if not exists ai_generation_permits_created_by_idx
  on public.ai_generation_permits (created_by);
create index if not exists attachment_processing_runs_created_by_idx
  on public.attachment_processing_runs (created_by);
create index if not exists attachment_processing_runs_workspace_attachment_idx
  on public.attachment_processing_runs (workspace_id, attachment_id);
create index if not exists attachments_uploaded_by_idx
  on public.attachments (uploaded_by);
create index if not exists compliance_violations_content_validation_id_idx
  on public.compliance_violations (content_validation_id);
create index if not exists conversations_created_by_idx
  on public.conversations (created_by);
create index if not exists cultural_islamic_knowledge_created_by_idx
  on public.cultural_islamic_knowledge (created_by);
create index if not exists draft_generations_created_by_idx
  on public.draft_generations (created_by);
create index if not exists draft_generations_workspace_draft_idx
  on public.draft_generations (workspace_id, draft_id);
create index if not exists draft_provenance_attachment_id_idx
  on public.draft_provenance (attachment_id);
create index if not exists draft_provenance_source_id_idx
  on public.draft_provenance (source_id);
create index if not exists draft_provenance_workspace_draft_idx
  on public.draft_provenance (workspace_id, draft_id);
create index if not exists draft_provenance_workspace_message_idx
  on public.draft_provenance (
    workspace_id,
    conversation_id,
    origin_message_id
  );
create index if not exists draft_versions_created_by_idx
  on public.draft_versions (created_by);
create index if not exists draft_versions_workspace_draft_idx
  on public.draft_versions (workspace_id, draft_id);
create index if not exists draft_versions_workspace_generation_idx
  on public.draft_versions (workspace_id, generation_id);
create index if not exists drafts_created_by_idx
  on public.drafts (created_by);
create index if not exists drafts_workspace_conversation_idx
  on public.drafts (workspace_id, conversation_id);
create index if not exists drafts_workspace_origin_message_idx
  on public.drafts (workspace_id, conversation_id, origin_message_id);
create index if not exists message_citations_attachment_id_idx
  on public.message_citations (attachment_id);
create index if not exists message_citations_source_id_idx
  on public.message_citations (source_id);
create index if not exists message_citations_workspace_id_idx
  on public.message_citations (workspace_id);
create index if not exists message_citations_workspace_message_idx
  on public.message_citations (workspace_id, conversation_id, message_id);
create index if not exists message_generations_created_by_idx
  on public.message_generations (created_by);
create index if not exists message_generations_message_idx
  on public.message_generations (workspace_id, conversation_id, message_id);
create index if not exists messages_created_by_idx
  on public.messages (created_by);

commit;
