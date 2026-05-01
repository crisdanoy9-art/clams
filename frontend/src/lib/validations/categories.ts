// lib/validations/categorySchema.ts
import { z } from "zod";

export const CategorySchema = z.object({
  category_name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name too long"),
});

export type Category = z.infer<typeof CategorySchema>;

export const CategoryApi: Record<keyof Category, "text"> = {
  category_name: "text",
};
