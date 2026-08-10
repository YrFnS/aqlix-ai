import { RouteFailureState } from "@/components/system/route-state";

export default function ConversationNotFound() {
  return (
    <RouteFailureState
      eyebrow="تعذر فتح المحادثة"
      title="المحادثة غير متاحة"
      description="قد تكون المحادثة حُذفت، أو أن حسابك لا يملك عضوية في مساحة العمل. لا تكشف الصفحة أي تفاصيل تميّز بين السجل المفقود والسجل المحمي."
      backHref="/workspaces"
      backLabel="العودة إلى مساحاتك"
    />
  );
}
