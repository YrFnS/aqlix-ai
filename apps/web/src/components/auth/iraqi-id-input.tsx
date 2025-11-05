"use client";

/**
 * Iraqi National ID Input Component
 * Features:
 * - 12-digit Iraqi ID format validation
 * - Regional prefix validation for all 19 Iraqi governorates:
 *   Anbar (01), Mosul/Nineveh (02), Duhok (03), Sulaymaniyah (04),
 *   Erbil (05), Basra (06), Karbala (07), Najaf (08), Diyala (09),
 *   Baghdad (10), Wasit (12), Salah al-Din (13), Babil (14),
 *   Dhi Qar (15), Maysan (16), Muthanna (17), Qadisiyyah (18),
 *   Kirkuk (19), Halabja (20)
 * - Real-time validation and formatting
 * - RTL support for Arabic labels
 * - Visual feedback for validation status
 * - Birth year extraction display
 */

import { useState, useEffect, useRef, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Iraqi regional prefix mapping (all 19 governorates)
// Based on Iraqi Civil Affairs numbering system
// Some regions have multiple accepted prefixes (stored as arrays)
type PrefixMap = Record<string, string | string[]>;
const REGIONAL_PREFIXES: PrefixMap = {
  anbar: "08",
  mosul: "02", // Nineveh governorate
  erbil: "04",
  basra: "06",
  karbala: "13",
  najaf: "12",
  diyala: "07",
  baghdad: ["10", "11"], // Baghdad accepts both prefixes
  wasit: "14",
  salahaldin: "15", // Salah al-Din
  babil: "17",
  dhiqar: "18", // Dhi Qar
  maysan: "19",
  muthanna: "20",
  qadisiyyah: "16",
  kirkuk: "09",
  halabja: "21",
  // Kurdistan Region
  sulaymaniyah: "03",
  duhok: "05",
};

interface IraqiIDInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  region?:
    | "anbar"
    | "mosul"
    | "duhok"
    | "sulaymaniyah"
    | "erbil"
    | "basra"
    | "karbala"
    | "najaf"
    | "diyala"
    | "baghdad"
    | "wasit"
    | "salahaldin"
    | "babil"
    | "dhiqar"
    | "maysan"
    | "muthanna"
    | "qadisiyyah"
    | "kirkuk"
    | "halabja"
    | "other";
  verificationLevel?: "basic" | "standard" | "strict";
  showBirthYear?: boolean;
  culturalMode?: "ar-IQ" | "en-US" | "both";
  onChange?: (value: string, isValid: boolean) => void;
  error?: string;
}

