/**
 * CLAMS FORM API CONFIGURATION
 * Maps database columns to UI input types.
 */

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
  category_id: "select", // References clams.categories
  brand: "text",
  model: "text",
  serial_number: "text",
  specs: "textarea", // Using textarea because it's JSONB in your SQL
  lab_id: "select", // References clams.laboratories
  status: "select", // Options: working, for_repair, retired, lost
  purchase_date: "date",
};

// 4. PERIPHERALS
export const PeripheralApi = {
  item_name: "text",
  category_id: "select",
  brand: "text",
  lab_id: "select",
  working_count: "number",
  damaged_count: "number",
};

// 5. BORROW TRANSACTIONS
export const TransactionApi = {
  instructor_id: "text", // This will hold the UUID string
  borrower_name: "text",
  equipment_id: "select",
  peripheral_id: "select",
  quantity: "number",
  status: "select", // Options: borrowed, returned, pending
  expected_return_date: "datetime-local",
  remarks: "textarea",
};

// 6. DAMAGE REPORTS
export const DamageReportApi = {
  instructor_id: "text", // UUID
  equipment_id: "select",
  subject: "text",
  description: "textarea",
  status: "select", // Options: open, pending, resolved
};

// 7. USERS
export const UserApi = {
  id_number: "text",
  username: "text",
  password_hash: "password", // Use 'password' for masked input
  first_name: "text",
  last_name: "text",
  email: "email",
  role: "select", // Options: admin, instructor
};
