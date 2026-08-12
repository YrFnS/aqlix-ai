"use client";

import type { ComponentProps, FormEvent } from "react";

type NativeActionFormProps = ComponentProps<"form">;

/**
 * Forces a real browser navigation for security-sensitive server actions.
 *
 * React's enhanced action transition can receive authentication cookies and
 * a redirect response without committing the route in WebKit. Native submission
 * keeps progressive enhancement intact and makes the redirect authoritative.
 */
export function NativeActionForm({
  onSubmit,
  ...props
}: NativeActionFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    onSubmit?.(event);
    if (event.defaultPrevented) return;

    event.preventDefault();
    HTMLFormElement.prototype.submit.call(event.currentTarget);
  }

  return <form {...props} onSubmit={handleSubmit} />;
}
