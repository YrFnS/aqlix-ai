import type { Metadata } from "next";
import { Suspense } from "react";
import { MFASetupContent } from "./mfa-setup-content";

export const metadata: Metadata = {
  title: "MFA Verification | التحقق الثنائي",
  description: "Multi-factor authentication verification",
};

export default function MFASetupPage({
  searchParams,
}: {
  searchParams: { setupId?: string; method?: string; destination?: string };
}) {
  return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<MFALoading />}>
        <MFASetupContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function MFALoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground font-arabic text-sm">
          جاري التحميل... / Loading...
        </p>
      </div>
    </div>
  );
}
