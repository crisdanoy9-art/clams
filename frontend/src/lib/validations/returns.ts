export const borrowFields = (
  usersData: any[] = [],
  peripheralsData: any[] = [],
) => {
  const instructorOptions = usersData.map((u) => ({
    value: u.user_id, // UUID — what gets stored in DB
    label: u.id_number, // id_number — what user sees in dropdown
  }));

  const itemOptions = peripheralsData.map((p) => ({
    value: p.item_name,
    label: `${p.item_name} — ${p.brand} (${p.working_count ?? 0} available)`,
  }));

  return [
    {
      name: "instructor_id",
      label: "Instructor ID",
      type: "select" as const,
      options: instructorOptions,
      placeholder: "Select Instructor ID",
      autoFills: "borrower_name",
      autoFillValue: (value: string) => {
        const user = usersData.find((u) => u.user_id === value);
        return user ? `${user.first_name} ${user.last_name}`.trim() : "";
      },
    },
    {
      name: "item_name",
      label: "Item Name",
      type: "select" as const,
      options: itemOptions,
      placeholder: "Select item from peripherals",
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number" as const,
      placeholder: "e.g., 1",
      min: 1,
    },
    {
      name: "borrower_name",
      label: "Borrower Name",
      type: "text" as const,
      placeholder: "Auto-filled from instructor",
      readOnly: true,
    },
    {
      name: "expected_return_date",
      label: "Expected Return Date",
      type: "date" as const,
      placeholder: "Select expected return date",
    },
  ];
};
