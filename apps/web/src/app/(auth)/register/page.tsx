import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Create Account | إنشاء حساب",
  description: "Create your Iraqi AI Chat System account",
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center py-8">
      <RegisterForm
        redirectTo="/auth/verify-email"
        culturalMode="both"
        showLoginLink={true}
      />
    </div>
  );
}
