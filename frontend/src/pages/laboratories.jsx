// frontend/src/pages/laboratories.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Monitor,
  Search,
  X,
  Edit2,
  Save,
  Cpu,
  HardDrive,
  CircuitBoard,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

// ======================== Helper ========================
const hasBadSpec = (specs) => {
  if (!specs) return false;
  let specsData = {};
  try {
    specsData = typeof specs === "string" ? JSON.parse(specs) : specs || {};
  } catch {
    return false;
  }
  return (
    specsData.cpu_status === "bad" ||
    specsData.ram_status === "bad" ||
    specsData.storage_status === "bad" ||
    specsData.gpu_status === "bad"
  );
};

// ======================== PC Icon ========================
const PCIcon = ({ status }) => {
  const colors = {
    available: { body: "#22c55e", screen: "#bbf7d0", stand: "#16a34a" },
    under_maintenance: { body: "#eab308", screen: "#fef9c3", stand: "#ca8a04" },
    unavailable: { body: "#ef4444", screen: "#fecaca", stand: "#dc2626" },
  };
  const c = colors[status] || colors.available;
  return (
    <svg viewBox="0 0 48 52" width="48" height="52">
      <rect x="4" y="2" width="40" height="30" rx="4" fill={c.body} />
      <rect x="8" y="6" width="32" height="22" rx="2" fill={c.screen} />
      <rect x="21" y="32" width="6" height="8" rx="1" fill={c.stand} />
      <rect x="13" y="40" width="22" height="4" rx="2" fill={c.stand} />
      <circle cx="24" cy="29" r="1.5" fill={c.stand} />
    </svg>
  );
};

