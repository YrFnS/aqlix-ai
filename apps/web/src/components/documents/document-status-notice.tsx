import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Surface } from "@/components/ui/surface";

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

export function DocumentStatusNotice({ status }: { status?: string }) {
  if (!status || !notices[status]) return null;
  const notice = notices[status];
  const Icon =
    notice.tone === "error"
      ? AlertTriangle
      : notice.tone === "success"
        ? CheckCircle2
        : Info;

  return (
    <Surface
      tone={notice.tone === "info" ? "muted" : "raised"}
      elevation="xs"
      radius="xl"
      padding="sm"
      className={
        notice.tone === "error"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : notice.tone === "success"
            ? "border-primary/25 bg-brand-soft/60"
            : undefined
      }
      role={notice.tone === "error" ? "alert" : "status"}
      aria-live={notice.tone === "error" ? "assertive" : "polite"}
    >
      <div className="flex items-start gap-3 text-sm leading-7">
        <Icon
          className={`mt-1 h-4 w-4 shrink-0 ${
            notice.tone === "error" ? "text-destructive" : "text-primary"
          }`}
          aria-hidden="true"
        />
        <p>{notice.text}</p>
      </div>
    </Surface>
  );
}
