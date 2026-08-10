import { RouteLoadingState } from "@/components/system/route-state";

export default function ConversationsLoading() {
  return (
    <RouteLoadingState
      label="جاري تحميل المحادثات والسجل المحفوظ"
      metricCount={3}
      cardCount={4}
    />
  );
}
