import React, { useState } from 'react';
import { MousePointer2, Plus, RefreshCw, Package, X, Check } from 'lucide-react';

const Peripherals: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [peripherals, setPeripherals] = useState([
    { id: 1, name: 'Logitech USB Mouse', lab: 'Lab 1', working: 32, damaged: 3, category: 'Pointing Device' },
    { id: 2, name: 'Standard Keyboard', lab: 'Lab 2', working: 30, damaged: 0, category: 'Input' },
  ]);

  const [newItem, setNewItem] = useState({ name: '', lab: 'Lab 1', category: '', working: 0 });

  const handleAdd = () => {
    if (newItem.name && newItem.category) {
      setPeripherals([...peripherals, { ...newItem, id: Date.now(), damaged: 0 }]);
      setIsModalOpen(false);
      setNewItem({ name: '', lab: 'Lab 1', category: '', working: 0 });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Peripherals Inventory</h2>
          <p className="text-xs font-bold text-slate-400">Inventory tracking for Lab 1, 2, and 3</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <Plus size={18} /> Add New Item Type
        </button>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
              <h3 className="font-black uppercase tracking-tighter text-xl">Add Peripheral</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24}/></button>
            </div>
            <div className="p-8 space-y-4">
              <input type="text" placeholder="Item Name" className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-600 transition-all" onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
              <select className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-600 transition-all" onChange={(e) => setNewItem({...newItem, lab: e.target.value})}>
                <option>Lab 1</option><option>Lab 2</option><option>Lab 3</option>
              </select>
              <input type="text" placeholder="Category (e.g. Audio)" className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-600 transition-all" onChange={(e) => setNewItem({...newItem, category: e.target.value})} />
              <button onClick={handleAdd} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Confirm Entry</button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b">
            <tr>
              <th className="px-8 py-6">Peripheral</th>
              <th className="px-8 py-6 text-center">Lab</th>
              <th className="px-8 py-6 text-center">Stock</th>
              <th className="px-8 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-bold text-xs">
            {peripherals.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Package size={14}/></div>
                  <div><p className="text-slate-900">{p.name}</p><p className="text-[9px] text-slate-400 uppercase">{p.category}</p></div>
                </td>
                <td className="px-8 py-5 text-center"><span className="bg-slate-100 px-3 py-1 rounded-lg">{p.lab}</span></td>
                <td className="px-8 py-5 text-center text-indigo-600 font-black text-lg">{p.working}</td>
                <td className="px-8 py-5 text-right"><button className="p-3 bg-slate-50 rounded-xl hover:text-indigo-600 transition-all"><RefreshCw size={14}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Peripherals;