"use client";

/**
 * MFA Verification Form Component
 * Features:
 * - Multi-factor authentication code verification
 * - Support for SMS, Email, and Cultural Questions
 * - Prayer time awareness and cultural timing
 * - 6-digit code input with validation
 * - Device trust/remember functionality
 * - RTL support for Arabic text
 */

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormError } from "@/components/ui/form-error";
import { verifyMFAAction, type MFAVerificationData } from "@/lib/auth/actions";

// Validation schema for MFA verification
const mfaSchema = z.object({
  code: z
    .string()
    .length(
      6,
      "رمز التحقق يجب أن يكون 6 أرقام / Verification code must be 6 digits",
    )
    .regex(
      /^\d{6}$/,
      "رمز التحقق يجب أن يحتوي على أرقام فقط / Code must contain only digits",
    ),
  rememberDevice: z.boolean().default(false),
});

type MFAFormValues = z.infer<typeof mfaSchema>;

interface MFAFormProps {
  verificationId: string;
  method: "sms" | "email" | "cultural_questions";
  destination?: string; // Phone number or email
  culturalMode?: "ar-IQ" | "en-US" | "both";
  redirectTo?: string;
  onSuccess?: (userId: string) => void;
  onCancel?: () => void;
}

export function MFAForm({
  verificationId,
  method,
  destination,
  culturalMode = "both",
  redirectTo = "/dashboard",
  onSuccess,
  onCancel,
}: MFAFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | undefined>();
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [prayerTimeDelay, setPrayerTimeDelay] = useState<string | undefined>();

  const form = useForm<MFAFormValues>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      code: "",
      rememberDevice: false,
    },
  });

  // Countdown timer for code expiry
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Check for prayer time delays using Aladhan API
  useEffect(() => {
    const checkPrayerTime = async () => {
      // Check prayer time using Aladhan API with 15-minute flexibility
      const { getCurrentPrayerTime } = await import(
        "@/lib/services/prayer-time-service"
      );

      try {
        const activePrayerName = await getCurrentPrayerTime(15); // 15 minutes flexibility

        if (activePrayerName) {
          setPrayerTimeDelay(
            culturalMode === "en-US"
              ? `During ${activePrayerName} prayer time`
              : culturalMode === "ar-IQ"
                ? `أثناء صلاة ${activePrayerName}`
                : `أثناء صلاة ${activePrayerName} / During ${activePrayerName} prayer`,
          );
        } else {
          setPrayerTimeDelay(undefined);
        }
      } catch (error) {
        console.error("Failed to check prayer time:", error);
        // Graceful fallback - don't show prayer time delay if API fails
        setPrayerTimeDelay(undefined);
      }
    };

    checkPrayerTime();
    const interval = setInterval(checkPrayerTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [culturalMode]);

  const onSubmit = async (values: MFAFormValues) => {
    setFormError(undefined);

    const mfaData: MFAVerificationData = {
      verificationId,
      code: values.code,
      rememberDevice: values.rememberDevice,
    };

    startTransition(async () => {
      try {
        const result = await verifyMFAAction(mfaData);

        if (result.success) {
          // MFA verification successful
          if (onSuccess && result.data?.userId) {
            onSuccess(result.data.userId);
          }
          router.push(redirectTo);
        } else {
          setFormError(
            result.error ||
              "فشل التحقق / Verification failed. Please try again.",
          );
        }
      } catch (error) {
        setFormError(
          "حدث خطأ في النظام / System error occurred. Please try again later.",
        );
      }
    });
  };

  const getMethodDisplayText = () => {
    const texts = {
      sms: {
        ar: "رسالة نصية",
        en: "SMS",
        both: "رسالة نصية / SMS",
      },
      email: {
        ar: "البريد الإلكتروني",
        en: "Email",
        both: "البريد الإلكتروني / Email",
      },
      cultural_questions: {
        ar: "أسئلة ثقافية",
        en: "Cultural Questions",
        both: "أسئلة ثقافية / Cultural Questions",
      },
    };

    return texts[method][
      culturalMode === "en-US" ? "en" : culturalMode === "ar-IQ" ? "ar" : "both"
    ];
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isExpired = timeRemaining <= 0;

  return (
    <div
      className="w-full max-w-md space-y-6"
      dir={culturalMode === "ar-IQ" ? "rtl" : "ltr"}
      lang={
        culturalMode === "en-US"
          ? "en-US"
          : culturalMode === "ar-IQ"
            ? "ar-IQ"
            : undefined
      }
    >
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1
          className="font-arabic text-2xl font-bold tracking-tight"
          lang={
            culturalMode === "en-US"
              ? "en-US"
              : culturalMode === "ar-IQ"
                ? "ar-IQ"
                : undefined
          }
        >
          {culturalMode === "en-US"
            ? "Verification Required"
            : culturalMode === "ar-IQ"
              ? "التحقق مطلوب"
              : "التحقق مطلوب / Verification Required"}
        </h1>
        <p
          className="text-muted-foreground font-arabic text-sm bidi-isolate"
          lang={
            culturalMode === "en-US"
              ? "en-US"
              : culturalMode === "ar-IQ"
                ? "ar-IQ"
                : undefined
          }
        >
          {culturalMode === "en-US"
            ? `Enter the verification code sent to your ${getMethodDisplayText()}`
            : culturalMode === "ar-IQ"
              ? `أدخل رمز التحقق المرسل إلى ${getMethodDisplayText()}`
              : `أدخل رمز التحقق المرسل إلى ${getMethodDisplayText()}`}
        </p>
        {destination && (
          <p
            className="font-arabic text-sm font-medium bidi-isolate"
            dir="ltr"
            lang="en-US"
          >
            {destination}
          </p>
        )}
      </div>

      {/* Prayer Time Notice */}
      {prayerTimeDelay && (
        <div
          className="bg-secondary text-secondary-foreground rounded-md border p-4"
          lang={
            culturalMode === "en-US"
              ? "en-US"
              : culturalMode === "ar-IQ"
                ? "ar-IQ"
                : undefined
          }
        >
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-arabic text-sm">{prayerTimeDelay}</p>
          </div>
        </div>
      )}

      {/* MFA Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Verification Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-arabic">
                  {culturalMode === "en-US"
                    ? "Verification Code"
                    : culturalMode === "ar-IQ"
                      ? "رمز التحقق"
                      : "رمز التحقق / Verification Code"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="000000"
                    maxLength={6}
                    disabled={isPending || isExpired}
                    autoComplete="one-time-code"
                    dir="ltr" // Code is always LTR
                    className="font-mono text-center text-2xl tracking-widest"
                    autoFocus
                  />
                </FormControl>
                <FormDescription className="font-arabic text-center text-xs">
                  {!isExpired ? (
                    <>
                      {culturalMode === "en-US"
                        ? `Code expires in `
                        : culturalMode === "ar-IQ"
                          ? "ينتهي الرمز في "
                          : "ينتهي الرمز في "}
                      <span className="font-mono font-bold" dir="ltr">
                        {formatTime(timeRemaining)}
                      </span>
                    </>
                  ) : (
                    <span className="text-destructive">
                      {culturalMode === "en-US"
                        ? "Code expired"
                        : culturalMode === "ar-IQ"
                          ? "انتهت صلاحية الرمز"
                          : "انتهت صلاحية الرمز / Code expired"}
                    </span>
                  )}
                </FormDescription>
                <FormMessage className="font-arabic" />
              </FormItem>
            )}
          />

          {/* Remember Device */}
          <FormField
            control={form.control}
            name="rememberDevice"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending || isExpired}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-arabic cursor-pointer">
                    {culturalMode === "en-US"
                      ? "Trust this device for 30 days"
                      : culturalMode === "ar-IQ"
                        ? "الوثوق بهذا الجهاز لمدة 30 يوماً"
                        : "الوثوق بهذا الجهاز لمدة 30 يوماً / Trust device"}
                  </FormLabel>
                  <FormDescription className="font-arabic text-xs">
                    {culturalMode === "en-US"
                      ? "You won't need to verify on this device for 30 days"
                      : culturalMode === "ar-IQ"
                        ? "لن تحتاج إلى التحقق على هذا الجهاز لمدة 30 يوماً"
                        : "لن تحتاج إلى التحقق على هذا الجهاز لمدة 30 يوماً"}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Form-level Error */}
          {formError && <FormError message={formError} />}

          {/* Submit Button */}
          <Button
            type="submit"
            className="font-arabic w-full"
            disabled={isPending || isExpired || prayerTimeDelay !== undefined}
          >
            {isPending
              ? culturalMode === "en-US"
                ? "Verifying..."
                : culturalMode === "ar-IQ"
                  ? "جاري التحقق..."
                  : "جاري التحقق... / Verifying..."
              : culturalMode === "en-US"
                ? "Verify"
                : culturalMode === "ar-IQ"
                  ? "تحقق"
                  : "تحقق / Verify"}
          </Button>

          {/* Cancel Button */}
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="font-arabic w-full"
              onClick={onCancel}
              disabled={isPending}
            >
              {culturalMode === "en-US"
                ? "Cancel"
                : culturalMode === "ar-IQ"
                  ? "إلغاء"
                  : "إلغاء / Cancel"}
            </Button>
          )}
        </form>
      </Form>

      {/* Resend Code */}
      <div className="text-center">
        <button
          type="button"
          className="text-primary hover:underline font-arabic text-sm"
          onClick={() => {
            // TODO: Implement resend code logic
            setTimeRemaining(600);
            form.reset();
          }}
          disabled={!isExpired && timeRemaining > 0}
        >
          {culturalMode === "en-US"
            ? "Didn't receive the code? Resend"
            : culturalMode === "ar-IQ"
              ? "لم تستلم الرمز؟ إعادة الإرسال"
              : "لم تستلم الرمز؟ إعادة الإرسال / Resend code"}
        </button>
      </div>

      {/* Help Text */}
      <div className="bg-secondary rounded-md p-4">
        <h3 className="font-arabic mb-2 text-sm font-semibold">
          {culturalMode === "en-US"
            ? "Verification Tips"
            : culturalMode === "ar-IQ"
              ? "نصائح التحقق"
              : "نصائح التحقق / Tips"}
        </h3>
        <ul className="text-muted-foreground font-arabic space-y-1 text-xs">
          <li>
            {culturalMode === "en-US"
              ? "• Check your spam/junk folder if using email"
              : culturalMode === "ar-IQ"
                ? "• تحقق من مجلد الرسائل غير المرغوب فيها إذا كنت تستخدم البريد الإلكتروني"
                : "• تحقق من مجلد البريد غير المرغوب فيه"}
          </li>
          <li>
            {culturalMode === "en-US"
              ? "• Ensure your phone has signal if using SMS"
              : culturalMode === "ar-IQ"
                ? "• تأكد من أن هاتفك لديه إشارة إذا كنت تستخدم الرسائل النصية"
                : "• تأكد من إشارة الهاتف للرسائل النصية"}
          </li>
          <li>
            {culturalMode === "en-US"
              ? "• Code is valid for 10 minutes"
              : culturalMode === "ar-IQ"
                ? "• الرمز صالح لمدة 10 دقائق"
                : "• الرمز صالح لمدة 10 دقائق"}
          </li>
        </ul>
      </div>
    </div>
  );
}
