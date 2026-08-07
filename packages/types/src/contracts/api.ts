import { z } from "zod";

export const apiErrorCodeSchema = z.enum([
  "VALIDATION_ERROR",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "PERSISTENCE_ERROR",
  "SERVICE_UNAVAILABLE",
  "INTERNAL_ERROR",
]);

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;

export const apiFieldErrorsSchema = z.record(z.array(z.string().min(1)));

export const apiErrorSchema = z.object({
  code: apiErrorCodeSchema,
  message: z.string().min(1),
  fieldErrors: apiFieldErrorsSchema.optional(),
  requestId: z.string().min(1).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export interface ApiSuccess<T> {
  ok: true;
  data: T;
  meta?: {
    requestId?: string;
  };
}

export interface ApiFailure {
  ok: false;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function apiSuccessSchema<TSchema extends z.ZodTypeAny>(data: TSchema) {
  return z.object({
    ok: z.literal(true),
    data,
    meta: z
      .object({
        requestId: z.string().min(1).optional(),
      })
      .optional(),
  });
}

export const apiFailureSchema = z.object({
  ok: z.literal(false),
  error: apiErrorSchema,
});

export function apiResponseSchema<TSchema extends z.ZodTypeAny>(data: TSchema) {
  return z.discriminatedUnion("ok", [apiSuccessSchema(data), apiFailureSchema]);
}

export function success<T>(data: T, requestId?: string): ApiSuccess<T> {
  return requestId
    ? { ok: true, data, meta: { requestId } }
    : { ok: true, data };
}

export function failure(
  code: ApiErrorCode,
  message: string,
  options?: {
    fieldErrors?: Record<string, string[]>;
    requestId?: string;
  },
): ApiFailure {
  return {
    ok: false,
    error: {
      code,
      message,
      ...(options?.fieldErrors ? { fieldErrors: options.fieldErrors } : {}),
      ...(options?.requestId ? { requestId: options.requestId } : {}),
    },
  };
}
