"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function VerifyEmailContent() {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      // TODO: Implement actual resend verification email API call
      // const response = await fetch('/api/auth/resend-verification', {
      //   method: 'POST',
      // });

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "البريد مرسل / Email Sent",
        description:
          "تم إرسال رابط التحقق مرة أخرى / Verification link has been resent",
      });
    } catch (error) {
      toast({
        title: "خطأ / Error",
        description:
          "فشل إرسال البريد. يرجى المحاولة مرة أخرى / Failed to send email. Please try again",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 text-center">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="bg-primary/10 rounded-full p-6">
          <svg
            className="text-primary h-16 w-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="font-arabic text-2xl font-bold tracking-tight">
          <span className="block">تحقق من بريدك الإلكتروني</span>
          <span className="text-muted-foreground block text-base font-normal">
            Verify Your Email
          </span>
        </h1>
        <p className="text-muted-foreground font-arabic text-sm">
          لقد أرسلنا رابط التحقق إلى بريدك الإلكتروني
          <br />
          We've sent a verification link to your email
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-secondary rounded-lg p-6 space-y-4 text-left">
        <h2 className="font-arabic text-sm font-semibold">
          الخطوات التالية / Next Steps:
        </h2>
        <ol className="text-muted-foreground font-arabic space-y-2 text-sm">
          <li className="flex gap-3">
            <span className="bg-primary text-primary-foreground flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs">
              1
            </span>
            <span>افتح بريدك الإلكتروني / Open your email inbox</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-primary text-primary-foreground flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs">
              2
            </span>
            <span>
              ابحث عن رسالة من Iraqi AI Chat System / Look for an email from us
            </span>
          </li>
          <li className="flex gap-3">
            <span className="bg-primary text-primary-foreground flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs">
              3
            </span>
            <span>انقر على رابط التحقق / Click the verification link</span>
          </li>
        </ol>
      </div>

      {/* Help Text */}
      <div className="border-l-4 border-primary bg-primary/5 p-4 text-left">
        <p className="font-arabic text-sm">
          <strong>
            لم تستلم البريد الإلكتروني؟ / Didn't receive the email?
          </strong>
        </p>
        <ul className="text-muted-foreground font-arabic mt-2 space-y-1 text-xs">
          <li>• تحقق من مجلد البريد غير المرغوب فيه / Check spam folder</li>
          <li>
            • تأكد من عنوان البريد الإلكتروني صحيح / Verify email address is
            correct
          </li>
          <li>• انتظر بضع دقائق / Wait a few minutes</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="font-arabic w-full"
          onClick={handleResendEmail}
          disabled={isResending}
        >
          {isResending
            ? "جاري الإرسال... / Sending..."
            : "إعادة إرسال البريد / Resend Email"}
        </Button>

        <Link href="/auth/login">
          <Button variant="ghost" className="font-arabic w-full">
            العودة لتسجيل الدخول / Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
