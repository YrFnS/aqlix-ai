import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Surface } from "@/components/ui/surface";

const statusMessages: Record<
  string,
  { tone: "error" | "success" | "info"; message: string }
> = {
  created: {
    tone: "success",
    message:
      "تم إنشاء مساحة العمل وحفظ عضوية المالك / Workspace created with owner membership.",
  },
  updated: {
    tone: "success",
    message:
      "تم حفظ إعدادات مساحة العمل / Workspace settings were saved.",
  },
  archived: {
    tone: "success",
    message:
      "نُقلت مساحة العمل إلى الأرشيف / Workspace moved to the archive.",
  },
  restored: {
    tone: "success",
    message:
      "أعيدت مساحة العمل إلى القائمة النشطة / Workspace restored to the active list.",
  },
  deleted: {
    tone: "success",
    message:
      "حُذفت مساحة العمل ومحتواها المرتبط / Workspace and related content were deleted.",
  },
  "invalid-input": {
    tone: "error",
    message:
      "راجع الحقول المطلوبة والقيم المدخلة / Review the required fields and values.",
  },
  "owner-required": {
    tone: "error",
    message:
      "هذا الإجراء متاح لمالك المساحة فقط / This action is available only to the workspace owner.",
  },
  "confirmation-mismatch": {
    tone: "error",
    message:
      "اسم التأكيد لا يطابق اسم المساحة / The confirmation name does not match the workspace.",
  },
  "not-found": {
    tone: "error",
    message:
      "لم تُوجد مساحة العمل أو لا تملك صلاحية الوصول / Workspace not found or access is not allowed.",
  },
  "persistence-error": {
    tone: "error",
    message:
      "تعذر حفظ التغيير. لم نعرض نجاحاً وهمياً / The change could not be persisted. No success state was assumed.",
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

export function WorkspaceStatusNotice({
  status,
}: {
  status?: string;
}) {
  if (!status || !statusMessages[status]) return null;

  const item = statusMessages[status];
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
        <span
          className={`mt-0.5 rounded-md p-2 ${toneIconClasses[item.tone]}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <p>{item.message}</p>
      </div>
    </Surface>
  );
}
