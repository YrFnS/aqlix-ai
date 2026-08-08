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

function classes(tone: "success" | "error" | "info"): string {
  if (tone === "error") {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  if (tone === "success") {
    return "border-primary/30 bg-primary/10 text-foreground";
  }
  return "border-border bg-secondary/60 text-muted-foreground";
}

export function ConversationStatusNotice({ status }: { status?: string }) {
  if (!status || !messages[status]) return null;
  const item = messages[status];

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${classes(item.tone)}`}
      role={item.tone === "error" ? "alert" : "status"}
    >
      {item.text}
    </div>
  );
}
