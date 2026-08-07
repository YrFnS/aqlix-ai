import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "أمثلة قديمة",
  description: "Legacy form demonstrations are outside the active product surface.",
};

export default function FormsExamplePage() {
  redirect("/dashboard");
}
