import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "التحقق من البريد",
  description: "Email verification is introduced with the P1 authentication boundary.",
};

export default function VerifyEmailPage() {
  redirect("/login");
}
