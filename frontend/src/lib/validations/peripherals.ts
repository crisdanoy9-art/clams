import { z } from "zod";

export const PeripheralSchema = z.object({
  lab_id: z.string().min(1, "Laboratory is required"),
  item_name: z.string().min(1, "Item name is required"),
  brand: z.string().min(1, "Brand is required"),
  working_count: z.coerce.number().min(0, "Cannot be negative"),
  total_count: z.coerce.number().min(0, "Cannot be negative"),
});

export type Peripheral = z.infer<typeof PeripheralSchema>;

// Converted to a function that accepts dynamic lab options
export const PeripheralFields = (
  labOptions: { value: string; label: string }[] = []
) => [
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
    options: labOptions, // Injected dynamically here
  },
  {
    name: "working_count",
    label: "Working Count",
    type: "number" as const,
    placeholder: "0",
  },

];