export const PeripheralFields = [
  {
    name: "lab_id",
    label: "Laboratory",
    type: "select" as const,
  },
  {
    name: "category_id",
    label: "Category",
    type: "select" as const,
  },
  {
    name: "item_name",
    label: "Item Name",
    type: "text" as const,
    placeholder: "e.g., Mouse",
  },
  {
    name: "brand",
    label: "Brand",
    type: "text" as const,
    placeholder: "e.g., Logitech",
  },
  {
    name: "working_count",
    label: "Working Count",
    type: "number" as const,
    placeholder: "e.g., 38",
  },
  {
    name: "damaged_count",
    label: "Damaged Count",
    type: "number" as const,
    placeholder: "e.g., 4",
  },
];
