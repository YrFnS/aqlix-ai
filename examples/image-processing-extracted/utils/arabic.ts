// Arabic Text Processing Utilities
// Extracted and enhanced for Iraqi AI Chat System

export interface ArabicTextInfo {
  isArabic: boolean;
  isRTL: boolean;
  isMixed: boolean;
  dialect?: "iraqi" | "gulf" | "msa" | "levantine";
  confidence: number;
  direction: "ltr" | "rtl" | "auto";
}

export interface DialectMarkers {
  iraqi: string[];
  gulf: string[];
  msa: string[];
  levantine: string[];
}

// Dialect detection markers
const DIALECT_MARKERS: DialectMarkers = {
  iraqi: [
    "شلونك",
    "شكو ماكو",
    "بسة",
    "دازة",
    "كلش",
    "لية",
    "عدكم",
    "وية",
    "يالة",
    "شوف",
    "هسة",
    "بعدين",
    "كمان",
    "خوش",
    "زين",
    "مال",
    "داخل",
    "طالع",
    "جاي",
    "رايح",
  ],
  gulf: [
    "شلونك",
    "وايد",
    "خوش",
    "يالله",
    "شصاير",
    "يسلموا",
    "تكفى",
    "خلاص",
    "زين",
    "حيل",
    "مدري",
    "اي والله",
    "صج",
    "لا والله",
    "ماشي",
    "عادي",
    "طيب",
  ],
  msa: [
    "كيف حالك",
    "ما أخبارك",
    "كثيراً",
    "ممتاز",
    "جيد جداً",
    "شكراً جزيلاً",
    "على الرحب والسعة",
    "أهلاً وسهلاً",
    "مع السلامة",
    "إلى اللقاء",
    "بالطبع",
  ],
  levantine: [
    "كيفك",
    "شو اخبارك",
    "كتير",
    "منيح",
    "حلو",
    "يلا",
    "خلص",
    "بدك",
    "عم بحكي",
    "شو رايك",
    "ما بعرف",
    "أكيد",
    "مبسوط",
    "زهقان",
    "تعبان",
  ],
};

// Arabic Unicode ranges
const ARABIC_RANGES = [
  [0x0600, 0x06ff], // Arabic
  [0x0750, 0x077f], // Arabic Supplement
  [0x08a0, 0x08ff], // Arabic Extended-A
  [0xfb50, 0xfdff], // Arabic Presentation Forms-A
  [0xfe70, 0xfeff], // Arabic Presentation Forms-B
];

/**
 * Check if a character is Arabic
 */
export function isArabicCharacter(char: string): boolean {
  const code = char.charCodeAt(0);
  return ARABIC_RANGES.some(([start, end]) => code >= start && code <= end);
}

/**
 * Check if text contains Arabic characters
 */
export function containsArabic(text: string): boolean {
  return Array.from(text).some(isArabicCharacter);
}

/**
 * Calculate the ratio of Arabic characters in text
 */
export function getArabicRatio(text: string): number {
  if (!text) return 0;

  const chars = Array.from(text);
  const arabicChars = chars.filter(isArabicCharacter);
  return arabicChars.length / chars.length;
}

/**
 * Detect if text is primarily RTL
 */
export function isRTLText(text: string): boolean {
  const arabicRatio = getArabicRatio(text);
  return arabicRatio > 0.3; // More than 30% Arabic characters
}

/**
 * Detect if text contains mixed languages
 */
export function isMixedLanguageText(text: string): boolean {
  const arabicRatio = getArabicRatio(text);
  const latinPattern = /[a-zA-Z]/;
  const hasLatin = latinPattern.test(text);
  const hasArabic = arabicRatio > 0;

  return hasArabic && hasLatin && arabicRatio > 0.1 && arabicRatio < 0.9;
}

/**
 * Detect Arabic dialect based on common phrases and words
 */
export function detectArabicDialect(text: string): {
  dialect: keyof DialectMarkers | null;
  confidence: number;
  scores: Record<keyof DialectMarkers, number>;
} {
  if (!containsArabic(text)) {
    return {
      dialect: null,
      confidence: 0,
      scores: { iraqi: 0, gulf: 0, msa: 0, levantine: 0 },
    };
  }

  const normalizedText = text.toLowerCase().replace(/\s+/g, " ");
  const scores: Record<keyof DialectMarkers, number> = {
    iraqi: 0,
    gulf: 0,
    msa: 0,
    levantine: 0,
  };

  // Calculate scores for each dialect
  Object.entries(DIALECT_MARKERS).forEach(([dialect, markers]) => {
    markers.forEach((marker) => {
      if (normalizedText.includes(marker)) {
        scores[dialect as keyof DialectMarkers] += 1;
      }
    });
  });

  // Find the dialect with highest score
  const maxScore = Math.max(...Object.values(scores));
  const totalMarkers = Object.values(DIALECT_MARKERS).flat().length;

  if (maxScore === 0) {
    return { dialect: null, confidence: 0, scores };
  }

  const dialect = Object.entries(scores).find(
    ([_, score]) => score === maxScore,
  )?.[0] as keyof DialectMarkers;
  const confidence = maxScore / totalMarkers;

  return { dialect, confidence, scores };
}

