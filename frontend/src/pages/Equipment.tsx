import React, { useState, useRef } from 'react';
import { Search, Plus, Filter, X, CheckCircle2, Package, MapPin, Cpu, Wrench, ChevronDown, ChevronUp } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  model: string;
  lab: string;
  status: 'Available' | 'In Use' | 'Maintenance';
}

const Equipment: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [expandedLab, setExpandedLab] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const [assets, setAssets] = useState<Asset[]>([
    { id: 'ASSET-001', name: 'Dell', model: 'Optiplex 7080', lab: 'Laboratory 1', status: 'Available' },
    { id: 'ASSET-002', name: 'Logitech', model: 'G-Pro Mouse', lab: 'Laboratory 2', status: 'In Use' },
    { id: 'ASSET-003', name: 'TP-Link', model: 'Router', lab: 'Laboratory 1', status: 'Maintenance' },
    { id: 'ASSET-004', name: 'HP', model: 'EliteBook', lab: 'Laboratory 3', status: 'Available' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    model: '',
    lab: 'Laboratory 1',
    status: 'Available' as Asset['status'],
    stock: 1,
  });

  // Helper: Generate sequential asset IDs
  const getNextIdNumbers = (count: number): string[] => {
    const idNumbers = assets.map(asset => {
      const match = asset.id.match(/ASSET-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxId = idNumbers.length ? Math.max(...idNumbers) : 0;
    const newIds: string[] = [];
    for (let i = 1; i <= count; i++) {
      const nextNum = maxId + i;
      newIds.push(`ASSET-${nextNum.toString().padStart(3, '0')}`);
    }
    return newIds;
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, model, lab, status, stock } = formData;
    if (!name.trim() || !model.trim()) return;

    const stockQty = Math.max(1, Math.floor(stock) || 1);
    const newIds = getNextIdNumbers(stockQty);

    const newAssets: Asset[] = newIds.map(id => ({
      id,
      name: name.trim(),
      model: model.trim(),
      lab,
      status,
    }));

    setAssets([...newAssets, ...assets]);
    setShowAddModal(false);
    setFormData({ name: '', model: '', lab: 'Laboratory 1', status: 'Available', stock: 1 });
  };

  // Dashboard totals
  const totalItems = assets.length;
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const inUseCount = assets.filter(a => a.status === 'In Use').length;
  const maintenanceCount = assets.filter(a => a.status === 'Maintenance').length;

  // Per-lab statistics and asset lists
  const labStats = assets.reduce((acc, asset) => {
    if (!acc[asset.lab]) {
      acc[asset.lab] = {
        total: 0,
        available: 0,
        inUse: 0,
        maintenance: 0,
        assets: [] as Asset[],
      };
    }
    acc[asset.lab].total++;
    if (asset.status === 'Available') acc[asset.lab].available++;
    if (asset.status === 'In Use') acc[asset.lab].inUse++;
    if (asset.status === 'Maintenance') acc[asset.lab].maintenance++;
    acc[asset.lab].assets.push(asset);
    return acc;
  }, {} as Record<string, { total: number; available: number; inUse: number; maintenance: number; assets: Asset[] }>);

  // Filter assets by selected lab (for main table)
  const filteredAssets = selectedLab ? assets.filter(asset => asset.lab === selectedLab) : assets;

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLabClick = (lab: string) => {
    setSelectedLab(lab);
    setTimeout(scrollToTable, 100);
  };

  const clearFilter = () => {
    setSelectedLab(null);
  };

  const toggleExpand = (lab: string) => {
    setExpandedLab(expandedLab === lab ? null : lab);
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

      {/* Dashboard Stats - Total Stock (clickable, no prompt text) + Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Total Stock card - click clears filter & scrolls, but no extra text */}
        <div
          onClick={() => {
            if (selectedLab) clearFilter();
            scrollToTable();
          }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all"
        >
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Package size={16} />
            <p className="text-[10px] font-bold uppercase">Total Stock</p>
          </div>
          <p className="text-xl font-bold text-slate-800">{totalItems}</p>
        </div>

        {/* Available card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <CheckCircle2 size={16} />
            <p className="text-[10px] font-bold uppercase">Available</p>
          </div>
          <p className="text-xl font-bold text-slate-800">{availableCount}</p>
        </div>

        {/* In Use card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Cpu size={16} />
            <p className="text-[10px] font-bold uppercase">In Use</p>
          </div>
          <p className="text-xl font-bold text-slate-800">{inUseCount}</p>
        </div>

        {/* Maintenance card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-rose-500 mb-1">
            <Wrench size={16} />
            <p className="text-[10px] font-bold uppercase">Maintenance</p>
          </div>
          <p className="text-xl font-bold text-slate-800">{maintenanceCount}</p>
        </div>
      </div>

      {/* Laboratories Summary with Expand/Collapse */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-indigo-500" /> Laboratories Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(labStats).map(([lab, stats]) => (
            <div key={lab} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              {/* Card Header - click to expand/collapse */}
              <div
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between"
                onClick={() => toggleExpand(lab)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {lab.charAt(0)}
                  </div>
                  <h4 className="font-bold text-slate-700">{lab}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {/* Total badge (click stops propagation to avoid toggling expand) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLabClick(lab);
                    }}
                    className="text-xs font-bold bg-indigo-100 hover:bg-indigo-200 px-2 py-1 rounded-full text-indigo-700 transition-colors"
                  >
                    {stats.total} total
                  </button>
                  {expandedLab === lab ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </div>
              </div>

              {/* Status bars (always visible) */}
              <div className="px-4 pb-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-emerald-50 rounded-lg p-2">
                  <p className="text-emerald-600 font-bold">{stats.available}</p>
                  <p className="text-[10px] text-slate-500">Available</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-blue-600 font-bold">{stats.inUse}</p>
                  <p className="text-[10px] text-slate-500">In Use</p>
                </div>
                <div className="bg-rose-50 rounded-lg p-2">
                  <p className="text-rose-600 font-bold">{stats.maintenance}</p>
                  <p className="text-[10px] text-slate-500">Maint.</p>
                </div>
              </div>

              {/* Expandable content: list of assets */}
              {expandedLab === lab && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 px-1">Assets in this lab</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stats.assets.map(asset => (
                      <div key={asset.id} className="bg-white rounded-lg p-2 flex items-center justify-between shadow-sm border border-slate-100">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{asset.name} {asset.model}</p>
                          <p className="text-[10px] text-slate-500">{asset.id}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          asset.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 
                          asset.status === 'In Use' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {asset.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {Object.keys(labStats).length === 0 && (
          <div className="text-center py-8 bg-slate-50 rounded-xl text-slate-400">
            No laboratories found
          </div>
        )}
      </div>

      {/* Table Section (with ref for scrolling) */}
      <div ref={tableRef} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, name, model, or laboratory..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-2">
            {selectedLab && (
              <button
                onClick={clearFilter}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-all"
              >
                <X size={18} /> Clear filter: {selectedLab}
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 font-semibold">
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        {selectedLab && (
          <div className="px-6 py-2 bg-indigo-50/50 border-b border-indigo-100 text-xs text-indigo-700 flex items-center gap-2">
            <MapPin size={14} /> Showing assets from <span className="font-bold">{selectedLab}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Asset ID</th>
                <th className="px-6 py-4">Asset Name</th>
                <th className="px-6 py-4">Model</th>
                <th className="px-6 py-4">Laboratory</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">{item.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">{item.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{item.model}</td>
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
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No assets found in this laboratory.
                  </td>
                </tr>
              )}
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
                <Plus size={20} /> Register New Asset(s)
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Asset Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    placeholder="e.g. Dell, Logitech, HP"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Model</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    placeholder="e.g. Optiplex 7080, G-Pro Mouse"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assign to Laboratory</label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none"
                    value={formData.lab}
                    onChange={(e) => setFormData({ ...formData, lab: e.target.value })}
                  >
                    <option value="Laboratory 1">Laboratory 1</option>
                    <option value="Laboratory 2">Laboratory 2</option>
                    <option value="Laboratory 3">Laboratory 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Initial Status</label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Asset['status'] })}
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Stock Quantity</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 1 })}
                />
                <p className="text-[10px] text-slate-400 mt-1">Creates this many identical assets with the selected status.</p>
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
                  <CheckCircle2 size={18} /> Save Asset(s)
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