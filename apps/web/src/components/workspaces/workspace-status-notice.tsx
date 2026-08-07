const statusMessages: Record<
  string,
  { tone: "error" | "success" | "info"; message: string }
> = {
  created: {
    tone: "success",
    message: "تم إنشاء مساحة العمل وحفظ عضوية المالك / Workspace created with owner membership.",
  },
  updated: {
    tone: "success",
    message: "تم حفظ إعدادات مساحة العمل / Workspace settings were saved.",
  },
  archived: {
    tone: "success",
    message: "نُقلت مساحة العمل إلى الأرشيف / Workspace moved to the archive.",
  },
  restored: {
    tone: "success",
    message: "أعيدت مساحة العمل إلى القائمة النشطة / Workspace restored to the active list.",
  },
  deleted: {
    tone: "success",
    message: "حُذفت مساحة العمل ومحتواها المرتبط / Workspace and related content were deleted.",
  },
  "invalid-input": {
    tone: "error",
    message: "راجع الحقول المطلوبة والقيم المدخلة / Review the required fields and values.",
  },
  "owner-required": {
    tone: "error",
    message: "هذا الإجراء متاح لمالك المساحة فقط / This action is available only to the workspace owner.",
  },
  "confirmation-mismatch": {
    tone: "error",
    message: "اسم التأكيد لا يطابق اسم المساحة / The confirmation name does not match the workspace.",
  },
  "not-found": {
    tone: "error",
    message: "لم تُوجد مساحة العمل أو لا تملك صلاحية الوصول / Workspace not found or access is not allowed.",
  },
  "persistence-error": {
    tone: "error",
    message: "تعذر حفظ التغيير. لم نعرض نجاحاً وهمياً / The change could not be persisted. No success state was assumed.",
  },
};

function classes(tone: "error" | "success" | "info"): string {
  if (tone === "error") {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  if (tone === "success") {
    return "border-primary/30 bg-primary/10 text-foreground";
  }
  return "border-border bg-secondary/60 text-muted-foreground";
}

export function WorkspaceStatusNotice({
  status,
}: {
  status?: string;
}) {
  if (!status || !statusMessages[status]) return null;

  const item = statusMessages[status];

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${classes(item.tone)}`}
      role={item.tone === "error" ? "alert" : "status"}
    >
      {item.message}
    </div>
  );
}
