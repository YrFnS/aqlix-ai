import type { Metadata } from "next";
import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign In | تسجيل الدخول",
  description: "Sign in to your Iraqi AI Chat System account",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center">
      <LoginForm
        redirectTo="/dashboard"
        culturalMode="both"
        showRegisterLink={true}
      />
    </div>
  );
}
