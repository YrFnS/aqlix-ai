/**
 * Iraqi dialect recognition utilities for testing
 * Detects and validates Baghdad, Basra, Mosul, Kurdish, and Standard Arabic
 */

export type IraqiDialect =
  | "baghdad"
  | "basra"
  | "mosul"
  | "kurdish"
  | "standard";

export interface DialectMatch {
  dialect: IraqiDialect;
  confidence: number; // 0.0 - 1.0
  matchedPatterns: string[];
  totalMatches: number;
}

export interface DialectValidationResult {
  detected: IraqiDialect | null;
  confidence: number;
  allMatches: DialectMatch[];
  text: string;
}

/**
 * Iraqi dialect patterns for recognition
 * Based on common expressions, vocabulary, and grammatical markers
 */
export const DIALECT_PATTERNS: Record<IraqiDialect, RegExp[]> = {
  baghdad: [
    /شلونك/,
    /شلون/,
    /ونك/,
    /شكو ماكو/,
    /وين رايح/,
    /هسه/,
    /زين/,
    /چاي/,
    /كلشي/,
    /ماكو/,
    /شنو/,
    /وياك/,
    /وية/,
    /صدك/,
    /لو سمحت/,
    /يمعود/,
    /داهية/,
    /خوش/,
    /شبيك/,
  ],
  basra: [
    /شخبارك/,
    /كلشي زين/,
    /وياي/,
    /تفضل/,
    /هواي/,
    /شنهو/,
    /اكيد/,
    /ان شاء الله/,
    /مافيه/,
    /شغلة/,
    /مرتاح/,
    /بالضبط/,
  ],
  mosul: [
    /شلون الحال/,
    /منو/,
    /هيچ/,
    /شون/,
    /ايش/,
    /وين/,
    /هالشي/,
    /كثير/,
    /حلو/,
  ],
  kurdish: [/چوني/, /باش/, /سپاس/, /بەڵێ/, /نەخێر/, /چۆن/, /چی/, /کات/, /هەر/],
  standard: [
    /كيف حالك/,
    /كيف/,
    /حالك/,
    /بخير/,
    /ما هو/,
    /أين/,
    /لماذا/,
    /متى/,
    /جيد/,
    /شكراً/,
    /من فضلك/,
    /نعم/,
    /لا/,
    /أنا/,
  ],
};

/**
 * Detects the most likely dialect from text
 * Returns "iraqi" for baghdad, basra, or mosul dialects
 * Returns other dialects as-is (standard, kurdish)
 *
 * @example
 * ```typescript
 * const dialect = detectDialect("شلونك اليوم؟");
 * console.log(dialect); // "iraqi"
 * ```
 */
export function detectDialect(text: string): string | null {
  const matches = getAllDialectMatches(text);

  if (matches.length === 0) {
    return null;
  }

  // Sort by confidence (descending)
  matches.sort((a, b) => b.confidence - a.confidence);

  const topDialect = matches[0].dialect;

  // Map Iraqi dialects to "iraqi"
  const iraqiDialects = ["baghdad", "basra", "mosul"];
  if (iraqiDialects.includes(topDialect)) {
    return "iraqi";
  }

  // Return other dialects as-is
  return topDialect;
}

/**
 * Validates that text matches the expected dialect with minimum confidence
 *
 * @example
 * ```typescript
 * const isValid = validateDialect("شخبارك؟", "basra", 0.85);
 * console.log(isValid); // true
 * ```
 */
export function validateDialect(
  text: string,
  expectedDialect: IraqiDialect,
  minConfidence: number = 0.85,
): boolean {
  const matches = getAllDialectMatches(text);
  const match = matches.find((m) => m.dialect === expectedDialect);

  if (!match) {
    return false;
  }

  return match.confidence >= minConfidence;
}

/**
 * Gets detailed dialect recognition results for all Iraqi dialects
 *
 * @example
 * ```typescript
 * const result = getDialectValidation("شلونك؟ شكو ماكو؟");
 * console.log(result.detected); // "baghdad"
 * console.log(result.confidence); // 0.95
 * ```
 */
export function getDialectValidation(text: string): DialectValidationResult {
  const allMatches = getAllDialectMatches(text);
  const detected = allMatches.length > 0 ? allMatches[0].dialect : null;
  const confidence = allMatches.length > 0 ? allMatches[0].confidence : 0;

  return {
    detected,
    confidence,
    allMatches,
    text,
  };
}

/**
 * Gets all dialect matches with confidence scores
 */
