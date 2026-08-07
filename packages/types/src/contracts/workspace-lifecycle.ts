import { z } from "zod";
import { entityIdSchema } from "./workspace";

export const setWorkspaceArchivedInputSchema = z.object({
  workspaceId: entityIdSchema,
  archived: z.boolean(),
});

export type SetWorkspaceArchivedInput = z.infer<
  typeof setWorkspaceArchivedInputSchema
>;
