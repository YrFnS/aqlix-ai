const notices: Record<
  string,
  { tone: "success" | "error" | "info"; text: string }
> = {
  uploaded: {
    tone: "success",
    text: "تم حفظ الملف الخاص واستخراج المقاطع / Private document stored and passages extracted.",
  },
  deleted: {
    tone: "success",
    text: "حُذف الملف الخاص والمقاطع المستخرجة / Private object and extracted passages deleted.",
  },
  "workspace-archived": {
    tone: "info",
    text: "مساحة العمل مؤرشفة وتعمل بوضع القراءة فقط / The workspace is archived and read-only.",
  },
  "persistence-error": {
    tone: "error",
    text: "تعذر تحميل حالة المصادر المحفوظة / Persisted source state could not be loaded.",
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

export function DocumentStatusNotice({ status }: { status?: string }) {
  if (!status || !notices[status]) return null;
  const notice = notices[status];

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${classes(notice.tone)}`}
      role={notice.tone === "error" ? "alert" : "status"}
    >
      {notice.text}
    </div>
  );
}
