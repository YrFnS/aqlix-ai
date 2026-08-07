"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

  try {
    const workspace = await createWorkspace(supabase, user.id, parsed.data);
    revalidatePath("/workspaces");
    redirect(`/workspaces/${workspace.id}?status=created`);
  } catch (error) {
    handleRepositoryFailure(error, "list");
  }
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

  try {
    const workspace = await updateWorkspace(supabase, parsed.data);
    if (!workspace) settingsStatusRedirect(workspaceId, "not-found");

    revalidatePath("/workspaces");
    revalidatePath(`/workspaces/${workspaceId}`);
    settingsStatusRedirect(workspaceId, "updated");
  } catch (error) {
    handleRepositoryFailure(error, { workspaceId });
  }
}

async function requireOwner(workspaceId: string) {
  const context = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/settings`,
  );

  let access;
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

  try {
    const workspace = await setWorkspaceArchived(
      supabase,
      parsed.data.workspaceId,
      true,
    );
    if (!workspace) workspaceStatusRedirect("not-found");

    revalidatePath("/workspaces");
    workspaceStatusRedirect("archived");
  } catch (error) {
    handleRepositoryFailure(error, { workspaceId: parsed.data.workspaceId });
  }
}

export async function restoreWorkspaceAction(formData: FormData): Promise<never> {
  const workspaceId = formString(formData, "workspaceId") ?? "";
  const parsed = workspaceIdInputSchema.safeParse({ workspaceId });
  if (!parsed.success) workspaceStatusRedirect("invalid-input");

  const { supabase } = await requireOwner(parsed.data.workspaceId);

  try {
    const workspace = await setWorkspaceArchived(
      supabase,
      parsed.data.workspaceId,
      false,
    );
    if (!workspace) workspaceStatusRedirect("not-found");

    revalidatePath("/workspaces");
    redirect(`/workspaces/${parsed.data.workspaceId}?status=restored`);
  } catch (error) {
    handleRepositoryFailure(error, { workspaceId: parsed.data.workspaceId });
  }
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

  try {
    const deleted = await deleteWorkspace(supabase, parsed.data.workspaceId);
    if (!deleted) workspaceStatusRedirect("not-found");

    revalidatePath("/workspaces");
    workspaceStatusRedirect("deleted");
  } catch (error) {
    handleRepositoryFailure(error, { workspaceId: parsed.data.workspaceId });
  }
}
