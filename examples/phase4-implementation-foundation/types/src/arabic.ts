import { z } from "zod";

// Arabic Text Processing Schema - Based on extracted RTL protocols
export const ArabicTextSchema = z.object({
  content: z.string(),
  language: z.enum(["arabic", "english", "mixed"]),
  script: z.enum(["arabic", "latin", "mixed"]),
  direction: z.enum(["rtl", "ltr", "mixed"]).default("rtl"),
  dialect: z
    .enum(["iraqi", "standard", "gulf", "levantine", "maghrebi", "egyptian"])
    .default("iraqi"),
});

export type ArabicText = z.infer<typeof ArabicTextSchema>;

// RTL Processing Configuration
export const RTLConfigSchema = z.object({
  enabled: z.boolean().default(true),
  rtlSupport: z.boolean().default(true),
  dialectRecognition: z.boolean().default(true),
  supportedDialects: z
    .array(
      z.enum([
        "iraqi",
        "standard",
        "gulf",
        "levantine",
        "maghrebi",
        "egyptian",
      ]),
    )
    .default(["iraqi", "standard"]),
  mixedContentHandling: z.boolean().default(true),
  minimumAccuracy: z.number().min(0).max(1).default(0.99),
  processingTimeout: z.number().min(0).default(1000),
});

export type RTLConfig = z.infer<typeof RTLConfigSchema>;

// Arabic Processing Results
export const ArabicProcessingResultSchema = z.object({
  originalText: z.string(),
  processedText: z.string(),
  detectedLanguage: z.enum(["arabic", "english", "mixed"]),
  detectedDialect: z.enum([
    "iraqi",
    "standard",
    "gulf",
    "levantine",
    "maghrebi",
    "egyptian",
  ]),
  rtlDirection: z.enum(["rtl", "ltr", "mixed"]),
  rtlAccuracy: z.number().min(0).max(1),
  dialectAccuracy: z.number().min(0).max(1),
  processingTime: z.number().min(0),
  success: z.boolean(),
  errors: z.array(z.string()).default([]),
});

export type ArabicProcessingResult = z.infer<
  typeof ArabicProcessingResultSchema
>;

// Iraqi Dialect Recognition Schema
export const IraqiDialectSchema = z.object({
  text: z.string(),
  dialectRegion: z
    .enum(["baghdad", "basra", "mosul", "kurdistan", "anbar", "general"])
    .default("general"),
  confidence: z.number().min(0).max(1),
  features: z.array(z.string()).default([]),
  vocabulary: z
    .array(
      z.object({
        word: z.string(),
        meaning: z.string(),
        category: z
          .enum(["colloquial", "formal", "religious", "professional", "slang"])
          .default("colloquial"),
      }),
    )
    .default([]),
});

export type IraqiDialect = z.infer<typeof IraqiDialectSchema>;

// Mixed Content Processing
export const MixedContentSchema = z.object({
  segments: z.array(
    z.object({
      text: z.string(),
      language: z.enum(["arabic", "english"]),
      direction: z.enum(["rtl", "ltr"]),
      startIndex: z.number().min(0),
      endIndex: z.number().min(0),
    }),
  ),
  overallDirection: z.enum(["rtl", "ltr", "mixed"]).default("rtl"),
  dominantLanguage: z.enum(["arabic", "english", "balanced"]),
  processingStrategy: z
    .enum(["segment-based", "context-aware", "unified"])
    .default("context-aware"),
});

export type MixedContent = z.infer<typeof MixedContentSchema>;

// Arabic Typography Configuration
export const ArabicTypographySchema = z.object({
  fontFamily: z.string().default("font-arabic"),
  fontSize: z.string().default("16px"),
  lineHeight: z.string().default("1.6"),
  textAlign: z.enum(["right", "left", "center", "justify"]).default("right"),
  fontWeight: z
    .enum([
      "normal",
      "bold",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
    ])
    .default("normal"),
  letterSpacing: z.string().default("0.02em"),
  wordSpacing: z.string().default("0.1em"),
  contextualAlternates: z.boolean().default(true),
  ligatures: z.boolean().default(true),
});

export type ArabicTypography = z.infer<typeof ArabicTypographySchema>;
