export const brand = {
  name: "Kiteb",
  shortName: "Kiteb",
  category: "Arabic-first AI workspace",
  categoryAr: "مساحة عمل عربية أولاً بالذكاء الاصطناعي",
  tagline: "Bring the context. Turn it into work.",
  taglineAr: "اجمع السياق، وحوّله إلى عمل واضح.",
  description:
    "An Arabic-first, bilingual AI workspace for turning conversations and documents into clear, reusable work.",
  descriptionAr:
    "مساحة عمل عربية أولاً، ثنائية اللغة، تحوّل المحادثات والمستندات إلى عمل واضح وقابل للاستخدام.",
  status: "P1 workspace foundation",
  links: {
    home: "/",
    workspace: "/workspaces",
    signIn: "/login",
    registration: "/register",
    documentation: "/docs",
  },
} as const;

export type Brand = typeof brand;
