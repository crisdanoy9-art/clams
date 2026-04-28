import React, { useState } from 'react';
import { ClipboardList, Plus, RotateCcw, Search, User, Package, Calendar } from 'lucide-react';

interface BorrowReturnProps {
  role: 'admin' | 'instructor';
}

const BorrowReturn: React.FC<BorrowReturnProps> = ({ role }) => {
  const [transactions, setTransactions] = useState([
    { id: 1, borrower: 'Johannes Leo', item: 'Logitech Headset', date: 'Apr 27, 2026', status: 'Borrowed' },
    { id: 2, borrower: 'Bernadette M.', item: 'VGA Adapter', date: 'Apr 25, 2026', status: 'Overdue' },
    { id: 3, borrower: 'James Lovell', item: 'Webcam C922', date: 'Apr 28, 2026', status: 'Borrowed' },
  ]);

  const handleReturn = (id: number) => {
    if (role !== 'instructor') return; // Only instructors handle returns per your request
    setTransactions(transactions.filter(t => t.id !== id));
    alert("Item marked as returned and inventory updated.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Borrow & Return</h2>
          <p className="text-xs font-bold text-slate-400">Track movement of lab accessories and equipment</p>
        </div>

        {/* ROLE PROTECTION: Only Instructor can create new logs */}
        {role === 'instructor' && (
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
            <Plus size={18} /> New Borrow Entry
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-indigo-600" size={18} />
            <span className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Active Logs</span>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search borrower name..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-[0.15em]">
                <th className="px-8 py-5">Borrower</th>
                <th className="px-8 py-5">Equipment / Item</th>
                <th className="px-8 py-5">Issue Date</th>
                <th className="px-8 py-5">Status</th>
                {role === 'instructor' && <th className="px-8 py-5 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="text-xs font-bold text-slate-600 divide-y divide-slate-50">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        <User size={14} />
                      </div>
                      <span className="text-slate-900">{t.borrower}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-slate-300" />
                      {t.item}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={14} />
                      {t.date}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase font-black tracking-tighter ${
                      t.status === 'Overdue' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  {role === 'instructor' && (
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleReturn(t.id)}
                        className="flex items-center gap-2 ml-auto text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-xl group-hover:bg-indigo-600 group-hover:text-white"
                      >
                        <RotateCcw size={14} />
                        <span className="text-[10px] uppercase font-black">Return Item</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BorrowReturn;