/**
 * Analyze Arabic text comprehensively
 */
export function analyzeArabicText(text: string): ArabicTextInfo {
  const isArabic = containsArabic(text);
  const isRTL = isRTLText(text);
  const isMixed = isMixedLanguageText(text);

  let dialect: keyof DialectMarkers | undefined;
  let confidence = 0;

  if (isArabic) {
    const dialectInfo = detectArabicDialect(text);
    dialect = dialectInfo.dialect || undefined;
    confidence = dialectInfo.confidence;
  }

  // Determine text direction
  let direction: "ltr" | "rtl" | "auto" = "ltr";
  if (isMixed) {
    direction = "auto";
  } else if (isRTL) {
    direction = "rtl";
  }

  return {
    isArabic,
    isRTL,
    isMixed,
    dialect,
    confidence,
    direction,
  };
}

/**
 * Format Arabic text for display
 */
export function formatArabicText(
  text: string,
  options?: {
    preserveWhitespace?: boolean;
    normalizeNumbers?: boolean;
    addBidiMarks?: boolean;
  },
): string {
  if (!text) return text;

  let formatted = text;
  const opts = {
    preserveWhitespace: false,
    normalizeNumbers: true,
    addBidiMarks: true,
    ...options,
  };

  // Normalize whitespace
  if (!opts.preserveWhitespace) {
    formatted = formatted.replace(/\s+/g, " ").trim();
  }

  // Normalize Arabic-Indic digits to Western digits
  if (opts.normalizeNumbers) {
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    const westernDigits = "0123456789";

    for (let i = 0; i < 10; i++) {
      formatted = formatted.replace(
        new RegExp(arabicDigits[i], "g"),
        westernDigits[i],
      );
    }
  }

  // Add bidirectional marks for mixed content
  if (opts.addBidiMarks && isMixedLanguageText(formatted)) {
    // Add RLM (Right-to-Left Mark) after Arabic text
    formatted = formatted.replace(
      /([\u0600-\u06FF\u0750-\u077F]+)/g,
      "$1\u200F",
    );

    // Add LRM (Left-to-Right Mark) after Latin text
    formatted = formatted.replace(/([a-zA-Z0-9]+)/g, "$1\u200E");
  }

  return formatted;
}

/**
 * Clean Arabic text for processing
 */
