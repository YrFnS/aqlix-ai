import { RouteLoadingState } from "@/components/system/route-state";

export default function RootLoading() {
  return (
    <RouteLoadingState
      label="جاري تجهيز الصفحة والتحقق من الجلسة والبيانات المحفوظة"
      metricCount={3}
      cardCount={3}
    />
  );
}
