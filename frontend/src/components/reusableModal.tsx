import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import api from "../lib/axios";

interface Props {
  fields: any; // dynamic data input
  table: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddModal = ({ fields, table, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    onClose();
    try {
      const token = localStorage.getItem("token");
      const hasFile = fields.some((k: any) => k.type === "file");

      let payload: any;
      let headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };

      if (hasFile) {
        const fd = new FormData();
        Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
        payload = fd;
      } else {
        payload = formData;
        headers["Content-Type"] = "application/json";
      }
      const res = await api.post(
        `http://localhost:3000/api/${table}`,
        payload,
        { headers },
      );
      onSuccess?.();
      onClose();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-none"
        ></div>
        <div
          className={`relative bg-white w-full rounded-md shadow-2xl p-8 animate-[drop_0.6s_cubic-bezier(0.34,1.56,0.64,1)] ${
            table === "equipment" ? "max-w-2xl" : "max-w-md"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              Add New{" "}
              {table === "users" ? table.replace(/users/, "user") : table}
            </h3>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={onSubmit}
            className={`grid gap-x-6 gap-y-4 ${table === "equipment" ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {fields.map((k: any) => {
              // Per your layout, Item Name and Specs should take full width
              const isLongField = k.name === "item_name" || k.name === "specs";

              return (
                <div
                  key={k.name}
                  className={`${table === "equipment" && isLongField ? "col-span-2" : "col-span-1"}`}
                >
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    {k.label}
                  </label>

                  {k.type === "select" ? (
                    <select
                      disabled={isLoading}
                      defaultValue=""
                      onChange={(e) => handleChange(k.name, e.target.value)}
                      className="w-full border border-zinc-300 rounded-md px-4 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        {k.placeholder}
                      </option>
                      {/* This handles status, category, and laboratory options */}
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
                      onChange={(e) => {
                        const val =
                          k.type === "number"
                            ? parseInt(e.target.value) || 0
                            : e.target.value;
                        handleChange(k.name, val);
                      }}
                      className="w-full border border-zinc-300 rounded-md px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                    />
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              disabled={isLoading}
              className={`${table === "equipment" ? "col-span-2" : ""} w-full py-3 mt-4 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Creating...
                </>
              ) : (
                `Create ${table}`
              )}
            </button>
          </form>
        </div>{" "}
      </div>
    </>
  );
};
