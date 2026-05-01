// lib/validations/equipmentSchema.ts
import { z } from "zod";

export const EquipmentSchema = z.object({
  asset_tag: z.string().min(1, "Asset tag is required"),
  item_name: z.string().min(1, "Item name is required"),
  category_id: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  serial_number: z.string().min(1, "Serial number is required"),
  specs: z.string().optional(),
  lab_id: z.string().min(1, "Laboratory is required"),
  status: z
    .enum(["available", "in_use", "under_maintenance", "retired"])
    .default("available"),
  purchase_date: z.string().min(1, "Purchase date is required"),
});

export type Equipment = z.infer<typeof EquipmentSchema>;

export const EquipmentApi: Record<
  keyof Equipment,
  "text" | "select" | "date" | "textarea"
> = {
  asset_tag: "text",
  item_name: "text",
  category_id: "select",
  brand: "text",
  model: "text",
  serial_number: "text",
  specs: "textarea",
  lab_id: "select",
  status: "select",
  purchase_date: "date",
};
