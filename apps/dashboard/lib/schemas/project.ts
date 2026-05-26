import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(200),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
