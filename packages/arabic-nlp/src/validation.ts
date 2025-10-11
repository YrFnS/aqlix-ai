/**
 * Security-focused validation for Arabic text
 * Detects Unicode-based attacks and security threats
 * @module @iraqi-ai/arabic-nlp/validation
 */

import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  SecurityThreat,
  ValidationOptions,
} from "./types/index.js";
import {
  BIDI_OVERRIDE_REGEX,
  HIGH_SEVERITY_BIDI,
  MALICIOUS_ZERO_WIDTH_REGEX,
  ALL_ZERO_WIDTH_REGEX,
  SUSPICIOUS_CONTROL_REGEX,
  CYRILLIC_LOOKALIKE_REGEX,
  ATTACK_PATTERNS,
  isBidiOverride,
  MAX_CONSECUTIVE_ZERO_WIDTH,
} from "./constants/security-patterns.js";
import { isMixedContent } from "./characters.js";

/**
 * Validate Arabic text for security threats and integrity
 * Comprehensive validation including bidi attacks, zero-width abuse, and more
 *
 * @param text - Text to validate
 * @param options - Validation options
 * @returns Validation result with errors, warnings, and threats
 *
 * @example
 * ```typescript
 * const result = validateArabicText("مرحبا\u202Emalicious\u202C");
 * console.log(result.isValid); // false
 * console.log(result.threats.length); // 2 (RLO and PDF)
 * console.log(result.threats[0].type); // "bidi-override"
 * console.log(result.threats[0].severity); // "high"
 * ```
 */
export function validateArabicText(
  text: string,
  options: ValidationOptions = {},
): ValidationResult {
  const {
    minLength = 0,
    maxLength = Infinity,
    allowMixed = true,
    strict = false,
  } = options;

  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const threats: SecurityThreat[] = [];

  // Check 1: Empty or whitespace-only
  if (!text || !text.trim()) {
    errors.push({
      code: "EMPTY_TEXT",
      message: "Text is empty or contains only whitespace",
      severity: "error",
    });
  }

  // Check 2: Length constraints
  if (text.length < minLength) {
    errors.push({
      code: "TEXT_TOO_SHORT",
      message: `Text is too short (${text.length} < ${minLength})`,
      severity: "error",
    });
  }

  if (text.length > maxLength) {
    errors.push({
      code: "TEXT_TOO_LONG",
      message: `Text is too long (${text.length} > ${maxLength})`,
      severity: "error",
    });
  }

  // Check 3: Detect bidi override attacks (CRITICAL)
  const bidiThreats = detectBidiThreats(text);
  threats.push(...bidiThreats);
  if (bidiThreats.length > 0) {
    errors.push({
      code: "BIDI_OVERRIDE_DETECTED",
      message: `Found ${bidiThreats.length} bidi override character(s) - possible Trojan Source attack`,
      severity: "error",
    });
  }

  // Check 4: Detect zero-width abuse
  const zeroWidthThreats = detectZeroWidthThreats(text);
  threats.push(...zeroWidthThreats);
  if (zeroWidthThreats.length > 0) {
    const severity = strict ? "error" : "warning";
    const msg = `Found ${zeroWidthThreats.length} suspicious zero-width character(s)`;

    if (strict) {
      errors.push({ code: "ZERO_WIDTH_ABUSE", message: msg, severity });
    } else {
      warnings.push({ code: "ZERO_WIDTH_ABUSE", message: msg });
    }
  }

  // Check 5: Detect homograph attempts
  const homographThreats = detectHomographThreats(text);
  threats.push(...homographThreats);
  if (homographThreats.length > 0) {
    warnings.push({
      code: "HOMOGRAPH_DETECTED",
      message: `Found ${homographThreats.length} potential homograph attack(s)`,
    });
  }

  // Check 6: Suspicious control characters
  const controlThreats = detectControlCharThreats(text);
  threats.push(...controlThreats);
  if (controlThreats.length > 0) {
    warnings.push({
      code: "SUSPICIOUS_CONTROL_CHARS",
      message: `Found ${controlThreats.length} suspicious control character(s)`,
    });
  }

  // Check 7: Mixed content validation
  if (!allowMixed && isMixedContent(text)) {
    warnings.push({
      code: "MIXED_CONTENT",
      message: "Text contains mixed Arabic-Latin content",
    });
  }

  // Calculate confidence score (0-1)
  const confidence = calculateConfidence(errors, warnings, threats);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    threats,
    confidence,
  };
}

/**
 * Detect bidirectional override characters (Trojan Source attacks)
 * These enable text direction manipulation for spoofing
 *
 * @param text - Text to scan
 * @returns Array of bidi threat objects
 *
 * @example
 * ```typescript
 * const threats = detectBidiThreats("test\u202Emalicious\u202C");
 * console.log(threats.length); // 2 (RLO and PDF)
 * console.log(threats[0].type); // "bidi-override"
 * console.log(threats[0].severity); // "high"
 * ```
 */
