import { describe, expect, test } from "bun:test";
import { z } from "zod";
import {
  apiResponseSchema,
  failure,
  success,
} from "./api";

describe("API response contracts", () => {
  const responseSchema = apiResponseSchema(
    z.object({
      id: z.string().uuid(),
    }),
  );

  test("creates a typed success response", () => {
    const response = success({
      id: "3a6d91fa-5aaf-4eb6-8fc5-b47d137fe75f",
    });

    expect(responseSchema.parse(response).ok).toBe(true);
  });

  test("creates a typed validation failure", () => {
    const response = failure("VALIDATION_ERROR", "Invalid workspace", {
      fieldErrors: {
        name: ["Workspace name is required"],
      },
    });

    const parsed = responseSchema.parse(response);
    expect(parsed.ok).toBe(false);

    if (!parsed.ok) {
      expect(parsed.error.code).toBe("VALIDATION_ERROR");
      expect(parsed.error.fieldErrors?.name).toEqual([
        "Workspace name is required",
      ]);
    }
  });
});
