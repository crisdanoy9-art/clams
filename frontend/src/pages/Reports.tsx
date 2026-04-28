import React, { useState } from 'react';
import { Send, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const Reports: React.FC<{ role: 'admin' | 'instructor' }> = ({ role }) => {
  // Mock state for Admin to demonstrate "Mark as Resolved"
  const [reports, setReports] = useState([
    { id: 1, instructor: 'Danoy', lab: 'Lab 2', issue: 'Monitor Flickering', status: 'pending', date: '2 hours ago' },
    { id: 2, instructor: 'Alolino', lab: 'Lab 1', issue: 'Missing Mouse', status: 'pending', date: '5 hours ago' }
  ]);

  const handleResolve = (id: number) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
  };

  if (role === 'instructor') {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-indigo-100/50 overflow-hidden">
          <div className="bg-indigo-600 p-10 text-white">
            <h2 className="text-2xl font-black uppercase tracking-tighter">File Damage Report</h2>
            <p className="text-indigo-100 text-xs mt-2 font-bold opacity-80">Report equipment issues directly to Raylle</p>
          </div>
          <form className="p-10 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Laboratory</label>
              <select className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold focus:border-indigo-600 outline-none transition-all">
                <option>Lab 1 - CCS Building</option>
                <option>Lab 2 - CCS Building</option>
                <option>Lab 3 - CCS Building</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Problem Description</label>
              <textarea rows={4} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold focus:border-indigo-600 outline-none transition-all" placeholder="Describe the hardware or software issue..." />
            </div>
            <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3">
              <Send size={18}/> Submit to Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Instructor Reports Inbox</h2>
      <div className="grid gap-4">
        {reports.map((report) => (
          <div key={report.id} className={`bg-white p-6 rounded-3xl border-2 transition-all ${report.status === 'resolved' ? 'border-emerald-100 opacity-60' : 'border-slate-100 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${report.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                  {report.status === 'resolved' ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
                </div>
                <div>
                  <p className="font-black text-slate-800 text-lg">"{report.issue}"</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                    From Instructor {report.instructor} • {report.lab} • {report.date}
                  </p>
                </div>
              </div>
              {report.status === 'pending' ? (
                <button 
                  onClick={() => handleResolve(report.id)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all"
                >
                  Mark as Resolved
                </button>
              ) : (
                <span className="text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-4 py-2 rounded-lg">Fixed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;