export function detectBidiThreats(text: string): SecurityThreat[] {
  const threats: SecurityThreat[] = [];
  let position = 0;

  for (const char of text) {
    if (isBidiOverride(char)) {
      const severity = HIGH_SEVERITY_BIDI.includes(char as any)
        ? "high"
        : "medium";

      threats.push({
        type: "bidi-override",
        description: `Bidirectional override character detected: ${getCharName(char)}`,
        position,
        severity,
        detected: char,
      });
    }
    position++;
  }

  return threats;
}

/**
 * Detect zero-width character abuse
 * Multiple consecutive zero-width characters indicate potential attack
 *
 * @param text - Text to scan
 * @returns Array of zero-width threat objects
 *
 * @example
 * ```typescript
 * const threats = detectZeroWidthThreats("test\u200B\u200B\u200Btext");
 * console.log(threats.length); // 1
 * console.log(threats[0].severity); // "medium"
 * ```
 */
export function detectZeroWidthThreats(text: string): SecurityThreat[] {
  const threats: SecurityThreat[] = [];
  let consecutiveCount = 0;
  let startPosition = -1;
  let position = 0;

  for (const char of text) {
    const code = char.codePointAt(0);
    if (code === undefined) {
      position++;
      continue;
    }

    // Check if it's a zero-width character
    if (ALL_ZERO_WIDTH_REGEX.test(char)) {
      if (consecutiveCount === 0) {
        startPosition = position;
      }
      consecutiveCount++;

      // Check if it's an always-malicious zero-width char
      if (MALICIOUS_ZERO_WIDTH_REGEX.test(char)) {
        threats.push({
          type: "zero-width",
          description: `Malicious zero-width character detected: U+${code.toString(16).toUpperCase()}`,
          position,
          severity: "medium",
          detected: char,
        });
      }
    } else {
      // Check if we had excessive consecutive zero-width chars
      if (consecutiveCount > MAX_CONSECUTIVE_ZERO_WIDTH) {
        threats.push({
          type: "zero-width",
          description: `Excessive consecutive zero-width characters (${consecutiveCount})`,
          position: startPosition,
          severity: "high",
          detected: `${consecutiveCount} zero-width chars`,
        });
      }
      consecutiveCount = 0;
      startPosition = -1;
    }

    position++;
  }

  // Check at end of string
  if (consecutiveCount > MAX_CONSECUTIVE_ZERO_WIDTH) {
    threats.push({
      type: "zero-width",
      description: `Excessive consecutive zero-width characters at end (${consecutiveCount})`,
      position: startPosition,
      severity: "high",
      detected: `${consecutiveCount} zero-width chars`,
    });
  }

  return threats;
}

/**
 * Detect homograph attacks (lookalike characters from different scripts)
 * Scans for Cyrillic characters that look like Latin
 *
 * @param text - Text to scan
 * @returns Array of homograph threat objects
 *
 * @example
 * ```typescript
 * const threats = detectHomographThreats("раypal.com"); // Cyrillic 'а' and 'у'
 * console.log(threats.length); // 2
 * ```
 */
export function detectHomographThreats(text: string): SecurityThreat[] {
  const threats: SecurityThreat[] = [];

  // Check for mixed Cyrillic-Latin (potential homograph)
  if (ATTACK_PATTERNS.MIXED_CYRILLIC_LATIN.test(text)) {
    let position = 0;
    for (const char of text) {
      if (CYRILLIC_LOOKALIKE_REGEX.test(char)) {
        threats.push({
          type: "homograph",
          description: `Cyrillic lookalike character detected: '${char}'`,
          position,
          severity: "low",
          detected: char,
        });
      }
      position++;
    }
  }

  return threats;
}

/**
 * Detect suspicious control characters
 * Control characters in user text are usually malicious
 *
 * @param text - Text to scan
 * @returns Array of control character threat objects
 */
export function detectControlCharThreats(text: string): SecurityThreat[] {
  const threats: SecurityThreat[] = [];
  let position = 0;

  for (const char of text) {
    if (SUSPICIOUS_CONTROL_REGEX.test(char)) {
      const code = char.codePointAt(0);
      threats.push({
        type: "control-char" as any,
        description: `Suspicious control character: U+${code?.toString(16).toUpperCase() ?? "0000"}`,
        position,
        severity: "low",
        detected: char,
      });
    }
    position++;
  }

  return threats;
}

/**
 * Quick validation for form inputs
 * Returns boolean for fast checks without detailed threat analysis
 *
 * @param text - Text to validate
 * @param options - Validation options
 * @returns True if text is valid
 *
 * @example
 * ```typescript
 * isValidArabicInput("مرحبا"); // true
 * isValidArabicInput("test\u202Emalicious"); // false
 * isValidArabicInput(""); // false
 * ```
 */
