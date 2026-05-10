// frontend/src/config/configUIForms.js

// 1. LABORATORIES
export const LabApi = {
  lab_name: "text",
  room_number: "text",
  building: "text",
  total_stations: "number",
};

// 2. CATEGORIES
export const CategoryApi = {
  category_name: "text",
};

// 3. EQUIPMENT
export const EquipmentApi = {
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

// 4. PERIPHERALS - Can be assigned to Lab OR Equipment
export const PeripheralApi = {
  item_name: "text",
  category_id: "select",
  brand: "text",
  lab_id: "select",
  equipment_id: "select", // NEW: can assign to specific PC
  working_count: "number",
  damaged_count: "number",
};

// 5. BORROW TRANSACTIONS
export const TransactionApi = {
  borrower_name: "text",
  equipment_id: "select",
  peripheral_id: "select",
  quantity: "number",
  expected_return_date: "datetime-local",
  remarks: "textarea",
};

// 6. DAMAGE REPORTS
export const DamageReportApi = {
  equipment_id: "select",
  subject: "text",
  description: "textarea",
};

// 7. USERS
export const UserApi = {
  id_number: "text",
  username: "text",
  first_name: "text",
  last_name: "text",
  email: "email",
  role: "select",
};

export const SELECT_OPTIONS_CONFIG = {
  status: [
    { label: "Working", value: "working" },
    { label: "For Repair", value: "for_repair" },
  ],
  role: [
    { label: "Admin", value: "admin" },
    { label: "Instructor", value: "instructor" },
  ],
  transaction_status: [
    { label: "Borrowed", value: "borrowed" },
    { label: "Returned", value: "returned" },
    { label: "Pending", value: "pending" },
  ],
  report_status: [
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in_progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Rejected", value: "rejected" },
  ],
};
