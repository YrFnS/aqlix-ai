import type { Metadata } from "next";
import { Suspense } from "react";
import { MFAForm } from "@/components/auth";

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

function MFASetupContent({
  searchParams,
}: {
  searchParams: { setupId?: string; method?: string; destination?: string };
}) {
  const setupId = searchParams.setupId || "default-setup-id";
  const method =
    (searchParams.method as "sms" | "email" | "cultural_questions") || "email";
  const destination = searchParams.destination;

  return (
    <MFAForm
      verificationId={setupId}
      method={method}
      destination={destination}
      culturalMode="both"
      redirectTo="/dashboard"
      onCancel={() => {
        window.location.href = "/auth/login";
      }}
    />
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
