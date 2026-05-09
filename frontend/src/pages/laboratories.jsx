// frontend/src/pages/laboratories.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Monitor,
  Search,
  X,
  Edit2,
  Save,
  XCircle,
  Cpu,
  HardDrive,
  CircuitBoard,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

// Station PC icon
const PCIcon = ({ status }) => {
  const colors = {
    available: { body: "#22c55e", screen: "#bbf7d0", stand: "#16a34a" },
    under_maintenance: { body: "#eab308", screen: "#fef9c3", stand: "#ca8a04" },
    unavailable: { body: "#ef4444", screen: "#fecaca", stand: "#dc2626" },
  };
  const c = colors[status] || colors.available;
  return (
    <svg
      viewBox="0 0 48 52"
      width="48"
      height="52"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="2" width="40" height="30" rx="4" fill={c.body} />
      <rect x="8" y="6" width="32" height="22" rx="2" fill={c.screen} />
      <rect x="21" y="32" width="6" height="8" rx="1" fill={c.stand} />
      <rect x="13" y="40" width="22" height="4" rx="2" fill={c.stand} />
      <circle cx="24" cy="29" r="1.5" fill={c.stand} />
    </svg>
  );
};

// Check if equipment has any bad specs
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

// Edit Spec Modal - Clean design matching your theme
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
    } catch (e) {}
  }, [equipment]);

  const updateSpecValue = (field, value) => {
    setSpecs((prev) => ({ ...prev, [field]: value }));
  };

  const updateSpecStatus = (component, status) => {
    setSpecs((prev) => ({ ...prev, [`${component}_status`]: status }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`/update/equipment/${equipment.equipment_id}`, {
        data: { specs: JSON.stringify(specs) },
      });
      toast.success("Equipment specs updated");
      onSave();
      onClose();
    } catch (error) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Edit Equipment
            </h2>
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
            <div className="flex items-center justify-between mb-2">
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
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="CPU model"
            />
          </div>

          {/* RAM */}
          <div>
            <div className="flex items-center justify-between mb-2">
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
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="RAM size"
            />
          </div>

          {/* Storage */}
          <div>
            <div className="flex items-center justify-between mb-2">
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
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Storage info"
            />
          </div>

          {/* GPU */}
          <div>
            <div className="flex items-center justify-between mb-2">
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
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="GPU model"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-700 transition flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Specs Sidebar
function PCSpecsSidebar({ equipment, lab, onClose, onEdit }) {
  if (!equipment) return null;

  let specsData = {};
  try {
    specsData =
      typeof equipment.specs === "string"
        ? JSON.parse(equipment.specs)
        : equipment.specs || {};
  } catch (e) {}

  const isAvailable = !hasBadSpec(equipment.specs);
  const pcStatus = isAvailable ? "available" : "unavailable";
  const statusLabel = isAvailable ? "Available" : "Unavailable";
  const statusColor = isAvailable
    ? "bg-emerald-50 text-emerald-600"
    : "bg-red-50 text-red-600";

  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col animate-slide-in-right">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {equipment.item_name}
          </h3>
          <p className="text-sm text-slate-500">{lab?.lab_name}</p>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {equipment.asset_tag}
          </p>
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
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700">CPU</span>
            <div className="flex items-center gap-3">
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

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700">RAM</span>
            <div className="flex items-center gap-3">
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

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700">Storage</span>
            <div className="flex items-center gap-3">
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

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700">GPU</span>
            <div className="flex items-center gap-3">
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
      </div>
    </div>
  );
}

// Large Modal for Lab Station Map
function LabStationModal({ lab, onClose }) {
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
    } catch (error) {
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
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {lab.lab_name}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {lab.building} · Room {lab.room_number}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
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

        {/* Stats strip - Total, Available, Unavailable */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 shrink-0">
          <div className="px-6 py-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{total}</p>
            <p className="text-xs text-slate-400 mt-0.5">Total Equipment</p>
          </div>
          <div className="px-6 py-4 text-center">
            <p className="text-2xl font-bold text-green-600">{available}</p>
            <p className="text-xs text-slate-400 mt-0.5">Available (Green)</p>
          </div>
          <div className="px-6 py-4 text-center">
            <p className="text-2xl font-bold text-red-600">{unavailable}</p>
            <p className="text-xs text-slate-400 mt-0.5">Unavailable (Red)</p>
          </div>
        </div>

        {/* Station grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-4">
            {stations.map((station) => (
              <div
                key={station.id}
                className="flex flex-col items-center gap-2 cursor-pointer group hover:scale-105 transition-transform"
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
          />
        )}

        {editingEquipment && (
          <EditSpecModal
            equipment={editingEquipment}
            onClose={() => setEditingEquipment(null)}
            onSave={() => {
              fetchInventory();
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

// Lab Card Component
function LabCard({ lab, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 p-6 text-left hover:border-slate-300 hover:shadow-md transition-all w-full group"
    >
      <div className="flex items-start justify-between mb-4">
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

// Main Laboratories Component
export default function Laboratories({ userRole }) {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/laboratories");
      setLabs(response.data || []);
    } catch (error) {
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laboratories</h1>
          <p className="text-sm text-slate-500 mt-1">
            {labs.length} labs registered
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
              placeholder="Search labs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition w-56"
            />
          </div>
          {userRole === "admin" && (
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors">
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
        />
      )}
    </div>
  );
}
