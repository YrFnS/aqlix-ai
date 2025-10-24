"use client";

/**
 * Professional License Input Component for Iraqi Professionals
 * Features:
 * - Domain-specific license format validation
 * - Legal, Medical, Educational, Engineering, Organizational domains
 * - Real-time validation with visual feedback
 * - RTL support for Arabic labels
 * - Domain-specific format hints
 */

import { useState, useEffect, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ProfessionalDomain =
  | "legal"
  | "medical"
  | "educational"
  | "engineering"
  | "organizational";

// Domain-specific license format patterns
const LICENSE_PATTERNS: Record<ProfessionalDomain, RegExp> = {
  legal: /^LAW-\d{5}-\d{4}$/, // LAW-12345-2024
  medical: /^MED-\d{6}-[A-Z]{2}$/, // MED-123456-BG (BG=Baghdad)
  educational: /^EDU-\d{5}-\d{4}$/, // EDU-12345-2024
  engineering: /^ENG-\d{6}-[A-Z]{3}$/, // ENG-123456-CIV (Civil Engineering)
  organizational: /^ORG-\d{5}-\d{4}$/, // ORG-12345-2024
};

// Domain display names
const DOMAIN_NAMES: Record<ProfessionalDomain, { ar: string; en: string }> = {
  legal: { ar: "قانوني", en: "Legal" },
  medical: { ar: "طبي", en: "Medical" },
  educational: { ar: "تعليمي", en: "Educational" },
  engineering: { ar: "هندسي", en: "Engineering" },
  organizational: { ar: "تنظيمي", en: "Organizational" },
};

// Domain-specific format examples
const LICENSE_EXAMPLES: Record<ProfessionalDomain, string> = {
  legal: "LAW-12345-2024",
  medical: "MED-123456-BG",
  educational: "EDU-12345-2024",
  engineering: "ENG-123456-CIV",
  organizational: "ORG-12345-2024",
};

interface ProfessionalLicenseInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  domain: ProfessionalDomain;
  culturalMode?: "ar-IQ" | "en-US" | "both";
  onChange?: (value: string, isValid: boolean) => void;
  error?: string;
}

export const ProfessionalLicenseInput = forwardRef<
  HTMLInputElement,
  ProfessionalLicenseInputProps
>(
  (
    {
      label,
      domain,
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
    const [isValid, setIsValid] = useState(false);

    // Validate license number
    useEffect(() => {
      if (!value || value.length === 0) {
        setIsValid(false);
        return;
      }

      const pattern = LICENSE_PATTERNS[domain];
      const valid = pattern.test(value);
      setIsValid(valid);

      if (onChange) {
        onChange(value, valid);
      }
    }, [value, domain, onChange]);

    // Update internal state when controlled value changes
    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue.toString());
      }
    }, [controlledValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Convert to uppercase for consistency
      const newValue = e.target.value.toUpperCase();
      setValue(newValue);
    };

    const getLabelText = () => {
      if (label) return label;

      const domainName = DOMAIN_NAMES[domain];
      return culturalMode === "en-US"
        ? `${domainName.en} Professional License`
        : culturalMode === "ar-IQ"
          ? `رخصة مهنية ${domainName.ar}`
          : `رخصة مهنية ${domainName.ar} / ${domainName.en} License`;
    };

    const getPlaceholderText = () => {
      return LICENSE_EXAMPLES[domain];
    };

    const getHelperText = () => {
      const example = LICENSE_EXAMPLES[domain];

      switch (culturalMode) {
        case "en-US":
          return `Format: ${example}`;
        case "ar-IQ":
          return `النموذج: ${example}`;
        default:
          return `النموذج / Format: ${example}`;
      }
    };

    const showValidationIcon = value.length > 0;

    return (
      <div className="space-y-2">
        {/* Label */}
        <Label
          htmlFor={props.id || "professional-license"}
          className={cn("font-arabic", error && "text-destructive")}
        >
          {getLabelText()}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>

        {/* Input with validation icon */}
        <div className="relative">
          <Input
            {...props}
            ref={ref}
            id={props.id || "professional-license"}
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={getPlaceholderText()}
            dir="ltr" // License numbers are always LTR
            className={cn(
              "pr-10 font-mono",
              className,
              error && "border-destructive focus-visible:ring-destructive",
              isValid && "border-green-500 focus-visible:ring-green-500",
            )}
            aria-invalid={!!error || (value.length > 0 && !isValid)}
            aria-describedby={
              error
                ? `${props.id || "professional-license"}-error`
                : `${props.id || "professional-license"}-helper`
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
                  aria-label="Valid License"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Invalid License"
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

        {/* Error Message */}
        {error && (
          <p
            className="font-arabic text-sm font-medium text-destructive"
            id={`${props.id || "professional-license"}-error`}
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {!error && (
          <p
            className="text-muted-foreground font-arabic text-sm"
            id={`${props.id || "professional-license"}-helper`}
          >
            {getHelperText()}
          </p>
        )}

        {/* Domain-Specific Instructions */}
        {!error && !isValid && value.length > 0 && (
          <div
            className="text-muted-foreground font-arabic rounded-md border border-dashed p-3 text-sm"
            role="alert"
          >
            {culturalMode === "en-US" ? (
              <DomainInstructions domain={domain} lang="en" />
            ) : culturalMode === "ar-IQ" ? (
              <DomainInstructions domain={domain} lang="ar" />
            ) : (
              <>
                <DomainInstructions domain={domain} lang="ar" />
                <div className="mt-1 opacity-70">
                  <DomainInstructions domain={domain} lang="en" />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  },
);

ProfessionalLicenseInput.displayName = "ProfessionalLicenseInput";

/**
 * Domain-specific format instructions
 */
function DomainInstructions({
  domain,
  lang,
}: {
  domain: ProfessionalDomain;
  lang: "ar" | "en";
}) {
  const instructions: Record<ProfessionalDomain, { ar: string; en: string }> = {
    legal: {
      ar: "النموذج: LAW-رقم الترخيص (5 أرقام)-السنة (4 أرقام)",
      en: "Format: LAW-License Number (5 digits)-Year (4 digits)",
    },
    medical: {
      ar: "النموذج: MED-رقم الترخيص (6 أرقام)-رمز المنطقة (حرفين)",
      en: "Format: MED-License Number (6 digits)-Region Code (2 letters)",
    },
    educational: {
      ar: "النموذج: EDU-رقم الترخيص (5 أرقام)-السنة (4 أرقام)",
      en: "Format: EDU-License Number (5 digits)-Year (4 digits)",
    },
    engineering: {
      ar: "النموذج: ENG-رقم الترخيص (6 أرقام)-نوع الهندسة (3 أحرف)",
      en: "Format: ENG-License Number (6 digits)-Engineering Type (3 letters)",
    },
    organizational: {
      ar: "النموذج: ORG-رقم الترخيص (5 أرقام)-السنة (4 أرقام)",
      en: "Format: ORG-License Number (5 digits)-Year (4 digits)",
    },
  };

  return <span>{instructions[domain][lang]}</span>;
}
