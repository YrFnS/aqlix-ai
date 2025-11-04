import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailContent } from "./verify-email-content";

export const metadata: Metadata = {
  title: "Verify Email | تحقق من البريد الإلكتروني",
  description: "Verify your email address to complete registration",
};

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<VerificationLoading />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}

function VerificationLoading() {
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
