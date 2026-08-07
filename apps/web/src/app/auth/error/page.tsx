import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "حالة الحساب",
  description: "Authentication is being rebuilt as part of P1.",
};

export default function AuthErrorPage() {
  redirect("/login");
}
