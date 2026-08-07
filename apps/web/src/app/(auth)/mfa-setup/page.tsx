import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "التحقق الإضافي",
  description: "Multi-factor authentication is introduced with the P1 authentication boundary.",
};

export default function MFASetupPage() {
  redirect("/login");
}
