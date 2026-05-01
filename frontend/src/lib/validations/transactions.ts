// lib/validations/borrowSchema.ts
import { z } from "zod";

export const BorrowSchema = z
  .object({
    instructor_id: z.string().min(1, "Instructor is required"),
    item_name: z.string().min(1, "Item name is required"),
    quantity: z.coerce
      .number()
      .positive("Quantity must be positive")
      .max(99999),
    borrower_name: z.string().min(1, "Borrower name is required"),
    borrow_date: z.string().min(1, "Borrow date is required"),
    expected_return_date: z.string().min(1, "Expected return date is required"),
    actual_return_date: z.string().optional(),
    remarks: z.string().optional(),
  })
  .refine(
    (data) => new Date(data.expected_return_date) >= new Date(data.borrow_date),
    {
      message: "Expected return date must be after borrow date",
      path: ["expected_return_date"],
    },
  );

export type BorrowTransaction = z.infer<typeof BorrowSchema>;

export const BorrowApi: Record<
  keyof BorrowTransaction,
  "text" | "select" | "date" | "number"
> = {
  instructor_id: "select",
  item_name: "text",
  quantity: "number",
  borrower_name: "text",
  borrow_date: "date",
  expected_return_date: "date",
  actual_return_date: "date",
  remarks: "text",
};
