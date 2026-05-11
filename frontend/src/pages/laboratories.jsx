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
  RefreshCw,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useRefresh } from "../contexts/RefreshContext";

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

// Full Edit Equipment Modal - ADMIN ONLY
function FullEditEquipmentModal({ equipment, laboratories, categories, onClose, onSave }) {
  const [formData, setFormData] = useState({
    pc_name: "",
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
        specsData = typeof equipment.specs === "string" ? JSON.parse(equipment.specs) : equipment.specs || {};
      } catch (e) {}
      setFormData({
        pc_name: equipment.pc_name || "",
        item_name: equipment.item_name || "",
        brand: equipment.brand || "",
        model: equipment.model || "",
        serial_number: equipment.serial_number || "",
        category_id: equipment.category_id || "",
        lab_id: equipment.lab_id || "",
        status: equipment.status || "working",
        purchase_date: equipment.purchase_date ? equipment.purchase_date.split("T")[0] : "",
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

      await axiosInstance.put(`/update/equipment/${equipment.equipment_id}`, {
        data: {
          pc_name: formData.pc_name,
          item_name: formData.item_name,
          brand: formData.brand || null,
          model: formData.model || null,
          serial_number: formData.serial_number || null,
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
          lab_id: formData.lab_id ? parseInt(formData.lab_id) : null,
          status: formData.status,
          purchase_date: formData.purchase_date || null,
          specs: specsString,
        },
      });
      toast.success("Equipment updated successfully");
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Edit Equipment</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{equipment?.pc_name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X size={18} className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">PC Name *</label>
              <input type="text" value={formData.pc_name} onChange={(e) => setFormData({ ...formData, pc_name: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Item Name *</label>
              <input type="text" value={formData.item_name} onChange={(e) => setFormData({ ...formData, item_name: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Brand</label>
              <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Model</label>
              <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Serial Number</label>
              <input type="text" value={formData.serial_number} onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Purchase Date</label>
              <input type="date" value={formData.purchase_date} onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Category</label>
              <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <option value="">Select Category</option>
                {categories.map((cat) => (<option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Laboratory</label>
              <select value={formData.lab_id} onChange={(e) => setFormData({ ...formData, lab_id: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <option value="">Select Laboratory</option>
                {laboratories.map((lab) => (<option key={lab.lab_id} value={lab.lab_id}>{lab.lab_name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <option value="working">Working</option>
                <option value="for_repair">For Repair</option>
                <option value="retired">Retired</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Components Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">CPU</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => updateSpecStatus("cpu", "good")} className={`px-2 py-0.5 rounded text-xs ${formData.cpu_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"}`}>Good</button>
                    <button type="button" onClick={() => updateSpecStatus("cpu", "bad")} className={`px-2 py-0.5 rounded text-xs ${formData.cpu_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 dark:bg-red-900/30 text-red-600"}`}>Bad</button>
                  </div>
                </div>
                <input type="text" value={formData.cpu} onChange={(e) => setFormData({ ...formData, cpu: e.target.value })} placeholder="CPU model" className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">RAM</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => updateSpecStatus("ram", "good")} className={`px-2 py-0.5 rounded text-xs ${formData.ram_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"}`}>Good</button>
                    <button type="button" onClick={() => updateSpecStatus("ram", "bad")} className={`px-2 py-0.5 rounded text-xs ${formData.ram_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 dark:bg-red-900/30 text-red-600"}`}>Bad</button>
                  </div>
                </div>
                <input type="text" value={formData.ram} onChange={(e) => setFormData({ ...formData, ram: e.target.value })} placeholder="RAM size" className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Storage</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => updateSpecStatus("storage", "good")} className={`px-2 py-0.5 rounded text-xs ${formData.storage_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"}`}>Good</button>
                    <button type="button" onClick={() => updateSpecStatus("storage", "bad")} className={`px-2 py-0.5 rounded text-xs ${formData.storage_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 dark:bg-red-900/30 text-red-600"}`}>Bad</button>
                  </div>
                </div>
                <input type="text" value={formData.storage} onChange={(e) => setFormData({ ...formData, storage: e.target.value })} placeholder="Storage info" className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">GPU</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => updateSpecStatus("gpu", "good")} className={`px-2 py-0.5 rounded text-xs ${formData.gpu_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"}`}>Good</button>
                    <button type="button" onClick={() => updateSpecStatus("gpu", "bad")} className={`px-2 py-0.5 rounded text-xs ${formData.gpu_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 dark:bg-red-900/30 text-red-600"}`}>Bad</button>
                  </div>
                </div>
                <input type="text" value={formData.gpu} onChange={(e) => setFormData({ ...formData, gpu: e.target.value })} placeholder="GPU model" className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition flex items-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// View Only Specs Sidebar - For Instructors (no edit button)
function ViewOnlySpecsSidebar({ equipment, lab, onClose }) {
  if (!equipment) return null;

  let specsData = {};
  try {
    specsData = typeof equipment.specs === "string" ? JSON.parse(equipment.specs) : equipment.specs || {};
  } catch {}

  const isAvailable = !hasBadSpec(equipment.specs);
  const statusLabel = isAvailable ? "Available" : "Unavailable";
  const statusColor = isAvailable
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-30 flex flex-col animate-slide-in-right">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{equipment.item_name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{lab?.lab_name}</p>
          <p className="text-xs font-mono text-slate-400 dark:text-slate-500">{equipment.pc_name}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <X size={18} className="text-slate-400 dark:text-slate-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div>
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        {(equipment.brand || equipment.model) && (
          <div>
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Brand / Model</label>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{equipment.brand} {equipment.model}</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">CPU</span>
            <div className="flex gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">{specsData.cpu || "N/A"}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${specsData.cpu_status === "good" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {specsData.cpu_status === "good" ? "Good" : "Bad"}
              </span>
            </div>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">RAM</span>
            <div className="flex gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">{specsData.ram || "N/A"}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${specsData.ram_status === "good" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {specsData.ram_status === "good" ? "Good" : "Bad"}
              </span>
            </div>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Storage</span>
            <div className="flex gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">{specsData.storage || "N/A"}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${specsData.storage_status === "good" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {specsData.storage_status === "good" ? "Good" : "Bad"}
              </span>
            </div>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">GPU</span>
            <div className="flex gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">{specsData.gpu || "N/A"}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${specsData.gpu_status === "good" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {specsData.gpu_status === "good" ? "Good" : "Bad"}
              </span>
            </div>
          </div>
        </div>

        {equipment.serial_number && (
          <div>
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Serial Number</label>
            <p className="text-sm font-mono text-slate-600 dark:text-slate-400 mt-1">{equipment.serial_number}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Admin PC Specs Sidebar (with edit button)
function AdminPCSpecsSidebar({ equipment, lab, onClose, onEdit }) {
  if (!equipment) return null;

  let specsData = {};
  try {
    specsData = typeof equipment.specs === "string" ? JSON.parse(equipment.specs) : equipment.specs || {};
  } catch {}

  const isAvailable = !hasBadSpec(equipment.specs);
  const statusLabel = isAvailable ? "Available" : "Unavailable";
  const statusColor = isAvailable
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  const [attachedPeripherals, setAttachedPeripherals] = useState([]);
  const [availableStock, setAvailableStock] = useState([]);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [selectedPeripheralId, setSelectedPeripheralId] = useState("");
  const [attachLoading, setAttachLoading] = useState(false);

  const REQUIRED_CATEGORIES = ["Keyboard", "Mouse", "Monitor", "Headset"];
  const getPeripheralCategory = (p) => p.category_name || "Uncategorized";
  const attachedCategories = attachedPeripherals.map(getPeripheralCategory);
  const nextMissingCategory = REQUIRED_CATEGORIES.find(cat => !attachedCategories.includes(cat));
  const allCategoriesFilled = !nextMissingCategory;
  const filteredStock = availableStock.filter(p => getPeripheralCategory(p) === nextMissingCategory);

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

  useEffect(() => { fetchPeripherals(); }, [equipment]);

  const handleAttach = async () => {
    if (!selectedPeripheralId) return;
    setAttachLoading(true);
    try {
      await axiosInstance.post(`/equipment/${equipment.equipment_id}/attach-peripheral`, { data: { peripheral_id: selectedPeripheralId } });
      toast.success("Peripheral attached");
      await fetchPeripherals();
      setShowAttachModal(false);
      setSelectedPeripheralId("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to attach");
    } finally { setAttachLoading(false); }
  };

  const handleDetach = async (peripheralId) => {
    if (!window.confirm("Detach this peripheral from the PC?")) return;
    try {
      await axiosInstance.post(`/equipment/${equipment.equipment_id}/detach-peripheral`, { data: { peripheral_id: peripheralId } });
      toast.success("Peripheral detached");
      await fetchPeripherals();
    } catch { toast.error("Failed to detach"); }
  };

  const handleReplace = async (oldId, newId) => {
    try {
      await axiosInstance.post(`/equipment/${equipment.equipment_id}/detach-peripheral`, { data: { peripheral_id: oldId } });
      await axiosInstance.post(`/equipment/${equipment.equipment_id}/attach-peripheral`, { data: { peripheral_id: newId } });
      toast.success("Peripheral replaced");
      await fetchPeripherals();
    } catch { toast.error("Failed to replace"); }
  };

  const handleStatusChange = async (peripheralId, newStatus) => {
    try {
      await axiosInstance.put(`/peripherals/${peripheralId}/status`, { data: { status: newStatus } });
      toast.success(`Status changed to ${newStatus}`);
      await fetchPeripherals();
    } catch { toast.error("Failed to update status"); }
  };

  const getPillStyles = (status) => status === "working" 
    ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400"
    : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400";

  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-30 flex flex-col animate-slide-in-right">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{equipment.item_name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{lab?.lab_name}</p>
          <p className="text-xs font-mono text-slate-400 dark:text-slate-500">{equipment.pc_name}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Edit Specs">
            <Edit2 size={18} className="text-slate-500 dark:text-slate-400" />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X size={18} className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div><span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>{statusLabel}</span></div>
        {(equipment.brand || equipment.model) && (<div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Brand / Model</label><p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{equipment.brand} {equipment.model}</p></div>)}
        
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">CPU</span><div className="flex gap-3"><span className="text-sm text-slate-500 dark:text-slate-400">{specsData.cpu || "N/A"}</span><span className={`text-xs px-2 py-0.5 rounded-full ${specsData.cpu_status === "good" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>{specsData.cpu_status === "good" ? "Good" : "Bad"}</span></div></div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">RAM</span><div className="flex gap-3"><span className="text-sm text-slate-500 dark:text-slate-400">{specsData.ram || "N/A"}</span><span className={`text-xs px-2 py-0.5 rounded-full ${specsData.ram_status === "good" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>{specsData.ram_status === "good" ? "Good" : "Bad"}</span></div></div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Storage</span><div className="flex gap-3"><span className="text-sm text-slate-500 dark:text-slate-400">{specsData.storage || "N/A"}</span><span className={`text-xs px-2 py-0.5 rounded-full ${specsData.storage_status === "good" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>{specsData.storage_status === "good" ? "Good" : "Bad"}</span></div></div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">GPU</span><div className="flex gap-3"><span className="text-sm text-slate-500 dark:text-slate-400">{specsData.gpu || "N/A"}</span><span className={`text-xs px-2 py-0.5 rounded-full ${specsData.gpu_status === "good" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>{specsData.gpu_status === "good" ? "Good" : "Bad"}</span></div></div>
        </div>

        {equipment.serial_number && (<div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Serial Number</label><p className="text-sm font-mono text-slate-600 dark:text-slate-400 mt-1">{equipment.serial_number}</p></div>)}

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Peripherals</h4>
          {!allCategoriesFilled ? (
            <div className="mb-3"><p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Next needed: <span className="font-medium text-indigo-600 dark:text-indigo-400">{nextMissingCategory}</span></p>
            <button onClick={() => setShowAttachModal(true)} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition flex items-center gap-1"><Plus size={12} /> Add {nextMissingCategory}</button></div>
          ) : (<p className="text-xs text-emerald-600 dark:text-emerald-400 mb-2">✓ All required peripherals attached</p>)}

          {attachedPeripherals.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {attachedPeripherals.map((p) => {
                const category = getPeripheralCategory(p);
                const replaceOptions = availableStock.filter(s => getPeripheralCategory(s) === category && s.peripheral_id !== p.peripheral_id);
                return (
                  <div key={p.peripheral_id} className={`rounded-full border px-3 py-1.5 flex items-center gap-2 shadow-sm ${getPillStyles(p.status)}`}>
                    <span className="text-sm font-medium">{p.item_name}</span>
                    <select value={p.status} onChange={(e) => handleStatusChange(p.peripheral_id, e.target.value)} className="text-xs border-0 bg-transparent focus:ring-0 font-medium"><option value="working">Working</option><option value="damaged">Damaged</option></select>
                    {allCategoriesFilled && replaceOptions.length > 0 && (<select onChange={(e) => handleReplace(p.peripheral_id, e.target.value)} className="text-xs border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400" defaultValue=""><option value="" disabled>Replace</option>{replaceOptions.map(opt => (<option key={opt.peripheral_id} value={opt.peripheral_id}>{opt.item_name}</option>))}</select>)}
                    <button onClick={() => handleDetach(p.peripheral_id)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition" title="Detach"><X size={14} /></button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showAttachModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-96 p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Add {nextMissingCategory}</h3>
            <select value={selectedPeripheralId} onChange={(e) => setSelectedPeripheralId(e.target.value)} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2 mb-4 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"><option value="">Select a {nextMissingCategory}</option>{filteredStock.map(p => (<option key={p.peripheral_id} value={p.peripheral_id}>{p.item_name} ({p.brand || "no brand"}) – {p.status}</option>))}</select>
            {filteredStock.length === 0 && <p className="text-xs text-red-500 dark:text-red-400 mb-2">No {nextMissingCategory} available in stock.</p>}
            <div className="flex justify-end gap-3"><button onClick={() => setShowAttachModal(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</button><button onClick={handleAttach} disabled={attachLoading || !selectedPeripheralId || filteredStock.length === 0} className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-sm disabled:opacity-50 hover:bg-slate-700 dark:hover:bg-slate-600 transition">{attachLoading ? "Attaching..." : "Attach"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Lab Station Modal
function LabStationModal({ lab, onClose, userRole, laboratories, categories }) {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [fullEditEquipment, setFullEditEquipment] = useState(null);
  const [isFullEditModalOpen, setIsFullEditModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInventory(); }, [lab]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/inventory");
      const labEquipment = response.data.filter((item) => item.lab_name === lab.lab_name);
      setInventory(labEquipment);
    } catch { toast.error("Failed to load equipment"); } finally { setLoading(false); }
  };

  const stations = inventory.map((eq, index) => ({ id: index + 1, status: hasBadSpec(eq.specs) ? "unavailable" : "available", equipment: eq }));
  const total = stations.length;
  const available = stations.filter((s) => s.status === "available").length;
  const unavailable = stations.filter((s) => s.status === "unavailable").length;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8"><div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto" /></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col z-10 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div><h2 className="text-2xl font-bold text-slate-900 dark:text-white">{lab.lab_name}</h2><p className="text-sm text-slate-500 dark:text-slate-400">{lab.building} · Room {lab.room_number}</p></div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4 text-xs text-slate-500 dark:text-slate-400"><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-500" /> Available ({available})</span><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500" /> Unavailable ({unavailable})</span></div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"><X size={20} className="text-slate-400 dark:text-slate-500" /></button>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="px-6 py-4 text-center"><p className="text-2xl font-bold text-slate-900 dark:text-white">{total}</p><p className="text-xs text-slate-400 dark:text-slate-500">Total Equipment</p></div>
          <div className="px-6 py-4 text-center"><p className="text-2xl font-bold text-green-600 dark:text-green-400">{available}</p><p className="text-xs text-slate-400 dark:text-slate-500">Available (Green)</p></div>
          <div className="px-6 py-4 text-center"><p className="text-2xl font-bold text-red-600 dark:text-red-400">{unavailable}</p><p className="text-xs text-slate-400 dark:text-slate-500">Unavailable (Red)</p></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-4">
            {stations.map((station) => (
              <div key={station.id} className="flex flex-col items-center gap-2 cursor-pointer group hover:scale-105 transition-transform duration-200" onClick={() => setSelectedEquipment(station.equipment)}>
                <PCIcon status={station.status} />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{station.equipment?.pc_name || `PC ${station.id}`}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{station.status === "available" ? "Ready" : "Offline"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role-based sidebar */}
        {selectedEquipment && userRole === "admin" && (
          <AdminPCSpecsSidebar
            equipment={selectedEquipment}
            lab={lab}
            onClose={() => setSelectedEquipment(null)}
            onEdit={() => {
              setFullEditEquipment(selectedEquipment);
              setIsFullEditModalOpen(true);
              setSelectedEquipment(null);
            }}
          />
        )}
        {selectedEquipment && userRole === "instructor" && (
          <ViewOnlySpecsSidebar
            equipment={selectedEquipment}
            lab={lab}
            onClose={() => setSelectedEquipment(null)}
          />
        )}

        {isFullEditModalOpen && fullEditEquipment && (
          <FullEditEquipmentModal
            equipment={fullEditEquipment}
            laboratories={laboratories}
            categories={categories}
            onClose={() => { setIsFullEditModalOpen(false); setFullEditEquipment(null); }}
            onSave={() => { fetchInventory(); setIsFullEditModalOpen(false); setFullEditEquipment(null); }}
          />
        )}
      </div>
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }.animate-slide-in-right { animation: slideInRight 0.25s ease-out; }`}</style>
    </div>
  );
}

// Lab Card Component
function LabCard({ lab, onClick }) {
  return (
    <button onClick={onClick} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 text-left hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-300 w-full group transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4"><div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center"><Monitor size={20} className="text-indigo-600 dark:text-indigo-400" /></div><span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">Active</span></div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-white">{lab.lab_name}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{lab.building} · Room {lab.room_number}</p>
      <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-4 group-hover:underline">View station map →</p>
    </button>
  );
}

// Add Laboratory Modal
function AddLabModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({ lab_name: "", room_number: "", building: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lab_name.trim()) { toast.error("Laboratory name is required"); return; }
    setLoading(true);
    try {
      await axiosInstance.post("/create/laboratories", { data: { lab_name: formData.lab_name, room_number: formData.room_number || null, building: formData.building || null, total_stations: 0 } });
      toast.success("Laboratory added");
      onSave();
      onClose();
    } catch { toast.error("Failed to add laboratory"); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center"><h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Laboratory</h2><button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} className="text-slate-400 dark:text-slate-500" /></button></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Lab Name *</label><input type="text" value={formData.lab_name} onChange={(e) => setFormData({ ...formData, lab_name: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white" required /></div>
          <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Room Number</label><input type="text" value={formData.room_number} onChange={(e) => setFormData({ ...formData, room_number: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" /></div>
          <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Building</label><input type="text" value={formData.building} onChange={(e) => setFormData({ ...formData, building: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" /></div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button><button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition flex items-center gap-2">{loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}Add Lab</button></div>
        </form>
      </div>
    </div>
  );
}

// Main Laboratories Component
export default function Laboratories({ userRole, onRefresh, darkMode }) {
  const { triggerRefresh } = useRefresh();
  const [labs, setLabs] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchLabs(); fetchCategories(); }, []);

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/laboratories");
      setLabs(response.data || []);
      setLaboratories(response.data || []);
      triggerRefresh();
      onRefresh();
    } catch { toast.error("Failed to load laboratories"); } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data || []);
    } catch { console.error("Failed to load categories"); }
  };

  const filtered = labs.filter(l => l.lab_name?.toLowerCase().includes(search.toLowerCase()) || l.room_number?.includes(search));

  if (loading) {
    return (<div className="flex items-center justify-center min-h-[60vh]"><div className="text-center"><div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto mb-4" /><p className="text-slate-500 dark:text-slate-400">Loading laboratories...</p></div></div>);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laboratories</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{labs.length} labs registered</p></div>
        <div className="flex items-center gap-3">
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" /><input type="text" placeholder="Search labs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white w-56 transition" /></div>
          <button onClick={fetchLabs} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition transform hover:scale-105"><RefreshCw size={18} className="text-slate-500 dark:text-slate-400" /></button>
          {userRole === "admin" && (<button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 transition transform hover:scale-105"><Plus size={16} /> Add Lab</button>)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((lab) => (<LabCard key={lab.lab_id} lab={lab} onClick={() => setSelectedLab(lab)} />))}
      </div>

      {filtered.length === 0 && (<div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl"><Monitor size={48} className="text-slate-300 dark:text-slate-600 mb-3" /><p className="text-slate-500 dark:text-slate-400">No laboratories found</p>{userRole === "admin" && (<button onClick={() => setShowAddModal(true)} className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Click here to add one</button>)}</div>)}

      {selectedLab && (<LabStationModal lab={selectedLab} onClose={() => setSelectedLab(null)} userRole={userRole} laboratories={laboratories} categories={categories} />)}
      {showAddModal && (<AddLabModal onClose={() => setShowAddModal(false)} onSave={() => { fetchLabs(); setShowAddModal(false); }} />)}
    </div>
  );
}