// ======================== Edit Spec Modal ========================
function EditSpecModal({ equipment, onClose, onSave }) {
  const [specs, setSpecs] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const specsData =
        typeof equipment.specs === "string"
          ? JSON.parse(equipment.specs)
          : equipment.specs || {};
      setSpecs(specsData);
    } catch {}
  }, [equipment]);

  const updateSpecValue = (field, value) =>
    setSpecs((prev) => ({ ...prev, [field]: value }));
  const updateSpecStatus = (component, status) =>
    setSpecs((prev) => ({ ...prev, [`${component}_status`]: status }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`/update/equipment/${equipment.equipment_id}`, {
        data: { specs: JSON.stringify(specs) },
      });
      toast.success("Equipment specs updated");
      onSave();
      onClose();
    } catch {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between">
          <div>
            <h2 className="text-lg font-semibold">Edit Equipment</h2>
            <p className="text-xs text-slate-500">
              {equipment.item_name} · {equipment.asset_tag}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* CPU */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-medium text-slate-600">CPU</label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSpecStatus("cpu", "good")}
                  className={`px-2 py-0.5 rounded text-xs ${specs.cpu_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                >
                  Good
                </button>
                <button
                  onClick={() => updateSpecStatus("cpu", "bad")}
                  className={`px-2 py-0.5 rounded text-xs ${specs.cpu_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                >
                  Bad
                </button>
              </div>
            </div>
            <input
              type="text"
              value={specs.cpu || ""}
              onChange={(e) => updateSpecValue("cpu", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              placeholder="CPU model"
            />
          </div>
          {/* RAM */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-medium text-slate-600">RAM</label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSpecStatus("ram", "good")}
                  className={`px-2 py-0.5 rounded text-xs ${specs.ram_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                >
                  Good
                </button>
                <button
                  onClick={() => updateSpecStatus("ram", "bad")}
                  className={`px-2 py-0.5 rounded text-xs ${specs.ram_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                >
                  Bad
                </button>
              </div>
            </div>
            <input
              type="text"
              value={specs.ram || ""}
              onChange={(e) => updateSpecValue("ram", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              placeholder="RAM size"
            />
          </div>
          {/* Storage */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-medium text-slate-600">
                Storage
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSpecStatus("storage", "good")}
                  className={`px-2 py-0.5 rounded text-xs ${specs.storage_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                >
                  Good
                </button>
                <button
                  onClick={() => updateSpecStatus("storage", "bad")}
                  className={`px-2 py-0.5 rounded text-xs ${specs.storage_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                >
                  Bad
                </button>
              </div>
            </div>
            <input
              type="text"
              value={specs.storage || ""}
              onChange={(e) => updateSpecValue("storage", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              placeholder="Storage info"
            />
          </div>
          {/* GPU */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-medium text-slate-600">GPU</label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSpecStatus("gpu", "good")}
                  className={`px-2 py-0.5 rounded text-xs ${specs.gpu_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
                >
                  Good
                </button>
                <button
                  onClick={() => updateSpecStatus("gpu", "bad")}
                  className={`px-2 py-0.5 rounded text-xs ${specs.gpu_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 text-red-600"}`}
                >
                  Bad
                </button>
              </div>
            </div>
            <input
              type="text"
              value={specs.gpu || ""}
              onChange={(e) => updateSpecValue("gpu", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              placeholder="GPU model"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-700 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================== PCSpecsSidebar (with coloured peripheral pills) ========================
function PCSpecsSidebar({ equipment, lab, onClose, onEdit, userRole }) {
  if (!equipment) return null;

  let specsData = {};
  try {
    specsData =
      typeof equipment.specs === "string"
        ? JSON.parse(equipment.specs)
        : equipment.specs || {};
  } catch {}

  const isAvailable = !hasBadSpec(equipment.specs);
  const statusLabel = isAvailable ? "Available" : "Unavailable";
  const statusColor = isAvailable
    ? "bg-emerald-50 text-emerald-600"
    : "bg-red-50 text-red-600";

  // Peripheral logic
  const [attachedPeripherals, setAttachedPeripherals] = useState([]);
  const [availableStock, setAvailableStock] = useState([]);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [selectedPeripheralId, setSelectedPeripheralId] = useState("");
  const [attachLoading, setAttachLoading] = useState(false);

  const REQUIRED_CATEGORIES = ["Keyboard", "Mouse", "Monitor", "Headset"];
  const getPeripheralCategory = (p) => p.category_name || "Uncategorized";
  const attachedCategories = attachedPeripherals.map(getPeripheralCategory);
  const nextMissingCategory = REQUIRED_CATEGORIES.find(
    (cat) => !attachedCategories.includes(cat),
  );
  const allCategoriesFilled = !nextMissingCategory;
  const filteredStock = availableStock.filter(
    (p) => getPeripheralCategory(p) === nextMissingCategory,
  );

  const fetchPeripherals = async () => {
    try {
      const [attachedRes, stockRes] = await Promise.all([
        axiosInstance.get(`/equipment/${equipment.equipment_id}/peripherals`),
        axiosInstance.get(`/peripherals/stock/${lab.lab_id}`),
      ]);
      setAttachedPeripherals(attachedRes.data || []);
      setAvailableStock(stockRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load peripherals");
    }
  };

  useEffect(() => {
    fetchPeripherals();
  }, [equipment]);

  const handleAttach = async () => {
    if (!selectedPeripheralId) return;
    setAttachLoading(true);
    try {
      await axiosInstance.post(
        `/equipment/${equipment.equipment_id}/attach-peripheral`,
        {
          data: { peripheral_id: selectedPeripheralId },
        },
      );
      toast.success("Peripheral attached");
      await fetchPeripherals();
      setShowAttachModal(false);
      setSelectedPeripheralId("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to attach");
    } finally {
      setAttachLoading(false);
    }
  };

  const handleDetach = async (peripheralId) => {
    if (!window.confirm("Detach this peripheral from the PC?")) return;
    try {
      await axiosInstance.post(
        `/equipment/${equipment.equipment_id}/detach-peripheral`,
        {
          data: { peripheral_id: peripheralId },
        },
      );
      toast.success("Peripheral detached");
      await fetchPeripherals();
    } catch {
      toast.error("Failed to detach");
    }
  };

  const handleReplace = async (oldId, newId) => {
    try {
      await axiosInstance.post(
        `/equipment/${equipment.equipment_id}/detach-peripheral`,
        {
          data: { peripheral_id: oldId },
        },
      );
      await axiosInstance.post(
        `/equipment/${equipment.equipment_id}/attach-peripheral`,
        {
          data: { peripheral_id: newId },
        },
      );
      toast.success("Peripheral replaced");
      await fetchPeripherals();
    } catch {
      toast.error("Failed to replace");
    }
  };

  const handleStatusChange = async (peripheralId, newStatus) => {
    try {
      await axiosInstance.put(`/peripherals/${peripheralId}/status`, {
        data: { status: newStatus },
      });
      toast.success(`Status changed to ${newStatus}`);
      await fetchPeripherals();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const getPillStyles = (status) => {
    if (status === "working")
      return "bg-emerald-50 border-emerald-200 text-emerald-700";
    return "bg-red-50 border-red-200 text-red-700";
  };

  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col animate-slide-in-right">
      <div className="p-6 border-b border-slate-100 flex justify-between">
        <div>
          <h3 className="text-lg font-bold">{equipment.item_name}</h3>
          <p className="text-sm text-slate-500">{lab?.lab_name}</p>
          <p className="text-xs font-mono">{equipment.asset_tag}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-slate-100"
            title="Edit Specs"
          >
            <Edit2 size={18} className="text-slate-500" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>

        {(equipment.brand || equipment.model) && (
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Brand / Model
            </label>
            <p className="text-sm text-slate-700 mt-1">
              {equipment.brand} {equipment.model}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700">CPU</span>
            <div className="flex gap-3">
              <span className="text-sm text-slate-500">
                {specsData.cpu || "N/A"}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${specsData.cpu_status === "good" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
              >
                {specsData.cpu_status === "good" ? "Good" : "Bad"}
              </span>
            </div>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700">RAM</span>
            <div className="flex gap-3">
              <span className="text-sm text-slate-500">
                {specsData.ram || "N/A"}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${specsData.ram_status === "good" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
              >
                {specsData.ram_status === "good" ? "Good" : "Bad"}
              </span>
            </div>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700">Storage</span>
            <div className="flex gap-3">
              <span className="text-sm text-slate-500">
                {specsData.storage || "N/A"}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${specsData.storage_status === "good" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
              >
                {specsData.storage_status === "good" ? "Good" : "Bad"}
              </span>
            </div>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700">GPU</span>
            <div className="flex gap-3">
              <span className="text-sm text-slate-500">
                {specsData.gpu || "N/A"}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${specsData.gpu_status === "good" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
              >
                {specsData.gpu_status === "good" ? "Good" : "Bad"}
              </span>
            </div>
          </div>
        </div>

        {equipment.serial_number && (
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Serial Number
            </label>
            <p className="text-sm font-mono text-slate-600 mt-1">
              {equipment.serial_number}
            </p>
          </div>
        )}

        {userRole === "admin" && (
          <div className="border-t border-slate-100 pt-4 mt-4">
            <h4 className="text-sm font-semibold mb-2">Peripherals</h4>
            {!allCategoriesFilled ? (
              <div className="mb-3">
                <p className="text-xs text-slate-500 mb-2">
                  Next needed:{" "}
                  <span className="font-medium text-indigo-600">
                    {nextMissingCategory}
                  </span>
                </p>
                <button
                  onClick={() => setShowAttachModal(true)}
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition flex items-center gap-1"
                >
                  <Plus size={12} /> Add {nextMissingCategory}
                </button>
              </div>
            ) : (
              <p className="text-xs text-emerald-600 mb-2">
                ✓ All required peripherals attached
              </p>
            )}

            {attachedPeripherals.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {attachedPeripherals.map((p) => {
                  const category = getPeripheralCategory(p);
                  const replaceOptions = availableStock.filter(
                    (s) =>
                      getPeripheralCategory(s) === category &&
                      s.peripheral_id !== p.peripheral_id,
                  );
                  return (
                    <div
                      key={p.peripheral_id}
                      className={`rounded-full border px-3 py-1.5 flex items-center gap-2 shadow-sm ${getPillStyles(p.status)}`}
                    >
                      <span className="text-sm font-medium">{p.item_name}</span>
                      <select
                        value={p.status}
                        onChange={(e) =>
                          handleStatusChange(p.peripheral_id, e.target.value)
                        }
                        className="text-xs border-0 bg-transparent focus:ring-0 font-medium"
                      >
                        <option value="working" className="text-emerald-700">
                          Working
                        </option>
                        <option value="damaged" className="text-red-700">
                          Damaged
                        </option>
                      </select>
                      {allCategoriesFilled && replaceOptions.length > 0 && (
                        <select
                          onChange={(e) =>
                            handleReplace(p.peripheral_id, e.target.value)
                          }
                          className="text-xs border border-slate-200 rounded px-1 py-0.5 bg-white text-slate-600"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Replace
                          </option>
                          {replaceOptions.map((opt) => (
                            <option
                              key={opt.peripheral_id}
                              value={opt.peripheral_id}
                            >
                              {opt.item_name}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        onClick={() => handleDetach(p.peripheral_id)}
                        className="text-red-400 hover:text-red-600"
                        title="Detach"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attach Modal */}
      {showAttachModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-96 p-6 border border-slate-100 shadow-xl">
            <h3 className="text-base font-semibold mb-4">
              Add {nextMissingCategory}
            </h3>
            <select
              value={selectedPeripheralId}
              onChange={(e) => setSelectedPeripheralId(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2 mb-4 text-sm"
            >
              <option value="">Select a {nextMissingCategory}</option>
              {filteredStock.map((p) => (
                <option key={p.peripheral_id} value={p.peripheral_id}>
                  {p.item_name} ({p.brand || "no brand"}) – {p.status}
                </option>
              ))}
            </select>
            {filteredStock.length === 0 && (
              <p className="text-xs text-red-500 mb-2">
                No {nextMissingCategory} available in stock.
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAttachModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAttach}
                disabled={
                  attachLoading ||
                  !selectedPeripheralId ||
                  filteredStock.length === 0
                }
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm disabled:opacity-50"
              >
                {attachLoading ? "Attaching..." : "Attach"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ======================== LabStationModal ========================
function LabStationModal({ lab, onClose, userRole }) {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, [lab]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/inventory");
      const labEquipment = response.data.filter(
        (item) => item.lab_name === lab.lab_name,
      );
      setInventory(labEquipment);
    } catch {
      toast.error("Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  const stations = inventory.map((eq, index) => ({
    id: index + 1,
    status: hasBadSpec(eq.specs) ? "unavailable" : "available",
    equipment: eq,
  }));

  const total = stations.length;
  const available = stations.filter((s) => s.status === "available").length;
  const unavailable = stations.filter((s) => s.status === "unavailable").length;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-8">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col z-10 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold">{lab.lab_name}</h2>
            <p className="text-sm text-slate-500">
              {lab.building} · Room {lab.room_number}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-green-500" /> Available (
                {available})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-red-500" /> Unavailable (
                {unavailable})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 shrink-0">
          <div className="px-6 py-4 text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-slate-400">Total Equipment</p>
          </div>
          <div className="px-6 py-4 text-center">
            <p className="text-2xl font-bold text-green-600">{available}</p>
            <p className="text-xs text-slate-400">Available (Green)</p>
          </div>
          <div className="px-6 py-4 text-center">
            <p className="text-2xl font-bold text-red-600">{unavailable}</p>
            <p className="text-xs text-slate-400">Unavailable (Red)</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-4">
            {stations.map((station) => (
              <div
                key={station.id}
                className="flex flex-col items-center gap-2 cursor-pointer group hover:scale-105 transition"
                onClick={() => setSelectedEquipment(station.equipment)}
              >
                <PCIcon status={station.status} />
                <span className="text-xs font-medium text-slate-500">
                  {station.equipment?.asset_tag ||
                    `PC ${String(station.id).padStart(2, "0")}`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {station.status === "available" ? "Ready" : "Offline"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {selectedEquipment && (
          <PCSpecsSidebar
            equipment={selectedEquipment}
            lab={lab}
            onClose={() => setSelectedEquipment(null)}
            onEdit={() => {
              setEditingEquipment(selectedEquipment);
              setSelectedEquipment(null);
            }}
            userRole={userRole}
          />
        )}

        {editingEquipment && (
          <EditSpecModal
            equipment={editingEquipment}
            onClose={() => setEditingEquipment(null)}
            onSave={() => {
              fetchInventory();
              setEditingEquipment(null);
            }}
          />
        )}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

// ======================== Lab Card ========================
function LabCard({ lab, onClick }) {
  // total_stations is still in the lab object but we won't show it in the card UI
  // The card shows lab name and location only, as in original design.
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 p-6 text-left hover:border-slate-300 hover:shadow-md transition w-full group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Monitor size={20} className="text-indigo-600" />
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
          Active
        </span>
      </div>
      <h3 className="text-base font-semibold text-slate-800">{lab.lab_name}</h3>
      <p className="text-sm text-slate-400 mt-0.5">
        {lab.building} · Room {lab.room_number}
      </p>
      <p className="text-xs text-indigo-500 font-medium mt-4 group-hover:underline">
        View station map →
      </p>
    </button>
  );
}

// ======================== Add Laboratory Modal (no total_stations field) ========================
function AddLabModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    lab_name: "",
    room_number: "",
    building: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lab_name.trim()) {
      toast.error("Laboratory name is required");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/create/laboratories", {
        data: {
          lab_name: formData.lab_name,
          room_number: formData.room_number || null,
          building: formData.building || null,
          total_stations: 0, // will be updated when equipment is added
        },
      });
      toast.success("Laboratory added");
      onSave();
      onClose();
    } catch {
      toast.error("Failed to add laboratory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between">
          <h2 className="text-lg font-semibold">Add Laboratory</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Lab Name *
            </label>
            <input
              type="text"
              value={formData.lab_name}
              onChange={(e) =>
                setFormData({ ...formData, lab_name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Room Number
            </label>
            <input
              type="text"
              value={formData.room_number}
              onChange={(e) =>
                setFormData({ ...formData, room_number: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Building
            </label>
            <input
              type="text"
              value={formData.building}
              onChange={(e) =>
                setFormData({ ...formData, building: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-700 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Add Lab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ======================== Main Laboratories Component ========================
export default function Laboratories({ userRole }) {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/laboratories");
      setLabs(response.data || []);
    } catch {
      toast.error("Failed to load laboratories");
    } finally {
      setLoading(false);
    }
  };

  const filtered = labs.filter(
    (l) =>
      l.lab_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.room_number?.includes(search),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Laboratories</h1>
          <p className="text-sm text-slate-500">
            {labs.length} labs registered
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search labs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl w-56"
            />
          </div>
          {userRole === "admin" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700"
            >
              <Plus size={16} /> Add Lab
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((lab) => (
          <LabCard
            key={lab.lab_id}
            lab={lab}
            onClick={() => setSelectedLab(lab)}
          />
        ))}
      </div>

      {selectedLab && (
        <LabStationModal
          lab={selectedLab}
          onClose={() => setSelectedLab(null)}
          userRole={userRole}
        />
      )}

      {showAddModal && (
        <AddLabModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            fetchLabs();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