export const IraqiIDInput = forwardRef<HTMLInputElement, IraqiIDInputProps>(
  (
    {
      label,
      region,
      verificationLevel = "standard",
      showBirthYear = true,
      culturalMode = "both",
      onChange,
      error,
      className,
      value: controlledValue,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState(controlledValue?.toString() || "");
    const [validationState, setValidationState] = useState<{
      isValid: boolean;
      message?: string;
      birthYear?: number;
    }>({ isValid: false });

    // Store onChange callback in ref to avoid re-render loops
    const onChangeRef = useRef(onChange);
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    // Validate Iraqi ID
    useEffect(() => {
      if (!value || value.length === 0) {
        setValidationState({ isValid: false });
        return;
      }

      const validation = validateIraqiID(value, region, verificationLevel);
      setValidationState(validation);

      if (onChangeRef.current) {
        onChangeRef.current(value, validation.isValid);
      }
    }, [value, region, verificationLevel]);

    // Update internal state when controlled value changes
    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue.toString());
      }
    }, [controlledValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow digits
      const newValue = e.target.value.replace(/\D/g, "");

      // Limit to 12 digits
      if (newValue.length <= 12) {
        setValue(newValue);
      }
    };

    const getLabelText = () => {
      if (!label) {
        return culturalMode === "en-US"
          ? "Iraqi National ID"
          : culturalMode === "ar-IQ"
            ? "رقم الهوية العراقية"
            : "رقم الهوية العراقية / Iraqi National ID";
      }
      return label;
    };

    const getPlaceholderText = () => {
      if (region && region !== "other") {
        const prefix = REGIONAL_PREFIXES[region];
        return `${prefix}XXXXXXXXXX (12 digits)`;
      }
      return "XXXXXXXXXXXX (12 digits)";
    };

    const showValidationIcon = value.length > 0;
    const isValid = validationState.isValid;
    const isPartiallyValid = value.length >= 6 && value.length < 12;

    return (
      <div
        className="space-y-2"
        lang={
          culturalMode === "en-US"
            ? "en-US"
            : culturalMode === "ar-IQ"
              ? "ar-IQ"
              : undefined
        }
      >
        {/* Label */}
        <Label
          htmlFor={props.id || "iraqi-id"}
          className={cn("font-arabic", error && "text-destructive")}
          lang={
            culturalMode === "ar-IQ" || culturalMode === "both"
              ? "ar-IQ"
              : "en-US"
          }
        >
          {getLabelText()}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>

        {/* Input with validation icon */}
        <div className="relative">
          <Input
            {...props}
            ref={ref}
            id={props.id || "iraqi-id"}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={handleChange}
            placeholder={getPlaceholderText()}
            dir="ltr" // ID numbers are always LTR
            className={cn(
              "pr-10",
              className,
              error && "border-destructive focus-visible:ring-destructive",
              isValid && "border-green-500 focus-visible:ring-green-500",
            )}
            aria-invalid={!!error || (value.length > 0 && !isValid)}
            aria-describedby={
              error
                ? `${props.id || "iraqi-id"}-error`
                : validationState.message
                  ? `${props.id || "iraqi-id"}-validation`
                  : undefined
            }
          />

          {/* Validation Icon */}
          {showValidationIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isValid ? (
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Valid ID"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : isPartiallyValid ? (
                <svg
                  className="text-muted-foreground h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Incomplete ID"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Invalid ID"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Birth Year Display */}
        {showBirthYear && validationState.birthYear && (
          <p
            className="text-muted-foreground font-arabic text-sm bidi-isolate"
            id={`${props.id || "iraqi-id"}-birth-year`}
            lang={
              culturalMode === "en-US"
                ? "en-US"
                : culturalMode === "ar-IQ"
                  ? "ar-IQ"
                  : undefined
            }
          >
            {culturalMode === "en-US"
              ? `Birth year: ${validationState.birthYear}`
              : culturalMode === "ar-IQ"
                ? `سنة الميلاد: ${validationState.birthYear}`
                : `سنة الميلاد / Birth year: ${validationState.birthYear}`}
          </p>
        )}

        {/* Validation Message */}
        {validationState.message && !error && (
          <p
            className="text-muted-foreground font-arabic text-sm bidi-isolate"
            id={`${props.id || "iraqi-id"}-validation`}
            lang={
              culturalMode === "en-US"
                ? "en-US"
                : culturalMode === "ar-IQ"
                  ? "ar-IQ"
                  : undefined
            }
          >
            {validationState.message}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            className="font-arabic text-sm font-medium text-destructive bidi-isolate"
            id={`${props.id || "iraqi-id"}-error`}
            lang={
              culturalMode === "en-US"
                ? "en-US"
                : culturalMode === "ar-IQ"
                  ? "ar-IQ"
                  : undefined
            }
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {!error && !validationState.message && (
          <p
            className="text-muted-foreground font-arabic text-sm"
            lang={
              culturalMode === "en-US"
                ? "en-US"
                : culturalMode === "ar-IQ"
                  ? "ar-IQ"
                  : undefined
            }
          >
            {culturalMode === "en-US"
              ? "Enter your 12-digit Iraqi national ID number"
              : culturalMode === "ar-IQ"
                ? "أدخل رقم الهوية العراقية المكون من 12 رقماً"
                : "أدخل رقم الهوية العراقية المكون من 12 رقماً"}
          </p>
        )}
      </div>
    );
  },
);

IraqiIDInput.displayName = "IraqiIDInput";

/**
 * Validate Iraqi National ID
 * Implements validation logic from apps/api/services/iraqi_id_validator.py
 * Supports all 19 Iraqi governorates
 */
function validateIraqiID(
  iraqiId: string,
  expectedRegion?:
    | "anbar"
    | "mosul"
    | "duhok"
    | "sulaymaniyah"
    | "erbil"
    | "basra"
    | "karbala"
    | "najaf"
    | "diyala"
    | "baghdad"
    | "wasit"
    | "salahaldin"
    | "babil"
    | "dhiqar"
    | "maysan"
    | "muthanna"
    | "qadisiyyah"
    | "kirkuk"
    | "halabja"
    | "other",
  verificationLevel: "basic" | "standard" | "strict" = "standard",
): {
  isValid: boolean;
  message?: string;
  birthYear?: number;
} {
  // Step 1: Basic format validation (12 digits)
  if (!/^\d{12}$/.test(iraqiId)) {
    if (iraqiId.length < 12 && iraqiId.length > 0) {
      return {
        isValid: false,
        message: `${12 - iraqiId.length} more digits needed`,
      };
    }
    return { isValid: false };
  }

  // Step 2: Extract birth year (digits 3-6 represent year)
  const birthYearStr = iraqiId.substring(2, 6);
  const birthYear = parseInt(birthYearStr, 10);

  // Validate birth year range (1900-2024)
  const currentYear = new Date().getFullYear();
  if (birthYear < 1900 || birthYear > currentYear) {
    return {
      isValid: false,
      message: "Invalid birth year in ID",
      birthYear,
    };
  }

  // Step 3: Regional prefix validation (STANDARD and STRICT only)
  if (verificationLevel === "standard" || verificationLevel === "strict") {
    if (expectedRegion && expectedRegion !== "other") {
      const expectedPrefix = REGIONAL_PREFIXES[expectedRegion];
      const actualPrefix = iraqiId.substring(0, 2);

      // Handle both string and array prefixes
      const prefixMatches = Array.isArray(expectedPrefix)
        ? expectedPrefix.includes(actualPrefix)
        : actualPrefix === expectedPrefix;

      if (!prefixMatches) {
        // Format error message to show all allowed prefixes
        const allowedPrefixes = Array.isArray(expectedPrefix)
          ? expectedPrefix.join(" or ")
          : expectedPrefix;
        return {
          isValid: false,
          message: `ID should start with ${allowedPrefixes} for ${expectedRegion}`,
          birthYear,
        };
      }
    }
  }

  // Step 4: Checksum validation (STRICT only)
  // Uses ICAO 9303 MRZ algorithm (same as backend)
  if (verificationLevel === "strict") {
    const checksum = calculateChecksum(iraqiId);
    const lastDigit = parseInt(iraqiId.charAt(11), 10);

    if (checksum !== lastDigit) {
      return {
        isValid: false,
        message: `Invalid ID checksum (expected ${checksum}, got ${lastDigit})`,
        birthYear,
      };
    }
  }

  // All validations passed
  return {
    isValid: true,
    message: "Valid Iraqi ID",
    birthYear,
  };
}

/**
 * Calculate checksum for Iraqi ID using ICAO 9303 MRZ algorithm
 *
 * ICAO 9303 Machine Readable Zone (MRZ) standard:
 * - Weight sequence: [7, 3, 1] repeating
 * - Sum all (digit * weight)
 * - Checksum = sum % 10
 *
 * Reference: ICAO Doc 9303 - Machine Readable Travel Documents
 * Matches backend implementation in apps/api/services/iraqi_id_validator.py
 *
 * @param iraqiId - Valid 12-digit Iraqi ID
 * @returns Calculated checksum digit (0-9)
 */
function calculateChecksum(iraqiId: string): number {
  if (iraqiId.length < 11) {
    return -1;
  }

  // Use first 11 digits for checksum calculation
  const digits = iraqiId.slice(0, 11).split("").map(Number);

  // ICAO 9303 MRZ algorithm: weights = [7, 3, 1] repeating
  const weights = [7, 3, 1];
  const weightedSum = digits.reduce(
    (sum, digit, index) => sum + digit * weights[index % 3],
    0,
  );

  // Checksum is the remainder when divided by 10
  return weightedSum % 10;
}
