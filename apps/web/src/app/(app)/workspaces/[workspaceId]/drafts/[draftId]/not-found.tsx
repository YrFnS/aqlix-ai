import { RouteFailureState } from "@/components/system/route-state";

export default function DraftNotFound() {
  return (
    <RouteFailureState
      eyebrow="تعذر فتح المسودة"
      title="المسودة غير متاحة"
      description="قد تكون المسودة حُذفت، أو أن حسابك لا يملك عضوية في مساحة العمل. لا تكشف الصفحة إن كان المحتوى أو إصداراته موجودة داخل مساحة أخرى."
      backHref="/workspaces"
      backLabel="العودة إلى مساحاتك"
    />
  );
}
