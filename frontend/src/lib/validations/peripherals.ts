// lib/validations/peripheralSchema.ts
import { z } from "zod";

export const PeripheralSchema = z
  .object({
    lab_id: z.string().min(1, "Laboratory is required"),
    item_name: z.string().min(1, "Item name is required"),
    brand: z.string().min(1, "Brand is required"),
    working_count: z.coerce.number().min(0, "Cannot be negative"),
    damaged_count: z.coerce.number().min(0, "Cannot be negative"),
    total_count: z.coerce.number().min(0, "Cannot be negative"),
  })
  .refine(
    (data) => data.working_count + data.damaged_count === data.total_count,
    {
      message: "Working + damaged count must equal total count",
      path: ["total_count"],
    },
  );

export type Peripheral = z.infer<typeof PeripheralSchema>;

export const PeripheralApi: Record<
  keyof Peripheral,
  "text" | "select" | "number"
> = {
  lab_id: "select",
  item_name: "text",
  brand: "text",
  working_count: "number",
  damaged_count: "number",
  total_count: "number",
};
