import { describe, expect, test } from "bun:test";
import {
  createWorkspaceInputSchema,
  deleteWorkspaceInputSchema,
  updateWorkspaceInputSchema,
  workspaceRoleSchema,
} from "./workspace";

describe("workspace contracts", () => {
  test("normalizes a valid create command", () => {
    const result = createWorkspaceInputSchema.parse({
      name: "  مشروع العقود  ",
      description: "  مساحة ثنائية اللغة  ",
      defaultLanguage: "ar",
    });

    expect(result).toEqual({
      name: "مشروع العقود",
      description: "مساحة ثنائية اللغة",
      defaultLanguage: "ar",
    });
  });

  test("rejects an empty workspace name", () => {
    const result = createWorkspaceInputSchema.safeParse({ name: "   " });
    expect(result.success).toBe(false);
  });

  test("requires at least one update field", () => {
    const result = updateWorkspaceInputSchema.safeParse({
      workspaceId: "3a6d91fa-5aaf-4eb6-8fc5-b47d137fe75f",
    });
    expect(result.success).toBe(false);
  });

  test("requires the current name for destructive deletion", () => {
    const result = deleteWorkspaceInputSchema.safeParse({
      workspaceId: "3a6d91fa-5aaf-4eb6-8fc5-b47d137fe75f",
      confirmationName: "",
    });
    expect(result.success).toBe(false);
  });

  test("keeps the membership role set intentionally small", () => {
    expect(workspaceRoleSchema.options).toEqual(["owner", "editor", "viewer"]);
  });
});