export function isValidArabicInput(
  text: string,
  options: ValidationOptions = {},
): boolean {
  // Quick checks first
  if (!text || !text.trim()) return false;

  const { minLength = 0, maxLength = Infinity } = options;

  if (text.length < minLength || text.length > maxLength) return false;

  // Check for bidi override (CRITICAL - always fail)
  if (BIDI_OVERRIDE_REGEX.test(text)) return false;

  // Check for malicious zero-width (high risk)
  if (MALICIOUS_ZERO_WIDTH_REGEX.test(text)) return false;

  return true;
}

/**
 * Validate and sanitize in one step
 * Returns sanitized text if valid, null if invalid
 *
 * @param text - Text to validate and sanitize
 * @param options - Validation options
 * @returns Sanitized text or null if invalid
 *
 * @example
 * ```typescript
 * validateAndSanitize("مرحبا\u202E"); // "مرحبا" (sanitized)
 * validateAndSanitize(""); // null (invalid)
 * ```
 */
export function validateAndSanitize(
  text: string,
  options: ValidationOptions = {},
): string | null {
  const validation = validateArabicText(text, options);

  if (!validation.isValid) {
    return null;
  }

  // Sanitize by removing all detected threats
  let sanitized = text;

  // Remove bidi overrides
  sanitized = sanitized.replace(BIDI_OVERRIDE_REGEX, "");

  // Remove malicious zero-width
  sanitized = sanitized.replace(MALICIOUS_ZERO_WIDTH_REGEX, "");

  // Remove suspicious control characters
  sanitized = sanitized.replace(SUSPICIOUS_CONTROL_REGEX, "");

  return sanitized;
}

/**
 * Calculate confidence score based on validation results
 */
function calculateConfidence(
  errors: ValidationError[],
  warnings: ValidationWarning[],
  threats: SecurityThreat[],
): number {
  // Errors = 0% confidence
  if (errors.length > 0) return 0;

  // Start at 100%
  let confidence = 1.0;

  // Each warning reduces confidence by 10%
  confidence -= warnings.length * 0.1;

  // High severity threats reduce by 30% each
  const highThreats = threats.filter((t) => t.severity === "high").length;
  confidence -= highThreats * 0.3;

  // Medium severity threats reduce by 15% each
  const mediumThreats = threats.filter((t) => t.severity === "medium").length;
  confidence -= mediumThreats * 0.15;

  // Low severity threats reduce by 5% each
  const lowThreats = threats.filter((t) => t.severity === "low").length;
  confidence -= lowThreats * 0.05;

  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, confidence));
}

/**
 * Get human-readable name for a bidi override character
 */
function getCharName(char: string): string {
  const code = char.codePointAt(0);
  if (code === undefined) return "Unknown";

  const names: Record<number, string> = {
    0x202a: "LRE (Left-to-Right Embedding)",
    0x202b: "RLE (Right-to-Left Embedding)",
    0x202c: "PDF (Pop Directional Formatting)",
    0x202d: "LRO (Left-to-Right Override)",
    0x202e: "RLO (Right-to-Left Override)",
    0x2066: "LRI (Left-to-Right Isolate)",
    0x2067: "RLI (Right-to-Left Isolate)",
    0x2068: "FSI (First Strong Isolate)",
    0x2069: "PDI (Pop Directional Isolate)",
  };

  return names[code] ?? `U+${code.toString(16).toUpperCase()}`;
}

/**
 * Batch validate multiple texts
 * Useful for validating arrays of user input
 *
 * @param texts - Array of texts to validate
 * @param options - Validation options
 * @returns Array of validation results
 *
 * @example
 * ```typescript
 * const results = batchValidate(["مرحبا", "test\u202E", "أحمد"]);
 * console.log(results[0].isValid); // true
 * console.log(results[1].isValid); // false
 * console.log(results[2].isValid); // true
 * ```
 */
export function batchValidate(
  texts: string[],
  options: ValidationOptions = {},
): ValidationResult[] {
  return texts.map((text) => validateArabicText(text, options));
}

/**
 * Get validation summary statistics
 * Useful for monitoring and reporting
 *
 * @param results - Array of validation results
 * @returns Summary statistics object
 */
export function getValidationSummary(results: ValidationResult[]): {
  total: number;
  valid: number;
  invalid: number;
  validPercentage: number;
  totalThreats: number;
  threatsByType: Record<string, number>;
  averageConfidence: number;
} {
  const total = results.length;
  const valid = results.filter((r) => r.isValid).length;
  const invalid = total - valid;
  const validPercentage = total > 0 ? (valid / total) * 100 : 0;

  const allThreats = results.flatMap((r) => r.threats);
  const totalThreats = allThreats.length;

  const threatsByType: Record<string, number> = {};
  for (const threat of allThreats) {
    threatsByType[threat.type] = (threatsByType[threat.type] || 0) + 1;
  }

  const averageConfidence =
    total > 0 ? results.reduce((sum, r) => sum + r.confidence, 0) / total : 0;

  return {
    total,
    valid,
    invalid,
    validPercentage,
    totalThreats,
    threatsByType,
    averageConfidence,
  };
}
