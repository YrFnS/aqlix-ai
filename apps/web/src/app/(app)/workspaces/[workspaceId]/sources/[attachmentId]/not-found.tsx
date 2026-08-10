import { RouteFailureState } from "@/components/system/route-state";

export default function SourceDocumentNotFound() {
  return (
    <RouteFailureState
      eyebrow="تعذر فتح المستند"
      title="المستند غير متاح"
      description="قد يكون الملف حُذف، أو أن حسابك لا يملك عضوية في مساحة العمل. لا تكشف الصفحة إن كان الكائن أو المقاطع موجودة داخل مساحة أخرى."
      backHref="/workspaces"
      backLabel="العودة إلى مساحاتك"
    />
  );
}
