"use client";

/**
 * Iraqi National ID Input Component
 * Features:
 * - 12-digit Iraqi ID format validation
 * - Regional prefix validation (Baghdad: 10, Basra: 06, Mosul: 02, Erbil: 05)
 * - Real-time validation and formatting
 * - RTL support for Arabic labels
 * - Visual feedback for validation status
 * - Birth year extraction display
 */

import { useState, useEffect, useRef, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Iraqi regional prefix mapping
const REGIONAL_PREFIXES = {
  baghdad: "10",
  basra: "06",
  mosul: "02",
  erbil: "05",
} as const;

interface IraqiIDInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  region?: "baghdad" | "basra" | "mosul" | "erbil" | "other";
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
 */
function validateIraqiID(
  iraqiId: string,
  expectedRegion?: "baghdad" | "basra" | "mosul" | "erbil" | "other",
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

      if (actualPrefix !== expectedPrefix) {
        return {
          isValid: false,
          message: `ID should start with ${expectedPrefix} for ${expectedRegion}`,
          birthYear,
        };
      }
    }
  }

  // Step 4: Checksum validation (STRICT only)
  // Note: Simplified checksum - replace with actual Iraqi ID checksum algorithm if available
  if (verificationLevel === "strict") {
    const checksum = calculateChecksum(iraqiId);
    const lastDigit = parseInt(iraqiId.charAt(11), 10);

    if (checksum !== lastDigit) {
      return {
        isValid: false,
        message: "Invalid ID checksum",
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
 * Calculate checksum for Iraqi ID (simplified)
 * Note: This is a placeholder - replace with actual Iraqi ID checksum algorithm
 */
function calculateChecksum(iraqiId: string): number {
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    sum += parseInt(iraqiId.charAt(i), 10) * (12 - i);
  }
  return sum % 10;
}
