import React, { useState, useEffect } from "react";
import { Plus, Search, Keyboard, Mouse, Printer, Camera, Headphones, Mic, AlertCircle, CheckCircle, Layers, Trash2, Eye, X, Save, RefreshCw } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useRefresh } from "../contexts/RefreshContext";

const getPeripheralIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("keyboard")) return <Keyboard size={15} className="text-slate-500 dark:text-slate-400" />;
  if (name.includes("mouse")) return <Mouse size={15} className="text-slate-500 dark:text-slate-400" />;
  if (name.includes("printer")) return <Printer size={15} className="text-slate-500 dark:text-slate-400" />;
  if (name.includes("camera")) return <Camera size={15} className="text-slate-500 dark:text-slate-400" />;
  if (name.includes("head")) return <Headphones size={15} className="text-slate-500 dark:text-slate-400" />;
  if (name.includes("mic")) return <Mic size={15} className="text-slate-500 dark:text-slate-400" />;
  return <Keyboard size={15} className="text-slate-500 dark:text-slate-400" />;
};

// Add Peripheral Modal - FIXED to stay open
function AddPeripheralModal({ laboratories, categories, onClose, onSave }) {
  const [formData, setFormData] = useState({ 
    item_name: "", 
    brand: "", 
    category_id: "", 
    lab_id: "", 
    copies: 1 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.item_name.trim()) {
      toast.error("Item name is required");
      return;
    }
    
    const copies = parseInt(formData.copies) || 1;
    if (copies < 1) {
      toast.error("At least one copy required");
      return;
    }
    
    setLoading(true);
    try {
      await axiosInstance.post("/create/peripherals/bulk", {
        data: {
          item_name: formData.item_name,
          brand: formData.brand || null,
          category_id: formData.category_id || null,
          lab_id: formData.lab_id || null,
          copies: copies,
        },
      });
      toast.success(`Added ${copies} peripheral(s)`);
      onSave(); // Refresh the list
      onClose(); // Close modal only after success
    } catch (error) {
      console.error("Error adding peripheral:", error);
      toast.error(error.response?.data?.error || "Failed to add peripherals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Peripherals</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.item_name}
              onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
              placeholder="e.g., Logitech Mouse, Dell Keyboard"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Brand
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
              placeholder="e.g., Logitech, Dell, HP"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Laboratory (Stock Location)
            </label>
            <select
              value={formData.lab_id}
              onChange={(e) => setFormData({ ...formData, lab_id: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
            >
              <option value="">Select Laboratory</option>
              {laboratories.map((lab) => (
                <option key={lab.lab_id} value={lab.lab_id}>{lab.lab_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Number of Copies
            </label>
            <input
              type="number"
              min="1"
              value={formData.copies}
              onChange={(e) => setFormData({ ...formData, copies: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
            />
            <p className="text-xs text-slate-400 mt-1">How many units to add to inventory</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Add {formData.copies > 1 ? `${formData.copies} Peripherals` : "Peripheral"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// View Details Modal
function ViewPeripheralModal({ peripheral, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Peripheral Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Item</label><p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{peripheral.item_name}</p></div>
          <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Brand</label><p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{peripheral.brand || "N/A"}</p></div>
          <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Category</label><p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{peripheral.category_name || "N/A"}</p></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Working</label><p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{peripheral.working_count}</p></div>
            <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Damaged</label><p className="text-lg font-bold text-red-600 dark:text-red-400">{peripheral.damaged_count}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Total</label><p className="text-lg font-bold text-slate-900 dark:text-white">{peripheral.total_count}</p></div>
            <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Location</label><p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{peripheral.lab_name || "Lab Stock"}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Modal
function DeleteConfirmModal({ peripheral, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = peripheral.total_count || 1;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Delete Peripherals</h2>
        </div>
        <div className="p-6 space-y-4">
          <p>Delete <span className="font-semibold text-slate-900 dark:text-white">{peripheral?.item_name}</span> ({peripheral?.brand})</p>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Number of units to delete</label>
            <input
              type="number"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
            />
            <p className="text-xs text-slate-400 mt-1">Available: {maxQuantity} unit(s)</p>
          </div>
          <p className="text-xs text-red-500">This action cannot be undone.</p>
        </div>
        <div className="px-6 py-5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</button>
          <button onClick={() => onConfirm(quantity)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">Delete {quantity} unit(s)</button>
        </div>
      </div>
    </div>
  );
}

// Main Peripherals Component
export default function Peripherals({ userRole, onRefresh }) {
  const { triggerRefresh } = useRefresh();
  const [peripherals, setPeripherals] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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
      const [peripheralsRes, labsRes, categoriesRes] = await Promise.all([
        axiosInstance.get("/peripherals"),
        axiosInstance.get("/laboratories"),
        axiosInstance.get("/categories"),
      ]);
      const data = peripheralsRes.data.map((p) => ({ 
        ...p, 
        working_count: Number(p.working_count), 
        damaged_count: Number(p.damaged_count), 
        total_count: Number(p.total_count) 
      }));
      setPeripherals(data);
      setLaboratories(labsRes.data || []);
      setCategories(categoriesRes.data || []);
      triggerRefresh();
      onRefresh();
    } catch (error) { 
      console.error("Error fetching data:", error);
      toast.error("Failed to load data"); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async (quantity) => {
    if (deleteItem) {
      try {
        await axiosInstance.post("/peripherals/delete-type", { 
          data: { 
            item_name: deleteItem.item_name, 
            brand: deleteItem.brand, 
            quantity 
          } 
        });
        toast.success(`Deleted ${quantity} unit(s)`);
        fetchData();
        setIsDeleteModalOpen(false);
        setDeleteItem(null);
      } catch (error) { 
        console.error("Delete error:", error);
        toast.error("Failed to delete"); 
      }
    }
  };

  const filtered = peripherals.filter((item) => {
    const matchSearch = item.item_name?.toLowerCase().includes(search.toLowerCase()) || 
                        item.brand?.toLowerCase().includes(search.toLowerCase());
    let matchStatus = true;
    if (filterStatus === "working") matchStatus = item.working_count > 0;
    else if (filterStatus === "damaged") matchStatus = item.damaged_count > 0;
    return matchSearch && matchStatus;
  });

  const totalWorking = peripherals.reduce((sum, p) => sum + (p.working_count || 0), 0);
  const totalDamaged = peripherals.reduce((sum, p) => sum + (p.damaged_count || 0), 0);
  const totalPeripherals = totalWorking + totalDamaged;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading peripherals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Peripherals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{peripherals.length} peripheral types • {totalPeripherals} total units</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search peripherals..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white w-56 transition" 
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="px-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer dark:text-white transition"
          >
            <option value="all">All Status</option>
            <option value="working">Has Working Units</option>
            <option value="damaged">Has Damaged Units</option>
          </select>
          <button 
            onClick={fetchData} 
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition transform hover:scale-105" 
            title="Refresh"
          >
            <RefreshCw size={18} className="text-slate-500 dark:text-slate-400" />
          </button>
          {userRole === "admin" && (
            <button 
              onClick={() => setIsFormOpen(true)} 
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 transition transform hover:scale-105"
            >
              <Plus size={16} /> Add Peripheral
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><Layers size={20} className="text-slate-600 dark:text-slate-400" /></div>
          <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Total Peripherals</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{totalPeripherals}</p><p className="text-xs text-slate-400 dark:text-slate-500">{peripherals.length} types</p></div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center"><CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" /></div>
          <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Working Units</p><p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalWorking}</p><p className="text-xs text-slate-400 dark:text-slate-500">{totalPeripherals > 0 ? Math.round((totalWorking / totalPeripherals) * 100) : 0}% of total</p></div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center"><AlertCircle size={20} className="text-red-600 dark:text-red-400" /></div>
          <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Damaged Units</p><p className="text-2xl font-bold text-red-600 dark:text-red-400">{totalDamaged}</p><p className="text-xs text-slate-400 dark:text-slate-500">{totalPeripherals > 0 ? Math.round((totalDamaged / totalPeripherals) * 100) : 0}% of total</p></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Item</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Brand</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Location</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Working</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Damaged</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.peripheral_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {getPeripheralIcon(item.category_name)}
                      </div>
                      <span className="font-medium text-slate-800 dark:text-white">{item.item_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.brand || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.category_name || "Unknown"}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.lab_name || "Lab Stock"}</td>
                  <td className="px-6 py-4"><span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">{item.working_count}</span></td>
                  <td className="px-6 py-4"><span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">{item.damaged_count}</span></td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">{item.total_count}</td>
                  {userRole === "admin" && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setViewItem(item); setIsViewModalOpen(true); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                          <Eye size={16} className="text-slate-500 dark:text-slate-400" />
                        </button>
                        <button onClick={() => { setDeleteItem(item); setIsDeleteModalOpen(true); }} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition">
                          <Trash2 size={16} className="text-red-500" />
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

      {/* Modals */}
      {isFormOpen && (
        <AddPeripheralModal
          laboratories={laboratories}
          categories={categories}
          onClose={() => setIsFormOpen(false)}
          onSave={fetchData}
        />
      )}
      {isViewModalOpen && viewItem && (
        <ViewPeripheralModal
          peripheral={viewItem}
          onClose={() => { setIsViewModalOpen(false); setViewItem(null); }}
        />
      )}
      {isDeleteModalOpen && deleteItem && (
        <DeleteConfirmModal
          peripheral={deleteItem}
          onClose={() => { setIsDeleteModalOpen(false); setDeleteItem(null); }}
          onConfirm={(quantity) => handleDelete(quantity)}
        />
      )}
    </div>
  );
}