import { z } from "zod";
import { workspaceRoleSchema, workspaceSchema } from "./workspace";

export const workspaceAccessSchema = workspaceSchema.extend({
  role: workspaceRoleSchema,
});

export type WorkspaceAccess = z.infer<typeof workspaceAccessSchema>;
export const workspaceListSchema = z.array(workspaceAccessSchema);
