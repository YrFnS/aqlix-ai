import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "صفحة اختبار قديمة",
  description: "Legacy manual error demonstrations are outside the active product surface.",
};

export default function TestErrorsPage() {
  redirect("/dashboard");
}
