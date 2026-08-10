import {
  Archive,
  ArchiveRestore,
  Clock3,
  PencilLine,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import type { Conversation, WorkspaceAccess } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { DraftFromConversationPanel } from "@/components/drafts/draft-from-conversation-panel";
import {
  archiveConversationAction,
  deleteConversationAction,
  renameConversationAction,
  restoreConversationAction,
} from "@/lib/conversations/actions";

interface AssistantMessageOption {
  id: string;
  sequence: number;
  content: string;
  citationCount: number;
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ConversationInspector({
  workspace,
  conversation,
  messageCount,
  reusableMessages,
  canWrite,
}: {
  workspace: WorkspaceAccess;
  conversation: Conversation;
  messageCount: number;
  reusableMessages: AssistantMessageOption[];
  canWrite: boolean;
}) {
  const isWorkspaceArchived = workspace.archivedAt !== null;
  const isArchived = conversation.status === "archived";
  const roleLabel =
    workspace.role === "owner"
      ? "مالك"
      : workspace.role === "editor"
        ? "محرر"
        : "قراءة فقط";

  return (
    <div className="divide-y divide-line/70">
      <section className="p-4 sm:p-5">
        <p className="text-xs font-semibold text-primary">السياق الحالي</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-line/75 bg-surface-raised p-3">
            <p className="text-[0.68rem] text-ink-subtle">الوصول</p>
            <p className="mt-1 text-sm font-semibold">{roleLabel}</p>
          </div>
          <div className="rounded-xl border border-line/75 bg-surface-raised p-3">
            <p className="text-[0.68rem] text-ink-subtle">الرسائل</p>
            <p className="mt-1 text-sm font-semibold">{messageCount}</p>
          </div>
        </div>
        <div className="mt-2 flex items-start gap-3 rounded-xl bg-surface-sunken p-3 text-xs leading-6 text-ink-muted">
          <Clock3 className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <p>آخر تحديث: {formatTimestamp(conversation.updatedAt)}</p>
        </div>
      </section>

      <DraftFromConversationPanel
        workspaceId={workspace.id}
        conversationId={conversation.id}
        messages={reusableMessages}
        canWrite={canWrite}
        compact
      />

      <section className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-brand-soft p-2 text-primary">
            <PencilLine className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold text-primary">إدارة المحادثة</p>
            <h2 className="mt-0.5 text-sm font-semibold">العنوان والحالة</h2>
          </div>
        </div>

        {canWrite ? (
          <form action={renameConversationAction} className="mt-4 space-y-3">
            <input type="hidden" name="workspaceId" value={workspace.id} />
            <input
              type="hidden"
              name="conversationId"
              value={conversation.id}
            />
            <label htmlFor="inspector-conversation-title" className="sr-only">
              عنوان المحادثة
            </label>
            <input
              id="inspector-conversation-title"
              name="title"
              required
              maxLength={200}
              defaultValue={conversation.title}
              dir="auto"
              className="min-h-11 w-full rounded-xl border border-input bg-surface-raised px-3 text-sm outline-none transition-[border-color,box-shadow] duration-fast focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
            />
            <Button
              type="submit"
              variant="outline"
              className="w-full rounded-xl"
            >
              حفظ العنوان
            </Button>
          </form>
        ) : (
          <p className="mt-4 text-xs leading-6 text-ink-muted">
            {isWorkspaceArchived
              ? "مساحة العمل مؤرشفة، لذلك تبقى إدارة المحادثة للقراءة فقط."
              : "تعديل العنوان والحالة يحتاج دور المحرر أو المالك."}
          </p>
        )}

        {canWrite ? (
          <div className="mt-3">
            {isArchived ? (
              <form action={restoreConversationAction}>
                <input type="hidden" name="workspaceId" value={workspace.id} />
                <input
                  type="hidden"
                  name="conversationId"
                  value={conversation.id}
                />
                <Button type="submit" className="w-full rounded-xl">
                  <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
                  استعادة المحادثة
                </Button>
              </form>
            ) : (
              <form action={archiveConversationAction}>
                <input type="hidden" name="workspaceId" value={workspace.id} />
                <input
                  type="hidden"
                  name="conversationId"
                  value={conversation.id}
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  <Archive className="h-4 w-4" aria-hidden="true" />
                  أرشفة المحادثة
                </Button>
              </form>
            )}
          </div>
        ) : null}
      </section>

      <section className="p-4 sm:p-5">
        <div className="flex items-start gap-3 text-xs leading-6 text-ink-muted">
          <ShieldCheck
            className="mt-1 h-3.5 w-3.5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            السجل المحفوظ هو مصدر الحقيقة. الإلغاء والفشل يحافظان على النص الجزئي
            ومحاولة التوليد بدلاً من استبدال التاريخ السابق.
          </p>
        </div>
      </section>

      <section className="p-4 sm:p-5">
        <details className="group rounded-xl border border-destructive/25 bg-surface-raised">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 px-3 text-sm font-semibold text-destructive outline-none focus-visible:ring-4 focus-visible:ring-destructive/20">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            منطقة الحذف
          </summary>
          <div className="border-t border-destructive/20 p-3">
            <p className="text-xs leading-6 text-ink-muted">
              يحذف هذا الإجراء الرسائل ومحاولات التوليد والمراجع المرتبطة، ولا
              يحذف مساحة العمل.
            </p>
            {canWrite ? (
              <form action={deleteConversationAction} className="mt-3">
                <input type="hidden" name="workspaceId" value={workspace.id} />
                <input
                  type="hidden"
                  name="conversationId"
                  value={conversation.id}
                />
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full rounded-xl"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  حذف المحادثة
                </Button>
              </form>
            ) : (
              <p className="mt-3 text-xs text-ink-muted">
                الحذف غير متاح لعضوية القراءة أو لمساحة مؤرشفة.
              </p>
            )}
          </div>
        </details>
      </section>
    </div>
  );
}
