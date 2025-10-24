"use client";

/**
 * Cultural Greeting Component
 * Displays personalized greetings based on:
 * - Time of day (morning, afternoon, evening)
 * - Islamic compliance level
 * - Regional variations (Baghdad, Basra, Mosul, Erbil)
 * - Professional etiquette level
 * - Language preference
 */

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CulturalGreetingProps {
  fullName?: string;
  region?: "baghdad" | "basra" | "mosul" | "erbil" | "other";
  islamicComplianceLevel?: "basic" | "standard" | "strict";
  languagePreference?: "ar-IQ" | "en-US" | "both";
  professionalEtiquetteLevel?: "standard" | "formal" | "traditional";
  timeOverride?: Date; // For testing
  className?: string;
  showRegionalVariation?: boolean;
  showProfessionalSuffix?: boolean;
}

// Regional greeting variations
const REGIONAL_GREETINGS = {
  baghdad: "شلونك", // Shlonuk
  basra: "شلونكم", // Shlonkum
  mosul: "كيفك", // Kifuk
  erbil: "چونی", // Choni (Kurdish)
  other: "شلونك", // Default to Baghdad dialect
} as const;

// Professional titles by etiquette level
const PROFESSIONAL_TITLES = {
  standard: {
    ar: "أستاذ", // Ustadh
    en: "Mr./Ms.",
  },
  formal: {
    ar: "الأستاذ الفاضل", // Al-Ustadh Al-Fadhil
    en: "Distinguished",
  },
  traditional: {
    ar: "سيادة الأستاذ", // Siyadat Al-Ustadh
    en: "Honorable",
  },
} as const;

