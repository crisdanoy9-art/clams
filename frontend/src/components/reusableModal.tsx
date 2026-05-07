import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import api from "../lib/axios";

interface Props {
  fields: any[];
  table: string;
  onClose: () => void;
  onSuccess: (formData?: any) => void; // passes submitted data back
}

export const AddModal = ({ fields, table, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (path: string, value: any, field?: any) => {
    setFormData((prev) => {
      const keys = path.split(".");
      let next: Record<string, any>;

      if (keys.length === 1) {
        next = { ...prev, [path]: value };
      } else {
        const [parent, child] = keys;
        next = {
          ...prev,
          [parent]: {
            ...(prev[parent] || {}),
            [child]: value,
          },
        };
      }

      // Auto-fill target field using autoFillValue fn if provided, else label
      if (field?.autoFills) {
        if (field.autoFillValue) {
          next[field.autoFills] = field.autoFillValue(value);
        } else {
          const selectedOption = field.options?.find(
            (opt: any) => String(opt.value) === String(value),
          );
          if (selectedOption) {
            next[field.autoFills] = selectedOption.label;
          }
        }
      }

      return next;
    });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await api.post(`http://localhost:3000/api/${table}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Pass formData back so parent can do post-submit logic (e.g. deduct stock)
      onSuccess(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const renderField = (k: any, parentName?: string) => {
    const fieldName = parentName ? `${parentName}.${k.name}` : k.name;

    if (k.type === "group") {
      return (
        <div
          key={k.name}
          className="col-span-2 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-2"
        >
          <p className="col-span-2 text-[11px] font-black text-indigo-600 uppercase mb-1">
            {k.label}
          </p>
          {k.fields.map((subField: any) => renderField(subField, k.name))}
        </div>
      );
    }

    return (
      <div key={fieldName} className="col-span-1">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
          {k.label}
        </label>
        {k.type === "select" ? (
          <select
            disabled={isLoading}
            defaultValue=""
            required
            onChange={(e) => handleChange(fieldName, e.target.value, k)}
            className="w-full border border-zinc-300 rounded-md px-4 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 appearance-none cursor-pointer"
          >
            <option value="" disabled>
              {k.placeholder}
            </option>
            {k.options?.map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={k.type}
            disabled={isLoading}
            placeholder={k.placeholder}
            readOnly={k.readOnly}
            value={k.readOnly ? (formData[k.name] ?? "") : undefined}
            onChange={(e) => {
              if (k.readOnly) return;
              const val =
                k.type === "number"
                  ? parseInt(e.target.value) || 0
                  : e.target.value;
              handleChange(fieldName, val);
            }}
            className={`w-full border border-zinc-300 rounded-md px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 ${
              k.readOnly ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""
            }`}
          />
        )}
      </div>
    );
  };

  const isLargeForm =
    fields.length > 5 || fields.some((f) => f.type === "group");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-none">
      <div
        className={`relative bg-white w-full rounded-md shadow-2xl p-8 max-h-[90vh] overflow-y-auto animate-[drop_0.4s_ease-out] ${
          isLargeForm ? "max-w-2xl" : "max-w-md"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            Add New {table.endsWith("s") ? table.slice(0, -1) : table}
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
          {fields.map((field) => renderField(field))}
          <button
            type="submit"
            disabled={isLoading}
            className="col-span-2 w-full py-3 mt-6 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Confirm Create"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
