import { z } from "zod";

export const PeripheralSchema = z.object({
  lab_id: z.string().min(1, "Laboratory is required"),
  item_name: z.string().min(1, "Item name is required"),
  brand: z.string().min(1, "Brand is required"),
  working_count: z.coerce.number().min(0, "Cannot be negative"),
  total_count: z.coerce.number().min(0, "Cannot be negative"),
});

export type Peripheral = z.infer<typeof PeripheralSchema>;

// FIXED: Added missing 'total_count' and simplified the structure to match your form generator
export const PeripheralFields = [
  {
    name: "item_name",
    label: "Item Name",
    type: "text" as const,
    placeholder: "e.g., Keyboard, Mouse, Monitor",
  },
  {
    name: "brand",
    label: "Brand",
    type: "text" as const,
    placeholder: "e.g., Logitech, Dell, Razer",
  },
  {
    name: "lab_id",
    label: "Laboratory",
    type: "select" as const,
    placeholder: "Select laboratory",
    options: [
      { value: "Lab 1", label: "Laboratory 1" },
      { value: "Lab 2", label: "Laboratory 2" },
      { value: "Lab 3", label: "Laboratory 3" },
    ],
  },
  {
    name: "working_count",
    label: "Working Count",
    type: "number" as const,
    placeholder: "0",
  },
];
