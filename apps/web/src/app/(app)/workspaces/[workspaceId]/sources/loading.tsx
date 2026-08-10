import { RouteLoadingState } from "@/components/system/route-state";

export default function WorkspaceSourcesLoading() {
  return (
    <RouteLoadingState
      label="جاري تحميل الملفات والمقاطع المحفوظة"
      metricCount={4}
      cardCount={6}
      sidebar
    />
  );
}