export function CulturalGreeting({
  fullName,
  region = "baghdad",
  islamicComplianceLevel = "standard",
  languagePreference = "both",
  professionalEtiquetteLevel = "standard",
  timeOverride,
  className,
  showRegionalVariation = true,
  showProfessionalSuffix = false,
}: CulturalGreetingProps) {
  const greeting = useMemo(() => {
    const now = timeOverride || new Date();
    const hour = now.getHours();

    // Determine time of day
    let timeOfDay: "morning" | "afternoon" | "evening";
    if (hour >= 5 && hour < 12) {
      timeOfDay = "morning";
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = "afternoon";
    } else {
      timeOfDay = "evening";
    }

    // Build primary greeting based on Islamic compliance level
    let primaryGreeting = "";
    let englishGreeting = "";

    if (
      islamicComplianceLevel === "standard" ||
      islamicComplianceLevel === "strict"
    ) {
      // Full Islamic greeting for standard and strict
      primaryGreeting = "السلام عليكم ورحمة الله وبركاته";
      englishGreeting = "Peace be upon you";
    } else {
      // Time-based greeting for basic compliance
      if (timeOfDay === "morning") {
        primaryGreeting = "صباح الخير";
        englishGreeting = "Good morning";
      } else if (timeOfDay === "afternoon") {
        primaryGreeting = "مساء الخير";
        englishGreeting = "Good afternoon";
      } else {
        primaryGreeting = "مساء الخير";
        englishGreeting = "Good evening";
      }
    }

    // Add regional variation
    const regionalVariation = showRegionalVariation
      ? REGIONAL_GREETINGS[region]
      : undefined;

    // Add professional suffix if needed
    let professionalSuffix = "";
    if (showProfessionalSuffix && fullName) {
      const title = PROFESSIONAL_TITLES[professionalEtiquetteLevel];
      if (languagePreference === "ar-IQ") {
        professionalSuffix = `${title.ar} ${fullName}`;
      } else if (languagePreference === "en-US") {
        professionalSuffix = `${title.en} ${fullName}`;
      } else {
        professionalSuffix = `${title.ar} ${fullName}`;
      }
    }

    return {
      primaryGreeting,
      englishGreeting,
      regionalVariation,
      professionalSuffix,
      timeOfDay,
    };
  }, [
    fullName,
    region,
    islamicComplianceLevel,
    languagePreference,
    professionalEtiquetteLevel,
    timeOverride,
    showRegionalVariation,
    showProfessionalSuffix,
  ]);

  // Render based on language preference
  if (languagePreference === "ar-IQ") {
    return (
      <div
        className={cn("font-arabic space-y-1 text-right", className)}
        dir="rtl"
      >
        <p className="text-lg font-semibold">{greeting.primaryGreeting}</p>
        {greeting.regionalVariation && (
          <p className="text-muted-foreground text-sm">
            {greeting.regionalVariation}
          </p>
        )}
        {greeting.professionalSuffix && (
          <p className="text-sm font-medium">{greeting.professionalSuffix}</p>
        )}
      </div>
    );
  }

  if (languagePreference === "en-US") {
    return (
      <div className={cn("space-y-1 text-left", className)} dir="ltr">
        <p className="text-lg font-semibold">{greeting.englishGreeting}</p>
        {greeting.professionalSuffix && (
          <p className="text-sm font-medium">{greeting.professionalSuffix}</p>
        )}
      </div>
    );
  }

  // Both languages (default)
  return (
    <div className={cn("space-y-2", className)}>
      {/* Arabic Greeting */}
      <div className="font-arabic text-right" dir="rtl">
        <p className="text-lg font-semibold">{greeting.primaryGreeting}</p>
        {greeting.regionalVariation && (
          <p className="text-muted-foreground text-sm">
            {greeting.regionalVariation}
          </p>
        )}
      </div>

      {/* English Greeting */}
      <div className="text-left" dir="ltr">
        <p className="text-muted-foreground text-sm">
          {greeting.englishGreeting}
        </p>
      </div>

      {/* Professional Suffix (if applicable) */}
      {greeting.professionalSuffix && (
        <div className="font-arabic text-right" dir="rtl">
          <p className="text-sm font-medium">{greeting.professionalSuffix}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Compact Cultural Greeting Component
 * For inline use in headers or small spaces
 */
export function CompactCulturalGreeting({
  fullName,
  region = "baghdad",
  islamicComplianceLevel = "standard",
  languagePreference = "both",
  className,
}: Pick<
  CulturalGreetingProps,
  | "fullName"
  | "region"
  | "islamicComplianceLevel"
  | "languagePreference"
  | "className"
>) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    // Simple greeting based on Islamic compliance
    if (
      islamicComplianceLevel === "standard" ||
      islamicComplianceLevel === "strict"
    ) {
      return {
        ar: "السلام عليكم",
        en: "Peace be upon you",
        regional: REGIONAL_GREETINGS[region],
      };
    }

    // Time-based for basic compliance
    if (hour >= 5 && hour < 12) {
      return {
        ar: "صباح الخير",
        en: "Good morning",
        regional: REGIONAL_GREETINGS[region],
      };
    } else {
      return {
        ar: "مساء الخير",
        en: "Good evening",
        regional: REGIONAL_GREETINGS[region],
      };
    }
  }, [region, islamicComplianceLevel]);

  if (languagePreference === "ar-IQ") {
    return (
      <span
        className={cn("font-arabic inline-flex items-center gap-2", className)}
        dir="rtl"
      >
        <span>{greeting.ar}</span>
        {fullName && <span className="font-semibold">{fullName}</span>}
      </span>
    );
  }

  if (languagePreference === "en-US") {
    return (
      <span
        className={cn("inline-flex items-center gap-2", className)}
        dir="ltr"
      >
        <span>{greeting.en}</span>
        {fullName && <span className="font-semibold">{fullName}</span>}
      </span>
    );
  }

  // Both languages - show Arabic with regional variation
  return (
    <span
      className={cn("font-arabic inline-flex items-center gap-2", className)}
      dir="rtl"
    >
      <span>{greeting.regional || greeting.ar}</span>
      {fullName && <span className="font-semibold">{fullName}</span>}
    </span>
  );
}

/**
 * Welcome Message Component
 * Full welcome message with name and cultural context
 */
export function WelcomeMessage({
  fullName,
  region = "baghdad",
  islamicComplianceLevel = "standard",
  languagePreference = "both",
  professionalEtiquetteLevel = "standard",
  className,
}: Pick<
  CulturalGreetingProps,
  | "fullName"
  | "region"
  | "islamicComplianceLevel"
  | "languagePreference"
  | "professionalEtiquetteLevel"
  | "className"
>) {
  return (
    <div className={cn("space-y-3", className)}>
      <CulturalGreeting
        fullName={fullName}
        region={region}
        islamicComplianceLevel={islamicComplianceLevel}
        languagePreference={languagePreference}
        professionalEtiquetteLevel={professionalEtiquetteLevel}
        showRegionalVariation={true}
        showProfessionalSuffix={!!fullName}
      />

      {/* Welcome back message */}
      {fullName && (
        <div
          className={cn(
            "text-muted-foreground text-sm",
            languagePreference === "ar-IQ"
              ? "font-arabic text-right"
              : "text-left",
          )}
          dir={languagePreference === "ar-IQ" ? "rtl" : "ltr"}
        >
          {languagePreference === "en-US"
            ? "Welcome back"
            : languagePreference === "ar-IQ"
              ? "أهلاً بعودتك"
              : "أهلاً بعودتك / Welcome back"}
        </div>
      )}
    </div>
  );
}
