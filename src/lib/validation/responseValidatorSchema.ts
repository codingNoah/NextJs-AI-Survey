import { z } from "zod";

export const responseValidatorSchema = z.object({
  answers: z
    .array(z.string().min(1, "Answer cannot be empty"))
    .refine((arr) => arr.length > 0, { message: "..." }),
});
