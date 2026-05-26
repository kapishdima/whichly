import { z } from "zod";

export const ReviewItemSchema = z.object({
  block: z.string().min(1).max(200),
  variant: z.string().min(1).max(200),
  comment: z.string().max(5000).default(""),
});

export const CreateReviewSchema = z.object({
  projectId: z.string().min(1),
  items: z.array(ReviewItemSchema).min(1).max(200),
});

export type ReviewItem = z.infer<typeof ReviewItemSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
