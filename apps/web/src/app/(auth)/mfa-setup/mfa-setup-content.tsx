"use client";

import { useRouter } from "next/navigation";
import { MFAForm } from "@/components/auth";

interface MFASetupContentProps {
  searchParams: {
    setupId?: string;
    method?: string;
    destination?: string;
  };
}

export function MFASetupContent({ searchParams }: MFASetupContentProps) {
  const router = useRouter();
  const setupId = searchParams.setupId;

  // Validate setup ID is provided
  if (!setupId) {
    router.push("/auth/login?error=invalid_mfa_setup");
    return null;
  }

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
        router.push("/auth/login");
      }}
    />
  );
}
