"use client";

/**
 * Registration Form Component for Iraqi Users
 * Features:
 * - Comprehensive user registration with Iraqi cultural context
 * - Iraqi ID validation and professional license verification
 * - Cultural preferences selection
 * - RTL layout support
 * - Multi-step form with validation
 * - Integration with Server Actions
 */

import { useState, useTransition } from "react";
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
import { IraqiIDInput } from "./iraqi-id-input";
import { ProfessionalLicenseInput } from "./professional-license-input";
import { signUpAction, type SignUpData } from "@/lib/auth/actions";

// Validation schema with Iraqi cultural considerations
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(
        2,
        "الاسم يجب أن يكون حرفين على الأقل / Name must be at least 2 characters",
      )
      .max(200, "الاسم طويل جداً / Name is too long"),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب / Email is required")
      .email("البريد الإلكتروني غير صحيح / Invalid email format"),
    password: z
      .string()
      .min(
        8,
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل / Password must be at least 8 characters",
      )
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام / Password must contain uppercase, lowercase, and numbers",
      ),
    confirmPassword: z
      .string()
      .min(1, "تأكيد كلمة المرور مطلوب / Confirm password is required"),
    region: z.enum(["baghdad", "basra", "mosul", "erbil", "other"]),
    iraqiId: z.string().optional(),
    professionalDomain: z
      .enum([
        "legal",
        "medical",
        "educational",
        "engineering",
        "organizational",
      ])
      .optional(),
    professionalLicense: z.string().optional(),
    islamicComplianceLevel: z.enum(["basic", "standard", "strict"]),
    languagePreference: z.enum(["ar-IQ", "en-US", "both"]),
    respectPrayerTimes: z.boolean(),
    familyPrivacyLevel: z.enum(["private", "family", "public"]),
    professionalEtiquetteLevel: z.enum(["standard", "formal", "traditional"]),
    termsAccepted: z.literal(true, {
      errorMap: () => ({
        message: "يجب الموافقة على الشروط / Must accept terms",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة / Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  redirectTo?: string;
  culturalMode?: "ar-IQ" | "en-US" | "both";
  showLoginLink?: boolean;
  onSuccess?: (userId: string) => void;
}

export function RegisterForm({
  redirectTo = "/auth/verify-email",
  culturalMode = "both",
  showLoginLink = true,
  onSuccess,
}: RegisterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | undefined>();
  const [showProfessionalFields, setShowProfessionalFields] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      region: "baghdad",
      iraqiId: "",
      islamicComplianceLevel: "standard",
      languagePreference: "both",
      respectPrayerTimes: true,
      familyPrivacyLevel: "private",
      professionalEtiquetteLevel: "standard",
      termsAccepted: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(undefined);

    // Construct SignUpData from form values
    const signUpData: SignUpData = {
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      region: values.region,
      iraqiId: values.iraqiId || undefined,
      professionalDomain: values.professionalDomain,
      professionalLicense: values.professionalLicense || undefined,
      culturalPreferences: {
        islamicComplianceLevel: values.islamicComplianceLevel,
        languagePreference: values.languagePreference,
        respectPrayerTimes: values.respectPrayerTimes,
        familyPrivacyLevel: values.familyPrivacyLevel,
        professionalEtiquetteLevel: values.professionalEtiquetteLevel,
      },
    };

    startTransition(async () => {
      try {
        const result = await signUpAction(signUpData);

        if (result.success) {
          // Registration successful
          if (onSuccess && result.data?.userId) {
            onSuccess(result.data.userId);
          }
          router.push(redirectTo);
        } else {
          setFormError(
            result.error ||
              "فشل التسجيل / Registration failed. Please try again.",
          );
        }
      } catch (error) {
        setFormError(
          "حدث خطأ في النظام / System error occurred. Please try again later.",
        );
      }
    });
  };

  return (
    <div
      className="w-full max-w-2xl space-y-6"
      dir={culturalMode === "ar-IQ" ? "rtl" : "ltr"}
    >
      {/* Cultural Greeting Header */}
      <div className="space-y-2 text-center">
        <h1 className="font-arabic text-2xl font-bold tracking-tight">
          {culturalMode === "en-US" ? (
            "Create Account"
          ) : culturalMode === "ar-IQ" ? (
            "إنشاء حساب جديد"
          ) : (
            <>
              <span className="block">أهلاً وسهلاً</span>
              <span className="text-muted-foreground block text-base">
                Welcome
              </span>
            </>
          )}
        </h1>
        <p className="text-muted-foreground text-sm">
          {culturalMode === "en-US"
            ? "Join the Iraqi AI community"
            : culturalMode === "ar-IQ"
              ? "انضم إلى مجتمع الذكاء الاصطناعي العراقي"
              : "انضم إلى مجتمع الذكاء الاصطناعي العراقي"}
        </p>
      </div>

      {/* Registration Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h2 className="font-arabic text-lg font-semibold">
              {culturalMode === "en-US" ? (
                "Basic Information"
              ) : culturalMode === "ar-IQ" ? (
                "المعلومات الأساسية"
              ) : (
                <bdi>المعلومات الأساسية / Basic Information</bdi>
              )}
            </h2>

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">
                    {culturalMode === "en-US" ? (
                      "Full Name"
                    ) : culturalMode === "ar-IQ" ? (
                      "الاسم الكامل"
                    ) : (
                      <bdi>الاسم الكامل / Full Name</bdi>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        culturalMode === "en-US"
                          ? "Ahmed Mohammed"
                          : "أحمد محمد"
                      }
                      disabled={isPending}
                      autoComplete="name"
                      dir={culturalMode === "ar-IQ" ? "rtl" : "ltr"}
                    />
                  </FormControl>
                  <FormMessage className="font-arabic" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">
                    {culturalMode === "en-US" ? (
                      "Email Address"
                    ) : culturalMode === "ar-IQ" ? (
                      "البريد الإلكتروني"
                    ) : (
                      <bdi>البريد الإلكتروني / Email</bdi>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="name@example.com"
                      disabled={isPending}
                      autoComplete="email"
                      dir="ltr"
                    />
                  </FormControl>
                  <FormMessage className="font-arabic" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">
                    {culturalMode === "en-US" ? (
                      "Password"
                    ) : culturalMode === "ar-IQ" ? (
                      "كلمة المرور"
                    ) : (
                      <bdi>كلمة المرور / Password</bdi>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      disabled={isPending}
                      autoComplete="new-password"
                      dir="ltr"
                    />
                  </FormControl>
                  <FormDescription className="font-arabic text-xs">
                    {culturalMode === "en-US"
                      ? "Must be at least 8 characters with uppercase, lowercase, and numbers"
                      : culturalMode === "ar-IQ"
                        ? "يجب أن تحتوي على 8 أحرف على الأقل مع حروف كبيرة وصغيرة وأرقام"
                        : "يجب أن تحتوي على 8 أحرف على الأقل"}
                  </FormDescription>
                  <FormMessage className="font-arabic" />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">
                    {culturalMode === "en-US" ? (
                      "Confirm Password"
                    ) : culturalMode === "ar-IQ" ? (
                      "تأكيد كلمة المرور"
                    ) : (
                      <bdi>تأكيد كلمة المرور / Confirm Password</bdi>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      disabled={isPending}
                      autoComplete="new-password"
                      dir="ltr"
                    />
                  </FormControl>
                  <FormMessage className="font-arabic" />
                </FormItem>
              )}
            />

            {/* Region Selection */}
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">
                    {culturalMode === "en-US" ? (
                      "Region"
                    ) : culturalMode === "ar-IQ" ? (
                      "المنطقة"
                    ) : (
                      <bdi>المنطقة / Region</bdi>
                    )}
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isPending}
                      className="border-input focus-visible:ring-ring flex min-h-[44px] w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="baghdad">
                        {culturalMode === "ar-IQ" ? "بغداد" : "Baghdad / بغداد"}
                      </option>
                      <option value="basra">
                        {culturalMode === "ar-IQ" ? "البصرة" : "Basra / البصرة"}
                      </option>
                      <option value="mosul">
                        {culturalMode === "ar-IQ" ? "الموصل" : "Mosul / الموصل"}
                      </option>
                      <option value="erbil">
                        {culturalMode === "ar-IQ" ? "أربيل" : "Erbil / أربيل"}
                      </option>
                      <option value="other">
                        {culturalMode === "ar-IQ" ? "أخرى" : "Other / أخرى"}
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage className="font-arabic" />
                </FormItem>
              )}
            />
          </div>

          {/* Iraqi ID Section (Optional) */}
          <div className="space-y-4">
            <h2 className="font-arabic text-lg font-semibold">
              {culturalMode === "en-US"
                ? "Iraqi ID (Optional)"
                : culturalMode === "ar-IQ"
                  ? "الهوية العراقية (اختياري)"
                  : "الهوية العراقية / Iraqi ID (Optional)"}
            </h2>

            <FormField
              control={form.control}
              name="iraqiId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <IraqiIDInput
                      {...field}
                      region={form.watch("region")}
                      culturalMode={culturalMode}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="font-arabic" />
                </FormItem>
              )}
            />
          </div>

          {/* Professional Information Section (Optional) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-arabic text-lg font-semibold">
                {culturalMode === "en-US"
                  ? "Professional Information (Optional)"
                  : culturalMode === "ar-IQ"
                    ? "المعلومات المهنية (اختياري)"
                    : "المعلومات المهنية / Professional (Optional)"}
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setShowProfessionalFields(!showProfessionalFields)
                }
                disabled={isPending}
              >
                {showProfessionalFields ? "-" : "+"}
              </Button>
            </div>

            {showProfessionalFields && (
              <div className="space-y-4">
                {/* Professional Domain */}
                <FormField
                  control={form.control}
                  name="professionalDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-arabic">
                        {culturalMode === "en-US"
                          ? "Professional Domain"
                          : culturalMode === "ar-IQ"
                            ? "المجال المهني"
                            : "المجال المهني / Domain"}
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          disabled={isPending}
                          className="border-input focus-visible:ring-ring flex min-h-[44px] w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        >
                          <option value="">
                            {culturalMode === "ar-IQ"
                              ? "اختر المجال"
                              : "Select Domain"}
                          </option>
                          <option value="legal">
                            {culturalMode === "ar-IQ"
                              ? "قانوني"
                              : "Legal / قانوني"}
                          </option>
                          <option value="medical">
                            {culturalMode === "ar-IQ" ? "طبي" : "Medical / طبي"}
                          </option>
                          <option value="educational">
                            {culturalMode === "ar-IQ"
                              ? "تعليمي"
                              : "Educational / تعليمي"}
                          </option>
                          <option value="engineering">
                            {culturalMode === "ar-IQ"
                              ? "هندسي"
                              : "Engineering / هندسي"}
                          </option>
                          <option value="organizational">
                            {culturalMode === "ar-IQ"
                              ? "تنظيمي"
                              : "Organizational / تنظيمي"}
                          </option>
                        </select>
                      </FormControl>
                      <FormMessage className="font-arabic" />
                    </FormItem>
                  )}
                />

                {/* Professional License */}
                {form.watch("professionalDomain") && (
                  <FormField
                    control={form.control}
                    name="professionalLicense"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ProfessionalLicenseInput
                            {...field}
                            domain={form.watch("professionalDomain")!}
                            culturalMode={culturalMode}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage className="font-arabic" />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </div>

          {/* Cultural Preferences Section */}
          <div className="space-y-4">
            <h2 className="font-arabic text-lg font-semibold">
              {culturalMode === "en-US"
                ? "Cultural Preferences"
                : culturalMode === "ar-IQ"
                  ? "التفضيلات الثقافية"
                  : "التفضيلات الثقافية / Cultural Preferences"}
            </h2>

            {/* Islamic Compliance Level */}
            <FormField
              control={form.control}
              name="islamicComplianceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">
                    {culturalMode === "en-US"
                      ? "Islamic Compliance Level"
                      : culturalMode === "ar-IQ"
                        ? "مستوى الامتثال الإسلامي"
                        : "مستوى الامتثال الإسلامي / Islamic Compliance"}
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isPending}
                      className="border-input focus-visible:ring-ring flex min-h-[44px] w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="basic">
                        {culturalMode === "ar-IQ" ? "أساسي" : "Basic / أساسي"}
                      </option>
                      <option value="standard">
                        {culturalMode === "ar-IQ"
                          ? "قياسي"
                          : "Standard / قياسي"}
                      </option>
                      <option value="strict">
                        {culturalMode === "ar-IQ" ? "صارم" : "Strict / صارم"}
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage className="font-arabic" />
                </FormItem>
              )}
            />

            {/* Language Preference */}
            <FormField
              control={form.control}
              name="languagePreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">
                    {culturalMode === "en-US"
                      ? "Language Preference"
                      : culturalMode === "ar-IQ"
                        ? "تفضيل اللغة"
                        : "تفضيل اللغة / Language"}
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isPending}
                      className="border-input focus-visible:ring-ring flex min-h-[44px] w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="ar-IQ">
                        {culturalMode === "ar-IQ" ? "عربي" : "Arabic / عربي"}
                      </option>
                      <option value="en-US">
                        {culturalMode === "ar-IQ"
                          ? "إنجليزي"
                          : "English / إنجليزي"}
                      </option>
                      <option value="both">
                        {culturalMode === "ar-IQ" ? "كلاهما" : "Both / كلاهما"}
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage className="font-arabic" />
                </FormItem>
              )}
            />

            {/* Respect Prayer Times */}
            <FormField
              control={form.control}
              name="respectPrayerTimes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-arabic">
                      {culturalMode === "en-US"
                        ? "Respect Prayer Times"
                        : culturalMode === "ar-IQ"
                          ? "احترام أوقات الصلاة"
                          : "احترام أوقات الصلاة / Respect Prayer Times"}
                    </FormLabel>
                    <FormDescription className="font-arabic text-xs">
                      {culturalMode === "en-US"
                        ? "Delay notifications during prayer times"
                        : culturalMode === "ar-IQ"
                          ? "تأخير الإشعارات خلال أوقات الصلاة"
                          : "تأخير الإشعارات خلال أوقات الصلاة"}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Terms and Conditions */}
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-arabic">
                    {culturalMode === "en-US" ? (
                      <>
                        I accept the{" "}
                        <a href="/terms" className="text-primary underline">
                          Terms & Conditions
                        </a>
                      </>
                    ) : culturalMode === "ar-IQ" ? (
                      <>
                        أوافق على{" "}
                        <a href="/terms" className="text-primary underline">
                          الشروط والأحكام
                        </a>
                      </>
                    ) : (
                      <>
                        أوافق على{" "}
                        <a href="/terms" className="text-primary underline">
                          الشروط والأحكام
                        </a>
                      </>
                    )}
                  </FormLabel>
                  <FormMessage className="font-arabic" />
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
            disabled={isPending}
            size="lg"
          >
            {isPending
              ? culturalMode === "en-US"
                ? "Creating Account..."
                : culturalMode === "ar-IQ"
                  ? "جاري إنشاء الحساب..."
                  : "جاري إنشاء الحساب... / Creating..."
              : culturalMode === "en-US"
                ? "Create Account"
                : culturalMode === "ar-IQ"
                  ? "إنشاء حساب"
                  : "إنشاء حساب / Create Account"}
          </Button>
        </form>
      </Form>

      {/* Login Link */}
      {showLoginLink && (
        <p className="text-muted-foreground font-arabic text-center text-sm">
          {culturalMode === "en-US"
            ? "Already have an account? "
            : culturalMode === "ar-IQ"
              ? "لديك حساب بالفعل؟ "
              : "لديك حساب بالفعل؟ / Already have an account? "}
          <a
            href="/auth/login"
            className="text-primary hover:underline font-bold"
          >
            {culturalMode === "en-US"
              ? "Sign In"
              : culturalMode === "ar-IQ"
                ? "تسجيل الدخول"
                : "تسجيل الدخول / Sign In"}
          </a>
        </p>
      )}
    </div>
  );
}
