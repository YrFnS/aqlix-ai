const notices: Record<
  string,
  { tone: "success" | "error" | "info"; text: string }
> = {
  created: {
    tone: "success",
    text: "أُنشئت المسودة والإصدار الأول ومنشأ المراجع / Draft, version one, and provenance saved.",
  },
  saved: {
    tone: "success",
    text: "حُفظ إصدار جديد للمسودة / A new immutable draft version was saved.",
  },
  restored: {
    tone: "success",
    text: "أُعيدت النسخة المختارة كإصدار جديد / The selected snapshot was restored as a new version.",
  },
  archived: {
    tone: "info",
    text: "نُقلت المسودة إلى الأرشيف / Draft moved to the archive.",
  },
  reopened: {
    tone: "success",
    text: "أُعيدت المسودة إلى العمل النشط / Draft restored to active work.",
  },
  deleted: {
    tone: "success",
    text: "حُذفت المسودة وإصداراتها ومحاولات الاستمرار / Draft and its versions and proposals were deleted.",
  },
  applied: {
    tone: "success",
    text: "طُبق الاقتراح كإصدار جديد / Proposal applied as a new immutable version.",
  },
  discarded: {
    tone: "info",
    text: "رُفض الاقتراح وبقيت المسودة المقبولة دون تغيير / Proposal discarded; accepted work is unchanged.",
  },
  "workspace-archived": {
    tone: "info",
    text: "مساحة العمل مؤرشفة؛ المسودات للقراءة والتصدير فقط / Workspace is archived; drafts are read/export only.",
  },
  "persistence-error": {
    tone: "error",
    text: "تعذر تحميل حالة المسودات المحفوظة / Persisted draft state could not be loaded.",
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

export function DraftStatusNotice({ status }: { status?: string }) {
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