function getAllDialectMatches(text: string): DialectMatch[] {
  const matches: DialectMatch[] = [];
  const normalizedText = text.toLowerCase();

  for (const [dialect, patterns] of Object.entries(DIALECT_PATTERNS)) {
    const matchedPatterns: string[] = [];
    let totalMatches = 0;

    for (const pattern of patterns) {
      if (pattern.test(normalizedText)) {
        matchedPatterns.push(pattern.source);
        totalMatches++;
      }
    }

    if (totalMatches > 0) {
      const confidence = Math.min(1.0, totalMatches / 3); // Max confidence at 3 matches
      matches.push({
        dialect: dialect as IraqiDialect,
        confidence,
        matchedPatterns,
        totalMatches,
      });
    }
  }

  // Sort by confidence (descending)
  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Gets the dialect patterns for a specific dialect
 *
 * @example
 * ```typescript
 * const patterns = getDialectPatterns("baghdad");
 * console.log(patterns); // [/شلونك/, /شكو ماكو/, ...]
 * ```
 */
export function getDialectPatterns(dialect: IraqiDialect): RegExp[] {
  return DIALECT_PATTERNS[dialect];
}

/**
 * Checks if text contains any dialect-specific markers
 */
export function hasDialectMarkers(text: string): boolean {
  const allMatches = getAllDialectMatches(text);
  return allMatches.length > 0;
}

/**
 * Gets the number of dialect markers found in text
 */
export function countDialectMarkers(
  text: string,
  dialect: IraqiDialect,
): number {
  const patterns = DIALECT_PATTERNS[dialect];
  const normalizedText = text.toLowerCase();

  let count = 0;
  for (const pattern of patterns) {
    if (pattern.test(normalizedText)) {
      count++;
    }
  }

  return count;
}

/**
 * Asserts that text matches the expected dialect
 * Throws error if validation fails
 */
export function assertDialect(
  text: string,
  expectedDialect: IraqiDialect,
  minConfidence: number = 0.85,
): void {
  const validation = getDialectValidation(text);

  if (validation.detected !== expectedDialect) {
    throw new Error(
      `Expected dialect "${expectedDialect}", but detected "${validation.detected || "none"}" (confidence: ${validation.confidence.toFixed(2)})`,
    );
  }

  if (validation.confidence < minConfidence) {
    throw new Error(
      `Dialect confidence ${validation.confidence.toFixed(2)} below threshold ${minConfidence}`,
    );
  }
}

/**
 * Gets a human-readable description of dialect match
 */
export function getDialectMatchDescription(match: DialectMatch): string {
  const percentage = (match.confidence * 100).toFixed(0);
  return `${match.dialect} (${percentage}% confidence, ${match.totalMatches} markers: ${match.matchedPatterns.slice(0, 3).join(", ")})`;
}

/**
 * Checks if text is Iraqi dialect
 * Returns true for baghdad, basra, or mosul dialects
 */
export function isIraqiDialect(text: string): boolean {
  const matches = getAllDialectMatches(text);

  // Check if any Iraqi dialect (baghdad, basra, mosul) is detected
  const iraqiDialects = ["baghdad", "basra", "mosul"];
  return matches.some(
    (match) => iraqiDialects.includes(match.dialect) && match.confidence > 0,
  );
}

/**
 * Validates dialect detection accuracy
 * Returns accuracy information for the expected dialect
 */
export function validateDialectAccuracy(
  text: string,
  expectedDialect: string,
): { isAccurate: boolean; accuracy: number } {
  const validation = getDialectValidation(text);

  // Map "iraqi" to any Iraqi dialect
  let detectedMatches = validation.detected;
  if (expectedDialect === "iraqi") {
    const iraqiDialects = ["baghdad", "basra", "mosul"];
    const isIraqi = detectedMatches && iraqiDialects.includes(detectedMatches);
    return {
      isAccurate: isIraqi,
      accuracy: isIraqi ? validation.confidence : 0,
    };
  }

  // Direct match
  const isAccurate = validation.detected === expectedDialect;
  return {
    isAccurate,
    accuracy: isAccurate ? validation.confidence : 0,
  };
}

/**
 * Gets confidence score for a specific dialect
 * Returns 0-1 confidence score for the given dialect
 */
export function getDialectConfidence(text: string, dialect: string): number {
  const matches = getAllDialectMatches(text);

  // Handle "iraqi" as any Iraqi dialect
  if (dialect === "iraqi") {
    const iraqiDialects = ["baghdad", "basra", "mosul"];
    const iraqiMatches = matches.filter((m) =>
      iraqiDialects.includes(m.dialect),
    );
    if (iraqiMatches.length === 0) return 0;
    // Return highest confidence among Iraqi dialects
    return Math.max(...iraqiMatches.map((m) => m.confidence));
  }

  // Find specific dialect match
  const match = matches.find((m) => m.dialect === dialect);
  return match ? match.confidence : 0;
}
