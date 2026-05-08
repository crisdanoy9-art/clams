export const EquipmentFields = [
  {
    name: "asset_tag",
    label: "Asset Tag",
    type: "text" as const,
    placeholder: "e.g., COMP-LAB1-001",
  },
  {
    name: "item_name",
    label: "Item Name",
    type: "text" as const,
    placeholder: "e.g., Desktop PC",
  },
  {
    name: "category_id",
    label: "Category",
    type: "select" as const,
  },
  {
    name: "lab_id",
    label: "Laboratory",
    type: "select" as const,
  },
  {
    name: "brand",
    label: "Brand",
    type: "text" as const,
    placeholder: "e.g., Dell",
  },
  {
    name: "model",
    label: "Model",
    type: "text" as const,
    placeholder: "e.g., OptiPlex 7090",
  },
  {
    name: "serial_number",
    label: "Serial Number",
    type: "text" as const,
    placeholder: "e.g., DL-SN-00001",
  },
  {
    name: "status",
    label: "Status",
    type: "select" as const,
    options: ["working", "for_repair", "condemned", "transferred"],
  },
  {
    name: "purchase_date",
    label: "Purchase Date",
    type: "date" as const,
  },
  {
    name: "specs.cpu",
    label: "CPU",
    type: "text" as const,
    placeholder: "e.g., Intel i5-10400",
  },
  {
    name: "specs.ram",
    label: "RAM",
    type: "text" as const,
    placeholder: "e.g., 8GB DDR4",
  },
  {
    name: "specs.storage",
    label: "Storage",
    type: "text" as const,
    placeholder: "e.g., 512GB SSD",
  },
  {
    name: "specs.os",
    label: "Operating System",
    type: "text" as const,
    placeholder: "e.g., Windows 11 Pro",
  },
  {
    name: "specs.gpu",
    label: "GPU",
    type: "text" as const,
    placeholder: "e.g., Intel UHD 630",
  },
];
