import React, { useState } from 'react';
import { Search, Plus, Filter, Monitor, X, CheckCircle2, ChevronDown } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: string;
  lab: string;
  status: 'Available' | 'In Use' | 'Maintenance';
}

const Equipment: React.FC = () => {
  // State for Modal and Data
  const [showAddModal, setShowAddModal] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([
    { id: 'ASSET-001', name: 'Dell Optiplex 7080', type: 'Workstation', lab: 'Lab 1', status: 'Available' },
    { id: 'ASSET-002', name: 'Logitech G-Pro Mouse', type: 'Peripherals', lab: 'Lab 2', status: 'In Use' },
    { id: 'ASSET-003', name: 'TP-Link Router', type: 'Networking', lab: 'Multimedia', status: 'Maintenance' },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Workstation',
    lab: 'Lab 1'
  });

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `ASSET-00${assets.length + 1}`;
    const newAsset: Asset = {
      id: newId,
      name: formData.name,
      type: formData.type,
      lab: formData.lab,
      status: 'Available'
    };

    setAssets([newAsset, ...assets]);
    setShowAddModal(false);
    setFormData({ name: '', type: 'Workstation', lab: 'Lab 1' });
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Equipment Inventory</h2>
          <p className="text-xs text-slate-500 mt-1">CLAMS / Admin / Inventory Management</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-bold text-sm"
        >
          <Plus size={18} /> Add New Asset
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Items</p>
          <p className="text-xl font-bold text-slate-800">{assets.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-500 uppercase">Available</p>
          <p className="text-xl font-bold text-slate-800">{assets.filter(a => a.status === 'Available').length}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by serial, name, or lab..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 font-semibold">
            <Filter size={18} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Asset ID</th>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Lab Location</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">{item.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">{item.name}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{item.type}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{item.lab}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                        item.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 
                        item.status === 'In Use' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD ASSET MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus size={20} /> Register New Asset
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Item Name / Model</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  placeholder="e.g. Mechanical Keyboard, Monitor G-Sync..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Workstation">Workstation</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Networking">Networking</option>
                    <option value="Storage">Storage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assign to Lab</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none"
                    value={formData.lab}
                    onChange={(e) => setFormData({...formData, lab: e.target.value})}
                  >
                    <option value="Lab 1">Lab 1</option>
                    <option value="Lab 2">Lab 2</option>
                    <option value="Lab 3">Lab 3</option>
                    <option value="Multimedia">Multimedia</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;