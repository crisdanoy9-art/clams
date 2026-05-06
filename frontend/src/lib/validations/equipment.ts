export const EquipmentFields = (
  categoryOptions: { value: string | number; label: string }[] = [],
  labOptions: { value: string | number; label: string }[] = [],
  peripherals: any[] = [],
) => {
  const getStockOptions = (keyword: string) => {
    return peripherals
      .filter((p) => {
        const itemName = p.item_name?.toLowerCase() || "";
        const brand = p.brand?.toLowerCase() || "";
        const searchKey = keyword.toLowerCase();
        return itemName.includes(searchKey) || brand.includes(searchKey);
      })
      .map((p) => ({
        // Value is a nested object so when stored it becomes { value: "...", status: "ok" }
        value: JSON.stringify({
          value: `${p.brand} ${p.item_name}`,
          status: "ok",
        }),
        label: `${p.item_name} — ${p.brand} (${p.working_count} available)`,
      }));
  };

  return [
    {
      name: "item_name",
      label: "Unit Designation",
      type: "text",
      placeholder: "e.g., Station-01",
    },
    {
      name: "asset_tag",
      label: "Asset Tag",
      type: "text",
      placeholder: "CCS-PC-2026-001",
    },
    {
      name: "brand",
      label: "System Brand",
      type: "text",
      placeholder: "e.g., Custom Build, Dell, HP",
    },
    {
      name: "model",
      label: "System Model",
      type: "text",
      placeholder: "e.g., OptiPlex 7080",
    },
    {
      name: "specs",
      label: "Hardware Configuration (Stored as JSONB)",
      type: "group",
      fields: [
        {
          name: "cpu",
          label: "Processor",
          type: "select",
          options: getStockOptions("cpu"),
          placeholder: "Select CPU from Stock",
        },
        {
          name: "ram",
          label: "Memory",
          type: "select",
          options: getStockOptions("ram"),
          placeholder: "Select RAM from Stock",
        },
        {
          name: "storage",
          label: "Storage Device",
          type: "select",
          options: [...getStockOptions("ssd"), ...getStockOptions("hdd")],
          placeholder: "Select Storage",
        },
        {
          name: "keyboard",
          label: "Keyboard Model",
          type: "select",
          options: getStockOptions("keyboard"),
          placeholder: "Select Keyboard",
        },
        {
          name: "mouse",
          label: "Mouse Model",
          type: "select",
          options: getStockOptions("mouse"),
          placeholder: "Select Mouse",
        },
      ],
    },
    {
      name: "category_id",
      label: "Category",
      type: "select",
      options: categoryOptions,
      placeholder: "Select Type",
    },
    {
      name: "lab_id",
      label: "Location",
      type: "select",
      options: labOptions,
      placeholder: "Assign to Lab",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "available", label: "Operational" },
        { value: "unavailable", label: "Maintenance" },
        { value: "broken", label: "Broken" },
      ],
      placeholder: "Select Status",
    },
  ];
};
