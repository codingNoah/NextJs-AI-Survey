import { z } from "zod";

export const questionValidatorSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title is too long"),
  prompt: z
    .string()
    .max(300, "Description must be under 300 characters")
    .optional(),
});
