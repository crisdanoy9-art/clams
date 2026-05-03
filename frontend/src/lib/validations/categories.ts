import { z } from "zod";

// 1. Define the Validation Schema
export const categorySchema = z.object({
  category_name: z
    .string()
    .min(2, "Category name is too short")
    .max(50, "Category name is too long")
    .trim(),
});

// 2. Export the Type for use in forms
export type CategoryInput = z.infer<typeof categorySchema>;

// 3. Define a standard Field Interface to fix the "CategoryScheme" error
interface FieldConfig {
  name: keyof CategoryInput;
  label: string;
  type: "text" | "number" | "select" | "file";
  placeholder: string;
}

// 4. Export the Array using the correct interface
export const CategoryField: FieldConfig[] = [
  {
    name: "category_name",
    label: "Category Name",
    type: "text",
    placeholder: "e.g., Computing, Laboratory, Tools",
  },
];
