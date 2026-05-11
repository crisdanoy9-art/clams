import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export default function BulkAddEquipment({ laboratories, categories, onClose, onSave }) {
  const [mode, setMode] = useState("range");
  const [loading, setLoading] = useState(false);
  
  // Range Mode
  const [rangeData, setRangeData] = useState({
    pc_name_prefix: "PC-",
    start_number: 1,
    end_number: 10,
    item_name: "Desktop PC",
    brand: "",
    model: "",
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

  const handleRangeSubmit = async (e) => {
    e.preventDefault();
    if (!rangeData.pc_name_prefix || !rangeData.lab_id) {
      toast.error("Please fill PC Name Prefix and Laboratory");
      return;
    }
    
    if (rangeData.start_number > rangeData.end_number) {
      toast.error("Start number must be less than or equal to End number");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axiosInstance.post("/create/equipment/bulk", {
        data: rangeData
      });
      
      toast.success(response.data.message);
      onSave();
      onClose();
    } catch (error) {
      console.error("Bulk create error:", error);
      toast.error(error.response?.data?.error || "Failed to create PCs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Bulk Add PCs</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Create multiple PCs at once (e.g., PC-1, PC-2, PC-3...)</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X size={18} className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleRangeSubmit} className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700 dark:text-blue-400">💡 Example: If you enter Prefix "PC-" from 1 to 10, it will create: PC-1, PC-2, PC-3... PC-10</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">PC Name Prefix *</label>
                <input 
                  type="text" 
                  value={rangeData.pc_name_prefix} 
                  onChange={(e) => setRangeData({ ...rangeData, pc_name_prefix: e.target.value })} 
                  placeholder="e.g., PC- or LAB1-PC-" 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white" 
                  required 
                />
                <p className="text-xs text-slate-400 mt-1">Example: PC-1, PC-2, PC-3</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Laboratory *</label>
                <select 
                  value={rangeData.lab_id} 
                  onChange={(e) => setRangeData({ ...rangeData, lab_id: e.target.value })} 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
                  required
                >
                  <option value="">Select Laboratory</option>
                  {laboratories.map((lab) => (
                    <option key={lab.lab_id} value={lab.lab_id}>{lab.lab_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Start Number</label>
                <input 
                  type="number" 
                  min="1" 
                  value={rangeData.start_number} 
                  onChange={(e) => setRangeData({ ...rangeData, start_number: parseInt(e.target.value) })} 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">End Number</label>
                <input 
                  type="number" 
                  min="1" 
                  value={rangeData.end_number} 
                  onChange={(e) => setRangeData({ ...rangeData, end_number: parseInt(e.target.value) })} 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Item Name</label>
                <input 
                  type="text" 
                  value={rangeData.item_name} 
                  onChange={(e) => setRangeData({ ...rangeData, item_name: e.target.value })} 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Brand</label>
                <input 
                  type="text" 
                  value={rangeData.brand} 
                  onChange={(e) => setRangeData({ ...rangeData, brand: e.target.value })} 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Model</label>
                <input 
                  type="text" 
                  value={rangeData.model} 
                  onChange={(e) => setRangeData({ ...rangeData, model: e.target.value })} 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Category</label>
                <select 
                  value={rangeData.category_id} 
                  onChange={(e) => setRangeData({ ...rangeData, category_id: e.target.value })} 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Status</label>
                <select 
                  value={rangeData.status} 
                  onChange={(e) => setRangeData({ ...rangeData, status: e.target.value })} 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="working">Working</option>
                  <option value="for_repair">For Repair</option>
                  <option value="retired">Retired</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Purchase Date</label>
                <input 
                  type="date" 
                  value={rangeData.purchase_date} 
                  onChange={(e) => setRangeData({ ...rangeData, purchase_date: e.target.value })} 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" 
                />
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Components Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">CPU</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setRangeData({ ...rangeData, cpu_status: "good" })} className={`px-2 py-0.5 rounded text-xs ${rangeData.cpu_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"}`}>Good</button>
                      <button type="button" onClick={() => setRangeData({ ...rangeData, cpu_status: "bad" })} className={`px-2 py-0.5 rounded text-xs ${rangeData.cpu_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 dark:bg-red-900/30 text-red-600"}`}>Bad</button>
                    </div>
                  </div>
                  <input type="text" value={rangeData.cpu} onChange={(e) => setRangeData({ ...rangeData, cpu: e.target.value })} placeholder="CPU model" className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">RAM</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setRangeData({ ...rangeData, ram_status: "good" })} className={`px-2 py-0.5 rounded text-xs ${rangeData.ram_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"}`}>Good</button>
                      <button type="button" onClick={() => setRangeData({ ...rangeData, ram_status: "bad" })} className={`px-2 py-0.5 rounded text-xs ${rangeData.ram_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 dark:bg-red-900/30 text-red-600"}`}>Bad</button>
                    </div>
                  </div>
                  <input type="text" value={rangeData.ram} onChange={(e) => setRangeData({ ...rangeData, ram: e.target.value })} placeholder="RAM size" className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Storage</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setRangeData({ ...rangeData, storage_status: "good" })} className={`px-2 py-0.5 rounded text-xs ${rangeData.storage_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"}`}>Good</button>
                      <button type="button" onClick={() => setRangeData({ ...rangeData, storage_status: "bad" })} className={`px-2 py-0.5 rounded text-xs ${rangeData.storage_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 dark:bg-red-900/30 text-red-600"}`}>Bad</button>
                    </div>
                  </div>
                  <input type="text" value={rangeData.storage} onChange={(e) => setRangeData({ ...rangeData, storage: e.target.value })} placeholder="Storage info" className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">GPU</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setRangeData({ ...rangeData, gpu_status: "good" })} className={`px-2 py-0.5 rounded text-xs ${rangeData.gpu_status === "good" ? "bg-emerald-500 text-white" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"}`}>Good</button>
                      <button type="button" onClick={() => setRangeData({ ...rangeData, gpu_status: "bad" })} className={`px-2 py-0.5 rounded text-xs ${rangeData.gpu_status === "bad" ? "bg-red-500 text-white" : "bg-red-50 dark:bg-red-900/30 text-red-600"}`}>Bad</button>
                    </div>
                  </div>
                  <input type="text" value={rangeData.gpu} onChange={(e) => setRangeData({ ...rangeData, gpu: e.target.value })} placeholder="GPU model" className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
              <p className="text-sm text-amber-700 dark:text-amber-400">📊 You are about to create <strong>{rangeData.end_number - rangeData.start_number + 1}</strong> PCs: {rangeData.pc_name_prefix}{rangeData.start_number} to {rangeData.pc_name_prefix}{rangeData.end_number}</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
              <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition flex items-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                Create {rangeData.end_number - rangeData.start_number + 1} PCs
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}