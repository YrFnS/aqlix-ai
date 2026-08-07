"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  conversationIdInputSchema,
  createConversationInputSchema,
  updateConversationInputSchema,
} from "@iraqi-ai/types";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";
import {
  createConversation,
  deleteConversation,
  updateConversation,
  ConversationRepositoryError,
} from "./repository";

function formString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function listRedirect(workspaceId: string, status: string): never {
  redirect(
    `/workspaces/${encodeURIComponent(workspaceId)}/conversations?status=${encodeURIComponent(status)}`,
  );
}

function detailRedirect(
  workspaceId: string,
  conversationId: string,
  status: string,
): never {
  redirect(
    `/workspaces/${encodeURIComponent(workspaceId)}/conversations/${encodeURIComponent(conversationId)}?status=${encodeURIComponent(status)}`,
  );
}

function logFailure(error: unknown, operation: string): void {
  if (error instanceof ConversationRepositoryError) {
    console.error("Conversation persistence action failed", {
      operation,
      repositoryOperation: error.operation,
      message: error.message,
    });
    return;
  }

  console.error("Unexpected conversation action failure", {
    operation,
    error,
  });
}

async function requireConversationWriter(
  workspaceId: string,
  returnTo: string,
) {
  const context = await requireAuthenticatedUser(returnTo);
  const access = await getWorkspaceAccess(
    context.supabase,
    context.user.id,
    workspaceId,
  );

  if (!access) listRedirect(workspaceId, "not-found");
  if (access.role === "viewer") listRedirect(workspaceId, "writer-required");

  return { ...context, access };
}

export async function createConversationAction(
  formData: FormData,
): Promise<never> {
  const workspaceId = formString(formData, "workspaceId") ?? "";
  const parsed = createConversationInputSchema.safeParse({
    workspaceId,
    title: formString(formData, "title"),
  });

  if (!parsed.success) listRedirect(workspaceId, "invalid-input");

  const { user, supabase } = await requireConversationWriter(
    parsed.data.workspaceId,
    `/workspaces/${parsed.data.workspaceId}/conversations`,
  );

  try {
    const conversation = await createConversation(
      supabase,
      user.id,
      parsed.data,
    );
    revalidatePath(`/workspaces/${parsed.data.workspaceId}/conversations`);
    redirect(
      `/workspaces/${parsed.data.workspaceId}/conversations/${conversation.id}?status=created`,
    );
  } catch (error) {
    logFailure(error, "create");
    listRedirect(parsed.data.workspaceId, "persistence-error");
  }
}

export async function renameConversationAction(
  formData: FormData,
): Promise<never> {
  const workspaceId = formString(formData, "workspaceId") ?? "";
  const conversationId = formString(formData, "conversationId") ?? "";
  const parsed = updateConversationInputSchema.safeParse({
    workspaceId,
    conversationId,
    title: formString(formData, "title"),
  });

  if (!parsed.success) {
    detailRedirect(workspaceId, conversationId, "invalid-input");
  }

  const { supabase } = await requireConversationWriter(
    parsed.data.workspaceId,
    `/workspaces/${parsed.data.workspaceId}/conversations/${parsed.data.conversationId}`,
  );

  try {
    const conversation = await updateConversation(supabase, parsed.data);
    if (!conversation) {
      detailRedirect(
        parsed.data.workspaceId,
        parsed.data.conversationId,
        "not-found",
      );
    }

    revalidatePath(
      `/workspaces/${parsed.data.workspaceId}/conversations/${parsed.data.conversationId}`,
    );
    revalidatePath(`/workspaces/${parsed.data.workspaceId}/conversations`);
    detailRedirect(
      parsed.data.workspaceId,
      parsed.data.conversationId,
      "updated",
    );
  } catch (error) {
    logFailure(error, "rename");
    detailRedirect(
      parsed.data.workspaceId,
      parsed.data.conversationId,
      "persistence-error",
    );
  }
}

async function setConversationStatus(
  formData: FormData,
  status: "active" | "archived",
): Promise<never> {
  const workspaceId = formString(formData, "workspaceId") ?? "";
  const conversationId = formString(formData, "conversationId") ?? "";
  const parsed = updateConversationInputSchema.safeParse({
    workspaceId,
    conversationId,
    status,
  });

  if (!parsed.success) listRedirect(workspaceId, "invalid-input");

  const { supabase } = await requireConversationWriter(
    parsed.data.workspaceId,
    `/workspaces/${parsed.data.workspaceId}/conversations/${parsed.data.conversationId}`,
  );

  try {
    const conversation = await updateConversation(supabase, parsed.data);
    if (!conversation) listRedirect(parsed.data.workspaceId, "not-found");

    revalidatePath(`/workspaces/${parsed.data.workspaceId}/conversations`);
    revalidatePath(
      `/workspaces/${parsed.data.workspaceId}/conversations/archived`,
    );

    if (status === "active") {
      redirect(
        `/workspaces/${parsed.data.workspaceId}/conversations/${parsed.data.conversationId}?status=restored`,
      );
    }

    listRedirect(parsed.data.workspaceId, "archived");
  } catch (error) {
    logFailure(error, status);
    detailRedirect(
      parsed.data.workspaceId,
      parsed.data.conversationId,
      "persistence-error",
    );
  }
}

export async function archiveConversationAction(
  formData: FormData,
): Promise<never> {
  return setConversationStatus(formData, "archived");
}

export async function restoreConversationAction(
  formData: FormData,
): Promise<never> {
  return setConversationStatus(formData, "active");
}

export async function deleteConversationAction(
  formData: FormData,
): Promise<never> {
  const parsed = conversationIdInputSchema.safeParse({
    workspaceId: formString(formData, "workspaceId"),
    conversationId: formString(formData, "conversationId"),
  });

  if (!parsed.success) {
    listRedirect(formString(formData, "workspaceId") ?? "", "invalid-input");
  }

  const { supabase } = await requireConversationWriter(
    parsed.data.workspaceId,
    `/workspaces/${parsed.data.workspaceId}/conversations/${parsed.data.conversationId}`,
  );

  try {
    const deleted = await deleteConversation(
      supabase,
      parsed.data.workspaceId,
      parsed.data.conversationId,
    );
    if (!deleted) listRedirect(parsed.data.workspaceId, "not-found");

    revalidatePath(`/workspaces/${parsed.data.workspaceId}/conversations`);
    listRedirect(parsed.data.workspaceId, "deleted");
  } catch (error) {
    logFailure(error, "delete");
    detailRedirect(
      parsed.data.workspaceId,
      parsed.data.conversationId,
      "persistence-error",
    );
  }
}
