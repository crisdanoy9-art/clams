// frontend/src/pages/equipment.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Monitor,
  Edit,
  Trash2,
  Eye,
  Cpu,
  HardDrive,
  CircuitBoard,
  CheckCircle,
  AlertCircle,
  X,
  Save,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  working: "bg-emerald-50 text-emerald-700",
  for_repair: "bg-amber-50 text-amber-700",
  retired: "bg-slate-100 text-slate-500",
  lost: "bg-red-50 text-red-600",
};

const STATUS_LABELS = {
  working: "Working",
  for_repair: "For Repair",
  retired: "Retired",
  lost: "Lost",
};

const hasBadSpec = (specs) => {
  if (!specs) return false;
  let specsData = {};
  try {
    specsData = typeof specs === "string" ? JSON.parse(specs) : specs || {};
  } catch (e) {
    return false;
  }
  return (
    specsData.cpu_status === "bad" ||
    specsData.ram_status === "bad" ||
    specsData.storage_status === "bad" ||
    specsData.gpu_status === "bad"
  );
};

// Add Equipment Modal
function AddEquipmentModal({ laboratories, categories, onClose, onSave }) {
  const [formData, setFormData] = useState({
    asset_tag: "",
    item_name: "",
    brand: "",
    model: "",
    serial_number: "",
    category_id: "",
    lab_id: "",
    status: "working",
    purchase_date: "",
    cpu: "",
    cpu_status: "good",
    ram: "",
    ram_status: "good",
    storage: "",
    storage_status: "good",
    gpu: "",
    gpu_status: "good",
  });
  const [loading, setLoading] = useState(false);

  const updateSpecStatus = (component, status) => {
    setFormData((prev) => ({ ...prev, [`${component}_status`]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const specsString = JSON.stringify({
        cpu: formData.cpu,
        cpu_status: formData.cpu_status,
        ram: formData.ram,
        ram_status: formData.ram_status,
        storage: formData.storage,
        storage_status: formData.storage_status,
        gpu: formData.gpu,
        gpu_status: formData.gpu_status,
      });

      const submitData = {
        asset_tag: formData.asset_tag,
        item_name: formData.item_name,
        brand: formData.brand || null,
        model: formData.model || null,
        serial_number: formData.serial_number || null,
        category_id: formData.category_id
          ? parseInt(formData.category_id)
          : null,
        lab_id: formData.lab_id ? parseInt(formData.lab_id) : null,
        status: formData.status,
        purchase_date: formData.purchase_date || null,
        specs: specsString,
      };

      await axiosInstance.post("/create/equipment", { data: submitData });
      toast.success("Equipment added successfully");
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to add equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Add Equipment
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Asset Tag *
              </label>
              <input
                type="text"
                value={formData.asset_tag}
                onChange={(e) =>
                  setFormData({ ...formData, asset_tag: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Item Name *
              </label>
              <input
                type="text"
                value={formData.item_name}
                onChange={(e) =>
                  setFormData({ ...formData, item_name: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Serial Number
              </label>
              <input
                type="text"
                value={formData.serial_number}
                onChange={(e) =>
                  setFormData({ ...formData, serial_number: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Purchase Date
              </label>
              <input
                type="date"
                value={formData.purchase_date}
                onChange={(e) =>
                  setFormData({ ...formData, purchase_date: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Laboratory
              </label>
              <select
                value={formData.lab_id}
                onChange={(e) =>
                  setFormData({ ...formData, lab_id: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              >
                <option value="">Select Laboratory</option>
                {laboratories.map((lab) => (
                  <option key={lab.lab_id} value={lab.lab_id}>
                    {lab.lab_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              >
                <option value="working">Working</option>
                <option value="for_repair">For Repair</option>
                <option value="retired">Retired</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              Components Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu size={18} className="text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">
                      CPU
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("cpu", "good")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${formData.cpu_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      Good
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("cpu", "bad")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${formData.cpu_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                    >
                      Bad
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.cpu}
                  onChange={(e) =>
                    setFormData({ ...formData, cpu: e.target.value })
                  }
                  placeholder="CPU model"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CircuitBoard size={18} className="text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">
                      RAM
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("ram", "good")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${formData.ram_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      Good
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("ram", "bad")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${formData.ram_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                    >
                      Bad
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.ram}
                  onChange={(e) =>
                    setFormData({ ...formData, ram: e.target.value })
                  }
                  placeholder="RAM size"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <HardDrive size={18} className="text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">
                      Storage
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("storage", "good")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${formData.storage_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      Good
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("storage", "bad")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${formData.storage_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                    >
                      Bad
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.storage}
                  onChange={(e) =>
                    setFormData({ ...formData, storage: e.target.value })
                  }
                  placeholder="Storage info"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Monitor size={18} className="text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">
                      GPU
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("gpu", "good")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${formData.gpu_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      Good
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("gpu", "bad")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${formData.gpu_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                    >
                      Bad
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.gpu}
                  onChange={(e) =>
                    setFormData({ ...formData, gpu: e.target.value })
                  }
                  placeholder="GPU model"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-700 transition flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Add Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Equipment Modal
function EditEquipmentModal({
  equipment,
  laboratories,
  categories,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    asset_tag: "",
    item_name: "",
    brand: "",
    model: "",
    serial_number: "",
    category_id: "",
    lab_id: "",
    status: "working",
    purchase_date: "",
    cpu: "",
    cpu_status: "good",
    ram: "",
    ram_status: "good",
    storage: "",
    storage_status: "good",
    gpu: "",
    gpu_status: "good",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (equipment) {
      let specsData = {};
      try {
        specsData =
          typeof equipment.specs === "string"
            ? JSON.parse(equipment.specs)
            : equipment.specs || {};
      } catch (e) {}
      setFormData({
        asset_tag: equipment.asset_tag || "",
        item_name: equipment.item_name || "",
        brand: equipment.brand || "",
        model: equipment.model || "",
        serial_number: equipment.serial_number || "",
        category_id: equipment.category_id || "",
        lab_id: equipment.lab_id || "",
        status: equipment.status || "working",
        purchase_date: equipment.purchase_date
          ? equipment.purchase_date.split("T")[0]
          : "",
        cpu: specsData.cpu || "",
        cpu_status: specsData.cpu_status || "good",
        ram: specsData.ram || "",
        ram_status: specsData.ram_status || "good",
        storage: specsData.storage || "",
        storage_status: specsData.storage_status || "good",
        gpu: specsData.gpu || "",
        gpu_status: specsData.gpu_status || "good",
      });
    }
  }, [equipment]);

  const updateSpecStatus = (component, status) => {
    setFormData((prev) => ({ ...prev, [`${component}_status`]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const specsString = JSON.stringify({
        cpu: formData.cpu,
        cpu_status: formData.cpu_status,
        ram: formData.ram,
        ram_status: formData.ram_status,
        storage: formData.storage,
        storage_status: formData.storage_status,
        gpu: formData.gpu,
        gpu_status: formData.gpu_status,
      });

      const submitData = {
        asset_tag: formData.asset_tag,
        item_name: formData.item_name,
        brand: formData.brand || null,
        model: formData.model || null,
        serial_number: formData.serial_number || null,
        category_id: formData.category_id
          ? parseInt(formData.category_id)
          : null,
        lab_id: formData.lab_id ? parseInt(formData.lab_id) : null,
        status: formData.status,
        purchase_date: formData.purchase_date || null,
        specs: specsString,
      };

      await axiosInstance.put(`/update/equipment/${equipment.equipment_id}`, {
        data: submitData,
      });
      toast.success("Equipment updated successfully");
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Edit Equipment
            </h2>
            <p className="text-sm text-slate-500 font-mono">
              {equipment?.asset_tag}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Asset Tag
              </label>
              <input
                type="text"
                value={formData.asset_tag}
                onChange={(e) =>
                  setFormData({ ...formData, asset_tag: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Item Name
              </label>
              <input
                type="text"
                value={formData.item_name}
                onChange={(e) =>
                  setFormData({ ...formData, item_name: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Serial Number
              </label>
              <input
                type="text"
                value={formData.serial_number}
                onChange={(e) =>
                  setFormData({ ...formData, serial_number: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Purchase Date
              </label>
              <input
                type="date"
                value={formData.purchase_date}
                onChange={(e) =>
                  setFormData({ ...formData, purchase_date: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Laboratory
              </label>
              <select
                value={formData.lab_id}
                onChange={(e) =>
                  setFormData({ ...formData, lab_id: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              >
                <option value="">Select Laboratory</option>
                {laboratories.map((lab) => (
                  <option key={lab.lab_id} value={lab.lab_id}>
                    {lab.lab_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              >
                <option value="working">Working</option>
                <option value="for_repair">For Repair</option>
                <option value="retired">Retired</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              Components Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu size={18} />
                    <span className="text-sm font-medium">CPU</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("cpu", "good")}
                      className={`px-3 py-1 rounded-lg text-xs ${formData.cpu_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      Good
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("cpu", "bad")}
                      className={`px-3 py-1 rounded-lg text-xs ${formData.cpu_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                    >
                      Bad
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.cpu}
                  onChange={(e) =>
                    setFormData({ ...formData, cpu: e.target.value })
                  }
                  placeholder="CPU model"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CircuitBoard size={18} />
                    <span className="text-sm font-medium">RAM</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("ram", "good")}
                      className={`px-3 py-1 rounded-lg text-xs ${formData.ram_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      Good
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("ram", "bad")}
                      className={`px-3 py-1 rounded-lg text-xs ${formData.ram_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                    >
                      Bad
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.ram}
                  onChange={(e) =>
                    setFormData({ ...formData, ram: e.target.value })
                  }
                  placeholder="RAM size"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <HardDrive size={18} />
                    <span className="text-sm font-medium">Storage</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("storage", "good")}
                      className={`px-3 py-1 rounded-lg text-xs ${formData.storage_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      Good
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("storage", "bad")}
                      className={`px-3 py-1 rounded-lg text-xs ${formData.storage_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                    >
                      Bad
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.storage}
                  onChange={(e) =>
                    setFormData({ ...formData, storage: e.target.value })
                  }
                  placeholder="Storage info"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Monitor size={18} />
                    <span className="text-sm font-medium">GPU</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("gpu", "good")}
                      className={`px-3 py-1 rounded-lg text-xs ${formData.gpu_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      Good
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSpecStatus("gpu", "bad")}
                      className={`px-3 py-1 rounded-lg text-xs ${formData.gpu_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                    >
                      Bad
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.gpu}
                  onChange={(e) =>
                    setFormData({ ...formData, gpu: e.target.value })
                  }
                  placeholder="GPU model"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-700 transition flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({ equipment, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Delete Equipment
            </h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{equipment?.item_name}</span>?
          </p>
          <p className="text-sm text-slate-400 mt-1 font-mono">
            {equipment?.asset_tag}
          </p>
          <p className="text-xs text-red-500 mt-4">
            This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Specs Viewer Modal
function SpecsViewerModal({ equipment, onClose }) {
  if (!equipment) return null;

  let specsData = {};
  try {
    specsData =
      typeof equipment.specs === "string"
        ? JSON.parse(equipment.specs)
        : equipment.specs || {};
  } catch (e) {}

  const isHealthy = !hasBadSpec(equipment.specs);

  const SpecRow = ({ icon: Icon, label, value, status }) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-slate-500" />
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-xs text-slate-500">{value || "N/A"}</span>
      </div>
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${status === "good" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
      >
        {status === "good" ? (
          <CheckCircle size={12} />
        ) : (
          <AlertCircle size={12} />
        )}
        {status === "good" ? "Good" : "Bad"}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Equipment Specifications
            </h2>
            <p className="text-sm text-slate-500 font-mono">
              {equipment.asset_tag}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Item Name
              </label>
              <p className="text-base font-semibold text-slate-900 mt-1">
                {equipment.item_name}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Overall Status
              </label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isHealthy ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                >
                  {isHealthy ? (
                    <CheckCircle size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )}
                  {isHealthy ? "Healthy" : "Has Issues"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Brand
              </label>
              <p className="text-sm text-slate-700 mt-1">
                {equipment.brand || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Model
              </label>
              <p className="text-sm text-slate-700 mt-1">
                {equipment.model || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-3 block">
              Components Status
            </label>
            <div className="space-y-2">
              <SpecRow
                icon={Cpu}
                label="CPU"
                value={specsData.cpu}
                status={specsData.cpu_status}
              />
              <SpecRow
                icon={CircuitBoard}
                label="RAM"
                value={specsData.ram}
                status={specsData.ram_status}
              />
              <SpecRow
                icon={HardDrive}
                label="Storage"
                value={specsData.storage}
                status={specsData.storage_status}
              />
              <SpecRow
                icon={Monitor}
                label="GPU"
                value={specsData.gpu}
                status={specsData.gpu_status}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Serial Number
              </label>
              <p className="text-sm font-mono mt-1">
                {equipment.serial_number || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Purchase Date
              </label>
              <p className="text-sm mt-1">
                {equipment.purchase_date
                  ? new Date(equipment.purchase_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Laboratory
              </label>
              <p className="text-sm mt-1">{equipment.lab_name || "N/A"}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Category
              </label>
              <p className="text-sm mt-1">{equipment.category_name || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Equipment Component
export default function Equipment({ userRole }) {
  const [equipment, setEquipment] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [equipmentRes, labsRes, categoriesRes] = await Promise.all([
        axiosInstance.get("/inventory"),
        axiosInstance.get("/laboratories"),
        axiosInstance.get("/categories"),
      ]);
      setEquipment(equipmentRes.data || []);
      setLaboratories(labsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      toast.error("Failed to load equipment data");
    } finally {
      setLoading(false);
    }
  };

  const filtered = equipment.filter((e) => {
    const matchSearch =
      e.item_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.asset_tag?.toLowerCase().includes(search.toLowerCase()) ||
      e.brand?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getOverallStatusColor = (item) => {
    if (hasBadSpec(item.specs)) return "bg-red-500";
    if (item.status === "working") return "bg-green-500";
    if (item.status === "for_repair") return "bg-amber-500";
    return "bg-slate-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Equipment</h1>
          <p className="text-sm text-slate-500 mt-1">
            {equipment.length} assets total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="working">Working</option>
            <option value="for_repair">For Repair</option>
            <option value="retired">Retired</option>
            <option value="lost">Lost</option>
          </select>
          {userRole === "admin" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition"
            >
              <Plus size={16} /> Add Equipment
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Asset Tag
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Item
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Brand / Model
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Laboratory
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Purchase Date
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((item) => (
                <tr
                  key={item.equipment_id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                    {item.asset_tag}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${getOverallStatusColor(item)}`}
                      />
                      <span className="font-medium text-slate-800">
                        {item.item_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.brand} {item.model}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.category_name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.lab_name || "Unknown Lab"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[item.status]}`}
                    >
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {item.purchase_date
                      ? new Date(item.purchase_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  {userRole === "admin" && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setViewItem(item);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditItem(item);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteItem(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <AddEquipmentModal
          laboratories={laboratories}
          categories={categories}
          onClose={() => setIsAddModalOpen(false)}
          onSave={fetchData}
        />
      )}

      {isEditModalOpen && editItem && (
        <EditEquipmentModal
          equipment={editItem}
          laboratories={laboratories}
          categories={categories}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditItem(null);
          }}
          onSave={fetchData}
        />
      )}

      {isViewModalOpen && viewItem && (
        <SpecsViewerModal
          equipment={viewItem}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewItem(null);
          }}
        />
      )}

      {isDeleteModalOpen && deleteItem && (
        <DeleteConfirmModal
          equipment={deleteItem}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteItem(null);
          }}
          onConfirm={async () => {
            await axiosInstance.delete(
              `/remove/equipment/${deleteItem.equipment_id}`,
            );
            toast.success("Equipment deleted");
            fetchData();
            setIsDeleteModalOpen(false);
            setDeleteItem(null);
          }}
        />
      )}
    </div>
  );
}
