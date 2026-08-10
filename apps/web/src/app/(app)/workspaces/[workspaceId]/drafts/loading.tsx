import { RouteLoadingState } from "@/components/system/route-state";

export default function DraftLibraryLoading() {
  return (
    <RouteLoadingState
      label="جاري تحميل المسودات والإصدارات المحفوظة"
      metricCount={3}
      cardCount={6}
    />
  );
}
