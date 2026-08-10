import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Surface } from "@/components/ui/surface";

const messages: Record<
  string,
  { tone: "success" | "error" | "info"; text: string }
> = {
  created: {
    tone: "success",
    text: "تم إنشاء المحادثة وحفظها / Conversation created and persisted.",
  },
  updated: {
    tone: "success",
    text: "تم حفظ عنوان المحادثة / Conversation title saved.",
  },
  archived: {
    tone: "success",
    text: "نُقلت المحادثة إلى الأرشيف / Conversation moved to the archive.",
  },
  restored: {
    tone: "success",
    text: "أعيدت المحادثة إلى القائمة النشطة / Conversation restored.",
  },
  deleted: {
    tone: "success",
    text: "حُذفت المحادثة ورسائلها ومحاولات التوليد / Conversation, messages, and generation attempts were deleted.",
  },
  "invalid-input": {
    tone: "error",
    text: "راجع الحقول المطلوبة / Review the required fields.",
  },
  "writer-required": {
    tone: "error",
    text: "العضوية الحالية للقراءة فقط / The current membership is read-only.",
  },
  "workspace-archived": {
    tone: "info",
    text: "مساحة العمل مؤرشفة وتعمل بوضع القراءة فقط. استعدها قبل تعديل المحادثات أو التوليد / The workspace is archived and read-only. Restore it before conversation changes or generation.",
  },
  "not-found": {
    tone: "error",
    text: "المحادثة غير موجودة أو غير متاحة لهذا الحساب / Conversation not found or unavailable to this account.",
  },
  "persistence-error": {
    tone: "error",
    text: "تعذر حفظ حالة المحادثة / Conversation state could not be persisted.",
  },
};

const toneClasses = {
  error: "border-destructive/30 bg-destructive/10 text-foreground",
  success: "border-primary/25 bg-brand-soft/60 text-foreground",
  info: "border-line bg-surface-sunken text-ink-muted",
} as const;

const toneIconClasses = {
  error: "bg-destructive/10 text-destructive",
  success: "bg-primary/10 text-primary",
  info: "bg-surface-raised text-ink-muted",
} as const;

const toneIcons = {
  error: AlertTriangle,
  success: CheckCircle2,
  info: Info,
} as const;

export function ConversationStatusNotice({ status }: { status?: string }) {
  if (!status || !messages[status]) return null;
  const item = messages[status];
  const Icon = toneIcons[item.tone];

  return (
    <Surface
      padding="sm"
      radius="lg"
      elevation="xs"
      className={toneClasses[item.tone]}
      role={item.tone === "error" ? "alert" : "status"}
      aria-live={item.tone === "error" ? "assertive" : "polite"}
    >
      <div className="flex items-start gap-3 text-sm leading-7">
        <span className={`mt-0.5 rounded-md p-2 ${toneIconClasses[item.tone]}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <p>{item.text}</p>
      </div>
    </Surface>
  );
}
