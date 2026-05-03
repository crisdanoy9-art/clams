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

export const EquipmentFields = (
  labOptions: { value: string; label: string }[] = [],
  categoryOptions: { value: string; label: string }[] = [],
) => [
  {
    name: "item_name",
    label: "Item Name",
    type: "text" as const,
    placeholder: "e.g., Dell OptiPlex 7090",
  },
  {
    name: "category_id",
    label: "Category",
    type: "select" as const,
    placeholder: "Select category",
    options: categoryOptions,
  },
  {
    name: "brand",
    label: "Brand",
    type: "text" as const,
    placeholder: "e.g., Dell, HP, Lenovo",
  },
  {
    name: "model",
    label: "Model",
    type: "text" as const,
    placeholder: "e.g., OptiPlex 7090, EliteBook 840",
  },
  {
    name: "serial_number",
    label: "Serial Number",
    type: "text" as const,
    placeholder: "e.g., SN-12345-67890",
  },
  {
    name: "specs",
    label: "Specifications",
    type: "text" as const,
    placeholder: "e.g., 16GB RAM, 512GB SSD, Intel i7",
  },
  {
    name: "asset_tag",
    label: "Asset Tag",
    type: "text" as const,
    placeholder: "e.g., CCS-PC-001",
  },
  {
    name: "lab_id",
    label: "Laboratory",
    type: "select" as const,
    placeholder: "Select laboratory",
    options: labOptions,
  },
  {
    name: "status",
    label: "Status",
    type: "select" as const,
    placeholder: "Select status",
    options: [
      { value: "available", label: "Available" },
      { value: "in_use", label: "In Use" },
      { value: "under_maintenance", label: "Under Maintenance" },
      { value: "retired", label: "Retired" },
    ],
  },
  {
    name: "purchase_date",
    label: "Purchase Date",
    type: "date" as const,
  },
];
