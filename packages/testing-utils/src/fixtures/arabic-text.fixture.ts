/**
 * Arabic text fixtures for testing text processing and RTL rendering
 * Provides diverse Arabic text samples across dialects and formality levels
 */

import type { ArabicTextFixture } from "../types";

/**
 * Collection of Arabic text fixtures with cultural and linguistic diversity
 */
export const arabicTextFixtures: ArabicTextFixture[] = [
  // Baghdad dialect - informal
  {
    id: "greeting_baghdad_informal",
    content: "شلونك اليوم؟ شكو ماكو جديد؟",
    dialect: "baghdad",
    type: "informal",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },
  {
    id: "question_baghdad_casual",
    content: "وين رايح؟ تعال نشرب چاي",
    dialect: "baghdad",
    type: "casual",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },

  // Basra dialect - informal
  {
    id: "greeting_basra_informal",
    content: "شخبارك؟ كلشي زين؟",
    dialect: "basra",
    type: "informal",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },
  {
    id: "conversation_basra_casual",
    content: "تفضل، اجلس وياي",
    dialect: "basra",
    type: "casual",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },

  // Mosul dialect - informal
  {
    id: "greeting_mosul_informal",
    content: "كيفك؟ شلون الحال؟",
    dialect: "mosul",
    type: "informal",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },

  // Standard Arabic - formal
  {
    id: "formal_greeting_standard",
    content: "السلام عليكم ورحمة الله وبركاته",
    dialect: "standard",
    type: "formal",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },
  {
    id: "formal_thanks_standard",
    content: "شكراً جزيلاً لكم على وقتكم الثمين",
    dialect: "standard",
    type: "formal",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },

  // Professional - Legal
  {
    id: "legal_professional",
    content: "وفقاً للقانون العراقي رقم ٢١ لسنة ٢٠٠٨",
    dialect: "standard",
    type: "professional",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },
  {
    id: "legal_contract",
    content: "بموجب أحكام القانون المدني العراقي، يلتزم الطرف الأول بـ...",
    dialect: "standard",
    type: "professional",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },

  // Professional - Medical
  {
    id: "medical_professional",
    content: "يرجى مراجعة الطبيب المختص للحصول على التشخيص الدقيق",
    dialect: "standard",
    type: "professional",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },
  {
    id: "medical_prescription",
    content: "الجرعة الموصى بها: قرص واحد ثلاث مرات يومياً بعد الطعام",
    dialect: "standard",
    type: "professional",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },

  // Professional - Educational
  {
    id: "educational_professional",
    content: "يسعدنا خدمتكم في مجال التعليم والتطوير المهني",
    dialect: "standard",
    type: "professional",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },
  {
    id: "educational_academic",
    content: "نتائج الامتحانات النهائية ستكون متاحة خلال أسبوعين",
    dialect: "standard",
    type: "professional",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },

  // Professional - Engineering
  {
    id: "engineering_professional",
    content: "المواصفات الفنية للمشروع تتطلب استخدام مواد عالية الجودة",
    dialect: "standard",
    type: "professional",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },

  // Mixed Arabic-English content
  {
    id: "mixed_content_name_email",
    content: "الاسم: أحمد محمد، Email: ahmed@example.com",
    dialect: "standard",
    type: "professional",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },
  {
    id: "mixed_content_technical",
    content: "للتواصل عبر API يرجى استخدام المفتاح التالي: api_key_12345",
    dialect: "standard",
    type: "professional",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },
];

/**
 * Get a random Arabic text fixture
 */
export function getRandomArabicText(): ArabicTextFixture {
  return arabicTextFixtures[
    Math.floor(Math.random() * arabicTextFixtures.length)
  ];
}

/**
 * Get Arabic text fixtures by dialect
 */
export function getArabicTextByDialect(dialect: string): ArabicTextFixture[] {
  return arabicTextFixtures.filter((text) => text.dialect === dialect);
}

/**
 * Get Arabic text fixtures by type
 */
export function getArabicTextByType(
  type: "formal" | "informal" | "professional" | "casual",
): ArabicTextFixture[] {
  return arabicTextFixtures.filter((text) => text.type === type);
}

/**
 * Get culturally appropriate Arabic text fixtures only
 */
export function getCulturallyAppropriateArabicText(): ArabicTextFixture[] {
  return arabicTextFixtures.filter((text) => text.culturallyAppropriate);
}

/**
 * Get mixed Arabic-English content fixtures
 */
export function getMixedContentFixtures(): ArabicTextFixture[] {
  return arabicTextFixtures.filter((text) => text.content.match(/[a-zA-Z]/));
}
