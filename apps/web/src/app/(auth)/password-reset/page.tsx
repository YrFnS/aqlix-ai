import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "استعادة الحساب",
  description: "Account recovery is introduced with the P1 authentication boundary.",
};

export default function PasswordResetPage() {
  redirect("/login");
}
