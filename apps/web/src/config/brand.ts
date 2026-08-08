export const brand = {
  // Temporary neutral descriptor. Do not replace this with a permanent product
  // name until naming, domain, handle, and trademark checks are complete.
  name: "AI Workspace",
  shortName: "Workspace",
  category: "Arabic-first AI workspace",
  categoryAr: "مساحة عمل عربية أولاً بالذكاء الاصطناعي",
  tagline: "Bring the context. Turn it into work.",
  taglineAr: "اجمع السياق، وحوّله إلى عمل واضح.",
  description:
    "An Arabic-first, bilingual AI workspace for turning conversations and documents into clear, reusable work.",
  descriptionAr:
    "مساحة عمل عربية أولاً، ثنائية اللغة، تحوّل المحادثات والمستندات إلى عمل واضح وقابل للاستخدام.",
  status: "Product name pending",
  links: {
    home: "/",
    workspace: "/workspaces",
    signIn: "/login",
    registration: "/register",
    documentation: "/docs",
  },
} as const;

export type Brand = typeof brand;
