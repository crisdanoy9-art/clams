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

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [peripheralsRes, labsRes, categoriesRes] = await Promise.all([
        axiosInstance.get("/peripherals"),
        axiosInstance.get("/laboratories"),
        axiosInstance.get("/categories"),
      ]);
      const data = peripheralsRes.data.map((p) => ({ ...p, working_count: Number(p.working_count), damaged_count: Number(p.damaged_count), total_count: Number(p.total_count) }));
      setPeripherals(data);
      setLaboratories(labsRes.data || []);
      setCategories(categoriesRes.data || []);
      triggerRefresh();
      onRefresh();
    } catch (error) { toast.error("Failed to load data"); } finally { setLoading(false); }
  };

  const filtered = peripherals.filter((item) => {
    const matchSearch = item.item_name?.toLowerCase().includes(search.toLowerCase()) || item.brand?.toLowerCase().includes(search.toLowerCase());
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Peripherals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{peripherals.length} peripheral types • {totalPeripherals} total units</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Search peripherals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white w-56 transition" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer dark:text-white transition">
            <option value="all">All Status</option>
            <option value="working">Has Working Units</option>
            <option value="damaged">Has Damaged Units</option>
          </select>
          <button onClick={fetchData} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition transform hover:scale-105" title="Refresh">
            <RefreshCw size={18} className="text-slate-500 dark:text-slate-400" />
          </button>
          {userRole === "admin" && (
            <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 transition transform hover:scale-105">
              <Plus size={16} /> Add Peripheral
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><Layers size={20} className="text-slate-600 dark:text-slate-400" /></div>
          <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Total Peripherals</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{totalPeripherals}</p><p className="text-xs text-slate-400 dark:text-slate-500">{peripherals.length} types</p></div>
        </div>
        <div className="stat-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center"><CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" /></div>
          <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Working Units</p><p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalWorking}</p><p className="text-xs text-slate-400 dark:text-slate-500">{totalPeripherals > 0 ? Math.round((totalWorking / totalPeripherals) * 100) : 0}% of total</p></div>
        </div>
        <div className="stat-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center"><AlertCircle size={20} className="text-red-600 dark:text-red-400" /></div>
          <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Damaged Units</p><p className="text-2xl font-bold text-red-600 dark:text-red-400">{totalDamaged}</p><p className="text-xs text-slate-400 dark:text-slate-500">{totalPeripherals > 0 ? Math.round((totalDamaged / totalPeripherals) * 100) : 0}% of total</p></div>
        </div>
      </div>

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
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">{getPeripheralIcon(item.category_name)}</div><span className="font-medium text-slate-800 dark:text-white">{item.item_name}</span></div></td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.brand || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.category_name || "Unknown"}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.lab_name || "Lab Stock"}</td>
                  <td className="px-6 py-4"><span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">{item.working_count}</span></td>
                  <td className="px-6 py-4"><span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">{item.damaged_count}</span></td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">{item.total_count}</td>
                  {userRole === "admin" && (
                    <td className="px-6 py-4"><div className="flex items-center gap-2">
                      <button onClick={() => { setViewItem(item); setIsViewModalOpen(true); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"><Eye size={16} className="text-slate-500 dark:text-slate-400" /></button>
                      <button onClick={() => { setDeleteItem(item); setIsDeleteModalOpen(true); }} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"><Trash2 size={16} className="text-red-500" /></button>
                    </div></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}