export function cleanArabicText(text: string): string {
  if (!text) return text;

  return (
    text
      // Remove diacritics (Tashkeel)
      .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
      // Normalize Alef variations
      .replace(/[آأإا]/g, "ا")
      // Normalize Yeh/Alef Maksura
      .replace(/[يى]/g, "ي")
      // Normalize Teh Marbuta
      .replace(/ة/g, "ه")
      // Remove extra whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Validate Arabic text for cultural appropriateness
 */
export function validateArabicText(
  text: string,
  context?: {
    professionalDomain?: string;
    islamicCompliance?: boolean;
    blockedTerms?: string[];
  },
): {
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 1.0;

  if (!text || !containsArabic(text)) {
    return { isValid: true, score: 1.0, issues: [], suggestions: [] };
  }

  const ctx = {
    professionalDomain: "general",
    islamicCompliance: true,
    blockedTerms: [],
    ...context,
  };

  // Check for blocked terms
  if (ctx.blockedTerms && ctx.blockedTerms.length > 0) {
    const normalizedText = text.toLowerCase();
    ctx.blockedTerms.forEach((term) => {
      if (normalizedText.includes(term.toLowerCase())) {
        issues.push(`Contains blocked term: ${term}`);
        score -= 0.3;
      }
    });
  }

  // Basic inappropriate content detection
  const inappropriatePatterns = ["عنف", "كراهية", "عنصرية", "تمييز", "إرهاب"];

  inappropriatePatterns.forEach((pattern) => {
    if (text.includes(pattern)) {
      issues.push(`Potentially inappropriate content detected: ${pattern}`);
      score -= 0.4;
    }
  });

  // Islamic compliance checks
  if (ctx.islamicCompliance) {
    const islamicPhrases = [
      "بسم الله",
      "إن شاء الله",
      "الحمد لله",
      "اللهم",
      "صلى الله عليه وسلم",
    ];
    const hasIslamic = islamicPhrases.some((phrase) => text.includes(phrase));

    if (hasIslamic) {
      score += 0.1; // Boost for Islamic content
    }
  }

  // Professional domain validation
  if (ctx.professionalDomain === "legal") {
    if (
      !text.includes("قانون") &&
      !text.includes("حق") &&
      !text.includes("محكمة")
    ) {
      suggestions.push(
        "Consider adding legal terminology for professional legal context",
      );
    }
  } else if (ctx.professionalDomain === "medical") {
    if (
      !text.includes("طب") &&
      !text.includes("صحة") &&
      !text.includes("مرض")
    ) {
      suggestions.push(
        "Consider adding medical terminology for professional medical context",
      );
    }
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, Math.min(1, score));

  return {
    isValid: score >= 0.6,
    score,
    issues,
    suggestions,
  };
}

/**
 * Generate Arabic text suggestions based on context
 */
export function generateArabicSuggestions(
  text: string,
  dialect: keyof DialectMarkers = "iraqi",
): string[] {
  const suggestions: string[] = [];

  if (!text) return suggestions;

  const dialectInfo = analyzeArabicText(text);

  // Suggest common greetings if none present
  const greetings = ["السلام عليكم", "أهلاً وسهلاً", "مرحباً"];
  if (!greetings.some((greeting) => text.includes(greeting))) {
    suggestions.push("بدء بتحية مناسبة"); // Start with appropriate greeting
  }

  // Suggest Islamic phrases for blessing
  const islamicPhrases = ["بسم الله", "إن شاء الله", "بإذن الله"];
  if (!islamicPhrases.some((phrase) => text.includes(phrase))) {
    suggestions.push("إضافة عبارة إسلامية مناسبة"); // Add appropriate Islamic phrase
  }

  // Dialect-specific suggestions
  if (dialectInfo.dialect !== dialect) {
    const dialectName = DIALECT_MARKERS[dialect]
      ? dialect === "iraqi"
        ? "العراقية"
        : dialect === "gulf"
          ? "الخليجية"
          : dialect === "msa"
            ? "الفصحى"
            : "الشامية"
      : "المحلية";
    suggestions.push(`تحويل إلى اللهجة ${dialectName}`); // Convert to [dialect] dialect
  }

  // Formality suggestions
  if (text.length < 20) {
    suggestions.push("إضافة تفاصيل أكثر"); // Add more details
  }

  if (text.includes("أريد") || text.includes("أتمنى")) {
    suggestions.push("استخدام صيغة أكثر تأدباً"); // Use more polite form
  }

  return suggestions.slice(0, 5); // Return max 5 suggestions
}

/**
 * Convert Arabic numerals to text
 */
export function arabicNumeralsToText(num: number): string {
  const ones = [
    "",
    "واحد",
    "اثنان",
    "ثلاثة",
    "أربعة",
    "خمسة",
    "ستة",
    "سبعة",
    "ثمانية",
    "تسعة",
  ];
  const tens = [
    "",
    "",
    "عشرون",
    "ثلاثون",
    "أربعون",
    "خمسون",
    "ستون",
    "سبعون",
    "ثمانون",
    "تسعون",
  ];
  const hundreds = [
    "",
    "مائة",
    "مئتان",
    "ثلاثمائة",
    "أربعمائة",
    "خمسمائة",
    "ستمائة",
    "سبعمائة",
    "ثمانمائة",
    "تسعمائة",
  ];

  if (num === 0) return "صفر";
  if (num < 0) return "سالب " + arabicNumeralsToText(-num);
  if (num >= 1000) return num.toString(); // Fallback for large numbers

  let result = "";

  // Hundreds
  if (num >= 100) {
    result += hundreds[Math.floor(num / 100)] + " ";
    num %= 100;
  }

  // Special cases for 11-19
  if (num >= 11 && num <= 19) {
    const special = [
      "",
      "أحد عشر",
      "اثنا عشر",
      "ثلاثة عشر",
      "أربعة عشر",
      "خمسة عشر",
      "ستة عشر",
      "سبعة عشر",
      "ثمانية عشر",
      "تسعة عشر",
    ];
    result += special[num - 10];
  } else {
    // Tens
    if (num >= 20) {
      result += tens[Math.floor(num / 10)];
      num %= 10;
      if (num > 0) result += " ";
    }

    // Ones
    if (num > 0 && num <= 9) {
      result += ones[num];
    } else if (num === 10) {
      result += "عشرة";
    }
  }

  return result.trim();
}
