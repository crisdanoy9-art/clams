import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

/**
 * FormModal — reusable modal driven by an API config object.
 *
 * Props:
 *   isOpen       boolean
 *   onClose      () => void
 *   onSubmit     (formData: object) => void
 *   title        string
 *   apiConfig    object  e.g. { lab_name: "text", total_stations: "number" }
 *   initialData  object  pre-fill for edit mode (optional)
 *   selectOptions object  { field_name: [{ label, value }] } for select fields
 */

const FIELD_LABELS = {
  lab_name: "Laboratory Name",
  room_number: "Room Number",
  building: "Building",
  total_stations: "Total Stations",
  category_name: "Category Name",
  asset_tag: "Asset Tag",
  item_name: "Item Name",
  category_id: "Category",
  brand: "Brand",
  model: "Model",
  serial_number: "Serial Number",
  specs: "Specifications",
  lab_id: "Laboratory",
  status: "Status",
  purchase_date: "Purchase Date",
  working_count: "Working Count",
  damaged_count: "Damaged Count",
  instructor_id: "Instructor ID",
  borrower_name: "Borrower Name",
  equipment_id: "Equipment",
  peripheral_id: "Peripheral",
  quantity: "Quantity",
  expected_return_date: "Expected Return Date",
  remarks: "Remarks",
  description: "Description",
  subject: "Subject",
  id_number: "ID Number",
  username: "Username",
  password_hash: "Password",
  first_name: "First Name",
  last_name: "Last Name",
  email: "Email Address",
  role: "Role",
};

const DEFAULT_SELECT_OPTIONS = {
  status: [
    { label: "Working", value: "working" },
    { label: "For Repair", value: "for_repair" },
    { label: "Retired", value: "retired" },
    { label: "Lost", value: "lost" },
  ],
  role: [
    { label: "Admin", value: "admin" },
    { label: "Instructor", value: "instructor" },
  ],
};

export default function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title = "Form",
  apiConfig = {},
  initialData = {},
  selectOptions = {},
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      const defaults = {};
      Object.keys(apiConfig).forEach((key) => {
        defaults[key] = initialData[key] ?? "";
      });
      setFormData(defaults);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const mergedSelectOptions = { ...DEFAULT_SELECT_OPTIONS, ...selectOptions };

  const renderField = (key, type) => {
    const label = FIELD_LABELS[key] || key.replace(/_/g, " ");
    const value = formData[key] ?? "";

    const baseInput =
      "w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition";

    return (
      <div key={key} className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">{label}</label>

        {type === "textarea" ? (
          <textarea
            rows={3}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className={`${baseInput} resize-none`}
          />
        ) : type === "select" ? (
          <select
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className={baseInput}
          >
            <option value="">Select {label}</option>
            {(mergedSelectOptions[key] || []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className={baseInput}
          />
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4 flex-1">
            {Object.entries(apiConfig).map(([key, type]) =>
              renderField(key, type),
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
