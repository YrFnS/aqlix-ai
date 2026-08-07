"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Workspace, WorkspaceAccess } from "@iraqi-ai/contracts";
import {
  createWorkspaceInputSchema,
  deleteWorkspaceInputSchema,
  updateWorkspaceInputSchema,
  workspaceIdInputSchema,
} from "@iraqi-ai/contracts";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaceAccess,
  setWorkspaceArchived,
  updateWorkspace,
  WorkspaceRepositoryError,
} from "./repository";

function formString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function workspaceStatusRedirect(status: string): never {
  redirect(`/workspaces?status=${encodeURIComponent(status)}`);
}

function settingsStatusRedirect(workspaceId: string, status: string): never {
  redirect(
    `/workspaces/${encodeURIComponent(workspaceId)}/settings?status=${encodeURIComponent(status)}`,
  );
}

function handleRepositoryFailure(
  error: unknown,
  fallbackPath: "list" | { workspaceId: string },
): never {
  if (error instanceof WorkspaceRepositoryError) {
    console.error("Workspace persistence operation failed", {
      operation: error.operation,
      message: error.message,
    });
  } else {
    console.error("Unexpected workspace operation failure", error);
  }

  if (fallbackPath === "list") {
    workspaceStatusRedirect("persistence-error");
  }

  settingsStatusRedirect(fallbackPath.workspaceId, "persistence-error");
}

export async function createWorkspaceAction(formData: FormData): Promise<never> {
  const parsed = createWorkspaceInputSchema.safeParse({
    name: formString(formData, "name"),
    description: formString(formData, "description"),
    defaultLanguage: formString(formData, "defaultLanguage"),
  });

  if (!parsed.success) {
    workspaceStatusRedirect("invalid-input");
  }

  const { user, supabase } = await requireAuthenticatedUser("/workspaces");
  let workspace: WorkspaceAccess;

  try {
    workspace = await createWorkspace(supabase, user.id, parsed.data);
  } catch (error) {
    handleRepositoryFailure(error, "list");
  }

  revalidatePath("/workspaces");
  redirect(`/workspaces/${workspace.id}?status=created`);
}

export async function updateWorkspaceAction(formData: FormData): Promise<never> {
  const workspaceId = formString(formData, "workspaceId") ?? "";
  const parsed = updateWorkspaceInputSchema.safeParse({
    workspaceId,
    name: formString(formData, "name"),
    description: formString(formData, "description"),
    defaultLanguage: formString(formData, "defaultLanguage"),
  });

  if (!parsed.success) {
    settingsStatusRedirect(workspaceId, "invalid-input");
  }

  const { supabase } = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/settings`,
  );
  let workspace: Workspace | null;

  try {
    workspace = await updateWorkspace(supabase, parsed.data);
  } catch (error) {
    handleRepositoryFailure(error, { workspaceId });
  }

  if (!workspace) settingsStatusRedirect(workspaceId, "not-found");

  revalidatePath("/workspaces");
  revalidatePath(`/workspaces/${workspaceId}`);
  settingsStatusRedirect(workspaceId, "updated");
}

async function requireOwner(workspaceId: string) {
  const context = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/settings`,
  );
  let access: WorkspaceAccess | null;

  try {
    access = await getWorkspaceAccess(context.supabase, context.user.id, workspaceId);
  } catch (error) {
    handleRepositoryFailure(error, { workspaceId });
  }

  if (!access) settingsStatusRedirect(workspaceId, "not-found");
  if (access.role !== "owner") settingsStatusRedirect(workspaceId, "owner-required");

  return { ...context, access };
}

export async function archiveWorkspaceAction(formData: FormData): Promise<never> {
  const workspaceId = formString(formData, "workspaceId") ?? "";
  const parsed = workspaceIdInputSchema.safeParse({ workspaceId });
  if (!parsed.success) workspaceStatusRedirect("invalid-input");

  const { supabase } = await requireOwner(parsed.data.workspaceId);
  let workspace: Workspace | null;

  try {
    workspace = await setWorkspaceArchived(
      supabase,
      parsed.data.workspaceId,
      true,
    );
  } catch (error) {
    handleRepositoryFailure(error, { workspaceId: parsed.data.workspaceId });
  }

  if (!workspace) workspaceStatusRedirect("not-found");

  revalidatePath("/workspaces");
  workspaceStatusRedirect("archived");
}

export async function restoreWorkspaceAction(formData: FormData): Promise<never> {
  const workspaceId = formString(formData, "workspaceId") ?? "";
  const parsed = workspaceIdInputSchema.safeParse({ workspaceId });
  if (!parsed.success) workspaceStatusRedirect("invalid-input");

  const { supabase } = await requireOwner(parsed.data.workspaceId);
  let workspace: Workspace | null;

  try {
    workspace = await setWorkspaceArchived(
      supabase,
      parsed.data.workspaceId,
      false,
    );
  } catch (error) {
    handleRepositoryFailure(error, { workspaceId: parsed.data.workspaceId });
  }

  if (!workspace) workspaceStatusRedirect("not-found");

  revalidatePath("/workspaces");
  redirect(`/workspaces/${parsed.data.workspaceId}?status=restored`);
}

export async function deleteWorkspaceAction(formData: FormData): Promise<never> {
  const workspaceId = formString(formData, "workspaceId") ?? "";
  const parsed = deleteWorkspaceInputSchema.safeParse({
    workspaceId,
    confirmationName: formString(formData, "confirmationName"),
  });

  if (!parsed.success) {
    settingsStatusRedirect(workspaceId, "invalid-input");
  }

  const { supabase, access } = await requireOwner(parsed.data.workspaceId);

  if (access.name !== parsed.data.confirmationName) {
    settingsStatusRedirect(parsed.data.workspaceId, "confirmation-mismatch");
  }

  let deleted: boolean;
  try {
    deleted = await deleteWorkspace(supabase, parsed.data.workspaceId);
  } catch (error) {
    handleRepositoryFailure(error, { workspaceId: parsed.data.workspaceId });
  }

  if (!deleted) workspaceStatusRedirect("not-found");

  revalidatePath("/workspaces");
  workspaceStatusRedirect("deleted");
}
