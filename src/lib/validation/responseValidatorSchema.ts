import { z } from "zod";

export const responseValidatorSchema = z.object({
  answers: z
    .array(z.string().min(1, "Answer cannot be empty"))
    .nonempty("At least one answer is required"),
});
