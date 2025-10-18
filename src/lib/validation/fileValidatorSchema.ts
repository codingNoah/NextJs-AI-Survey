import { z } from "zod";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // bytes

export const fileSchema = z
  .instanceof(File, { message: "No file uploaded" })
  .refine(
    (file) =>
      [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(file.type),
    { message: "Invalid file type. Only CSV or Excel files are allowed." }
  )
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size exceeds 20MB limit.",
  });
