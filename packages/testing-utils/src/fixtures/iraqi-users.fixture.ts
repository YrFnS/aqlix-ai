/**
 * Iraqi user fixtures for testing user-specific features
 * Provides diverse Iraqi user profiles across dialects and professional domains
 */

import type { IraqiUserFixture } from "../types";

/**
 * Collection of Iraqi user fixtures representing different dialects and domains
 */
export const iraqiUserFixtures: IraqiUserFixture[] = [
  {
    id: "user_legal_baghdad",
    name: "Ahmed Al-Baghdadi",
    nameArabic: "أحمد البغدادي",
    dialect: "baghdad",
    domain: "legal",
    preferences: {
      language: "ar-IQ",
      culturalCompliance: "strict",
    },
  },
  {
    id: "user_medical_basra",
    name: "Dr. Fatima Al-Basri",
    nameArabic: "د. فاطمة البصري",
    dialect: "basra",
    domain: "medical",
    preferences: {
      language: "ar-IQ",
      culturalCompliance: "standard",
    },
  },
  {
    id: "user_educational_mosul",
    name: "Prof. Omar Al-Mawsili",
    nameArabic: "أ.د. عمر الموصلي",
    dialect: "mosul",
    domain: "educational",
    preferences: {
      language: "ar-IQ",
      culturalCompliance: "standard",
    },
  },
  {
    id: "user_engineering_baghdad",
    name: "Eng. Zainab Hussein",
    nameArabic: "م. زينب حسين",
    dialect: "baghdad",
    domain: "engineering",
    preferences: {
      language: "ar-IQ",
      culturalCompliance: "standard",
    },
  },
  {
    id: "user_organizational_kurdish",
    name: "Karim Abdullah",
    nameArabic: "كريم عبدالله",
    dialect: "kurdish",
    domain: "organizational",
    preferences: {
      language: "ar-IQ",
      culturalCompliance: "relaxed",
    },
  },
  {
    id: "user_legal_basra_bilingual",
    name: "Hassan Al-Jubouri",
    nameArabic: "حسن الجبوري",
    dialect: "basra",
    domain: "legal",
    preferences: {
      language: "en-US",
      culturalCompliance: "standard",
    },
  },
  {
    id: "user_medical_baghdad_strict",
    name: "Dr. Maryam Al-Sadr",
    nameArabic: "د. مريم الصدر",
    dialect: "baghdad",
    domain: "medical",
    preferences: {
      language: "ar-IQ",
      culturalCompliance: "strict",
    },
  },
  {
    id: "user_educational_basra_relaxed",
    name: "Layla Ahmed",
    nameArabic: "ليلى أحمد",
    dialect: "basra",
    domain: "educational",
    preferences: {
      language: "ar-IQ",
      culturalCompliance: "relaxed",
    },
  },
];

/**
 * Get a random Iraqi user fixture
 */
export function getRandomIraqiUser(): IraqiUserFixture {
  const fixture =
    iraqiUserFixtures[Math.floor(Math.random() * iraqiUserFixtures.length)];
  if (!fixture) {
    throw new Error("No Iraqi user fixtures available");
  }
  return fixture;
}

/**
 * Get Iraqi user fixtures by dialect
 */
export function getIraqiUsersByDialect(
  dialect: "baghdad" | "basra" | "mosul" | "kurdish",
): IraqiUserFixture[] {
  return iraqiUserFixtures.filter((user) => user.dialect === dialect);
}

/**
 * Get Iraqi user fixtures by professional domain
 */
export function getIraqiUsersByDomain(
  domain:
    | "legal"
    | "medical"
    | "educational"
    | "engineering"
    | "organizational",
): IraqiUserFixture[] {
  return iraqiUserFixtures.filter((user) => user.domain === domain);
}

/**
 * Get Iraqi user fixtures by cultural compliance level
 */
export function getIraqiUsersByComplianceLevel(
  level: "strict" | "standard" | "relaxed",
): IraqiUserFixture[] {
  return iraqiUserFixtures.filter(
    (user) => user.preferences.culturalCompliance === level,
  );
}
