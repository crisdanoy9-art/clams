import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../lib/axios";

interface Props {
  fields: any; // dynamic data input
  table: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddModal = ({ fields, table, onClose, onSuccess }: Props) => {
  // Initialize formData with default "instructor" if the table is users
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    if (table === "users") {
      return { role: "instructor" };
    }
    return {};
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
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

      await api.post(`http://localhost:3000/api/${table}`, payload, {
        headers,
      });

      onSuccess?.();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-none"
      ></div>
      <div className="relative bg-white w-full max-w-2xl rounded-md shadow-2xl p-8 animate-[drop_0.6s_cubic-bezier(0.34,1.56,0.64,1)]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              Add New {table === "users" ? "user" : table}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              General Information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-5 gap-y-4">
          {fields.map((k: any) => {
            const isFullWidth =
              k.name === "item_name" ||
              k.name === "specs" ||
              k.name === "description" ||
              k.name === "remarks" ||
              (table === "users" && k.name === "role");

            const isRoleSelect = table === "users" && k.name === "role";

            return (
              <div
                key={k.name}
                className={isFullWidth ? "col-span-2" : "col-span-1"}
              >
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  {k.label}
                </label>

                {isRoleSelect ? (
                  <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200">
                    {k.options?.map((opt: any) => {
                      const isActive = formData[k.name] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleChange(k.name, opt.value)}
                          className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${
                            isActive
                              ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : k.type === "select" ? (
                  <div className="relative">
                    <select
                      disabled={isLoading}
                      value={formData[k.name] || ""}
                      onChange={(e) => handleChange(k.name, e.target.value)}
                      className="w-full border border-slate-200 rounded-md px-4 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 appearance-none cursor-pointer"
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <input
                    type={k.type}
                    disabled={isLoading}
                    placeholder={k.placeholder}
                    value={formData[k.name] || ""}
                    onChange={(e) => {
                      const val =
                        k.type === "number"
                          ? parseInt(e.target.value) || 0
                          : e.target.value;
                      handleChange(k.name, val);
                    }}
                    className="w-full border border-slate-200 rounded-md px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 placeholder:text-slate-300"
                  />
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={isLoading}
            className="col-span-2 w-full py-4 mt-2 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing...
              </>
            ) : (
              `Create New ${table === "users" ? "User" : table}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
