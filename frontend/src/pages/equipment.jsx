import React, { useState, useEffect } from "react";
import { Plus, Search, Monitor, Edit, Trash2, Eye, RefreshCw, X, Save } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useRefresh } from "../contexts/RefreshContext";
import BulkAddEquipment from "../components/BulkAddEquipment";

const STATUS_STYLES = {
  working: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  for_repair: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  retired: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS = { working: "Working", for_repair: "For Repair", retired: "Retired", lost: "Lost" };

export default function Equipment({ userRole, onRefresh }) {
  const { triggerRefresh } = useRefresh();
  const [equipment, setEquipment] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

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
      triggerRefresh();
      onRefresh();
    } catch (error) { 
      toast.error("Failed to load equipment data"); 
    } finally { 
      setLoading(false); 
    }
  };

  const filtered = equipment.filter((e) => {
    const matchSearch = e.item_name?.toLowerCase().includes(search.toLowerCase()) || 
                        e.pc_name?.toLowerCase().includes(search.toLowerCase()) || 
                        e.brand?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Equipment</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{equipment.length} assets total</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by PC name..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white w-56 transition" 
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer dark:text-white transition">
            <option value="all">All Status</option>
            <option value="working">Working</option>
            <option value="for_repair">For Repair</option>
            <option value="retired">Retired</option>
            <option value="lost">Lost</option>
          </select>
          <button onClick={fetchData} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition transform hover:scale-105" title="Refresh">
            <RefreshCw size={18} className="text-slate-500 dark:text-slate-400" />
          </button>
          {userRole === "admin" && (
            <>
              <button onClick={() => setIsBulkModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition transform hover:scale-105">
                <Plus size={16} /> Bulk Add PCs
              </button>
            
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">PC Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Item</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Brand / Model</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Laboratory</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.equipment_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">{item.pc_name || item.asset_tag}</td>
                  <td className="px-6 py-4"><span className="font-medium text-slate-800 dark:text-white">{item.item_name}</span></td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.brand} {item.model}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.lab_name || "Unknown Lab"}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[item.status]}`}>{STATUS_LABELS[item.status]}</span></td>
                  {userRole === "admin" && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setViewItem(item); setIsViewModalOpen(true); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"><Eye size={16} className="text-slate-500 dark:text-slate-400" /></button>
                        <button onClick={() => { setEditItem(item); setIsEditModalOpen(true); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"><Edit size={16} className="text-slate-500 dark:text-slate-400" /></button>
                        <button onClick={() => { setDeleteItem(item); setIsDeleteModalOpen(true); }} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"><Trash2 size={16} className="text-red-500" /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isBulkModalOpen && (
        <BulkAddEquipment
          laboratories={laboratories}
          categories={categories}
          onClose={() => setIsBulkModalOpen(false)}
          onSave={fetchData}
        />
      )}
    </div>
  );
}