import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  Workspace,
  WorkspaceAccess,
  WorkspaceRole,
} from "@iraqi-ai/contracts";
import { workspaceRoleSchema } from "@iraqi-ai/contracts";
import type { Tables, TablesUpdate } from "@iraqi-ai/types";
import type { SupabaseServerClient } from "@iraqi-ai/supabase-client/server";

type WorkspaceRow = Tables<"workspaces">;

export class WorkspaceRepositoryError extends Error {
  constructor(
    public readonly operation: string,
    message: string,
  ) {
    super(message);
    this.name = "WorkspaceRepositoryError";
  }
}

function repositoryError(operation: string, message: string): never {
  throw new WorkspaceRepositoryError(operation, message);
}

export function mapWorkspaceRow(row: WorkspaceRow): Workspace {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    description: row.description,
    defaultLanguage:
      row.default_language === "ar" || row.default_language === "en"
        ? row.default_language
        : "auto",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  };
}

function parseRole(value: string): WorkspaceRole {
  const parsed = workspaceRoleSchema.safeParse(value);
  return parsed.success ? parsed.data : "viewer";
}

export async function listWorkspaceAccess(
  supabase: SupabaseServerClient,
  userId: string,
  options?: { includeArchived?: boolean },
): Promise<WorkspaceAccess[]> {
  const { data: memberships, error: membershipError } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", userId);

  if (membershipError) {
    repositoryError("list-memberships", membershipError.message);
  }

  if (!memberships || memberships.length === 0) return [];

  const roleByWorkspace = new Map<string, WorkspaceRole>();
  for (const membership of memberships) {
    roleByWorkspace.set(membership.workspace_id, parseRole(membership.role));
  }

  let query = supabase
    .from("workspaces")
    .select("*")
    .in("id", Array.from(roleByWorkspace.keys()))
    .order("updated_at", { ascending: false });

  if (!options?.includeArchived) {
    query = query.is("archived_at", null);
  }

  const { data: workspaces, error: workspaceError } = await query;

  if (workspaceError) {
    repositoryError("list-workspaces", workspaceError.message);
  }

  return (workspaces ?? []).map((row) => ({
    ...mapWorkspaceRow(row),
    role: roleByWorkspace.get(row.id) ?? "viewer",
  }));
}

export async function getWorkspaceAccess(
  supabase: SupabaseServerClient,
  userId: string,
  workspaceId: string,
): Promise<WorkspaceAccess | null> {
  const [workspaceResult, membershipResult] = await Promise.all([
    supabase.from("workspaces").select("*").eq("id", workspaceId).maybeSingle(),
    supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (workspaceResult.error) {
    repositoryError("get-workspace", workspaceResult.error.message);
  }

  if (membershipResult.error) {
    repositoryError("get-membership", membershipResult.error.message);
  }

  if (!workspaceResult.data || !membershipResult.data) return null;

  return {
    ...mapWorkspaceRow(workspaceResult.data),
    role: parseRole(membershipResult.data.role),
  };
}

export async function createWorkspace(
  supabase: SupabaseServerClient,
  userId: string,
  input: CreateWorkspaceInput,
): Promise<WorkspaceAccess> {
  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      owner_id: userId,
      name: input.name,
      description: input.description || null,
      default_language: input.defaultLanguage,
    })
    .select("*")
    .single();

  if (error) {
    repositoryError("create-workspace", error.message);
  }

  return {
    ...mapWorkspaceRow(data),
    role: "owner",
  };
}

export async function updateWorkspace(
  supabase: SupabaseServerClient,
  input: UpdateWorkspaceInput,
): Promise<Workspace | null> {
  const updates: TablesUpdate<"workspaces"> = {};

  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) {
    updates.description = input.description || null;
  }
  if (input.defaultLanguage !== undefined) {
    updates.default_language = input.defaultLanguage;
  }

  const { data, error } = await supabase
    .from("workspaces")
    .update(updates)
    .eq("id", input.workspaceId)
    .select("*")
    .maybeSingle();

  if (error) {
    repositoryError("update-workspace", error.message);
  }

  return data ? mapWorkspaceRow(data) : null;
}

export async function setWorkspaceArchived(
  supabase: SupabaseServerClient,
  workspaceId: string,
  archived: boolean,
): Promise<Workspace | null> {
  const { data, error } = await supabase
    .from("workspaces")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", workspaceId)
    .select("*")
    .maybeSingle();

  if (error) {
    repositoryError(
      archived ? "archive-workspace" : "restore-workspace",
      error.message,
    );
  }

  return data ? mapWorkspaceRow(data) : null;
}

export async function deleteWorkspace(
  supabase: SupabaseServerClient,
  workspaceId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId)
    .select("id");

  if (error) {
    repositoryError("delete-workspace", error.message);
  }

  return Boolean(data && data.length > 0);
}
