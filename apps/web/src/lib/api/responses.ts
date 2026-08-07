import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import type { ApiErrorCode } from "@iraqi-ai/types";
import {
  failure as createFailure,
  success as createSuccess,
} from "@iraqi-ai/types";

interface ResponseOptions {
  status?: number;
  requestId?: string;
}

interface FailureOptions extends ResponseOptions {
  fieldErrors?: Record<string, string[]>;
}

export function getRequestId(request: Request): string {
  const supplied = request.headers.get("x-request-id")?.trim();

  if (supplied && supplied.length <= 128) {
    return supplied;
  }

  return crypto.randomUUID();
}

export function zodFieldErrors(error: ZodError): Record<string, string[]> {
  const flattened = error.flatten().fieldErrors;
  const fieldErrors: Record<string, string[]> = {};

  for (const [field, messages] of Object.entries(flattened)) {
    if (messages && messages.length > 0) {
      fieldErrors[field] = messages;
    }
  }

  return fieldErrors;
}

export function jsonSuccess<T>(
  data: T,
  options: ResponseOptions = {},
): NextResponse {
  return NextResponse.json(createSuccess(data, options.requestId), {
    status: options.status ?? 200,
    headers: options.requestId
      ? { "x-request-id": options.requestId }
      : undefined,
  });
}

export function jsonFailure(
  code: ApiErrorCode,
  message: string,
  options: FailureOptions = {},
): NextResponse {
  return NextResponse.json(
    createFailure(code, message, {
      fieldErrors: options.fieldErrors,
      requestId: options.requestId,
    }),
    {
      status: options.status ?? 500,
      headers: options.requestId
        ? { "x-request-id": options.requestId }
        : undefined,
    },
  );
}
