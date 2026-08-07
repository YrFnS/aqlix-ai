"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

interface AuthSubmitButtonProps {
  idleLabel: string;
  pendingLabel: string;
  disabled?: boolean;
}

export function AuthSubmitButton({
  idleLabel,
  pendingLabel,
  disabled = false,
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full rounded-full"
      disabled={disabled || pending}
      aria-disabled={disabled || pending}
    >
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
