import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: "Registration is introduced with the P1 authentication boundary.",
};

export default function RegisterPage() {
  redirect("/login");
}
