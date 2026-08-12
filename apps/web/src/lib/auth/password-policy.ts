import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 72;

const commonPasswords = new Set([
  "12345678",
  "123456789",
  "1234567890",
  "admin123",
  "changeme",
  "letmein",
  "password",
  "password1",
  "password123",
  "qwerty123",
  "tuppra123",
  "welcome123",
]);

function normalizedPassword(value: string): string {
  return value.toLocaleLowerCase("en-US").replace(/[^a-z0-9]/gu, "");
}

function isLowEntropyPassword(value: string): boolean {
  const normalized = value.toLocaleLowerCase("en-US");
  const characters = Array.from(normalized);
  const counts = new Map<string, number>();

  for (const character of characters) {
    counts.set(character, (counts.get(character) ?? 0) + 1);
  }

  const dominantCharacterCount = Math.max(...counts.values());
  const dominantCharacterRatio = dominantCharacterCount / characters.length;

  return (
    counts.size <= 3 ||
    dominantCharacterRatio >= 0.6 ||
    /(.)\1{3,}/u.test(normalized) ||
    /^(.{1,4})\1{2,}/u.test(normalized)
  );
}

function isCommonPassword(value: string): boolean {
  const normalized = normalizedPassword(value);
  return (
    commonPasswords.has(value.toLocaleLowerCase("en-US")) ||
    commonPasswords.has(normalized) ||
    /^(?:1234567890|0987654321|abcdefghijklmnopqrstuvwxyz)/u.test(normalized)
  );
}

export const strongPasswordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH)
  .max(PASSWORD_MAX_LENGTH)
  .regex(/[a-z]/u)
  .regex(/[A-Z]/u)
  .regex(/[0-9]/u)
  .regex(/[^A-Za-z0-9]/u)
  .superRefine((password, context) => {
    if (isCommonPassword(password) || isLowEntropyPassword(password)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is too common or predictable.",
      });
    }
  });

export const passwordInputPattern =
  "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{12,72}";
