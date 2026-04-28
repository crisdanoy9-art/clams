import React from 'react';
import { Send, AlertTriangle, CheckCircle } from 'lucide-react';

const Reports: React.FC<{ role: 'admin' | 'instructor' }> = ({ role }) => {
  
  // INSTRUCTOR VIEW: THE FORM
  if (role === 'instructor') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white">
            <h2 className="text-xl font-black uppercase">File a New Report</h2>
            <p className="text-indigo-100 text-xs mt-1 font-medium italic">Report broken equipment or lab issues directly to the Admin.</p>
          </div>
          <form className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Issue Category</label>
                <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option>Broken Peripheral</option>
                  <option>Software Issue</option>
                  <option>Power/Electric</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Lab Location</label>
                <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option>Lab 1</option>
                  <option>Lab 2</option>
                  <option>Multimedia</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
              <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Explain the problem in detail..." />
            </div>
            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <Send size={18}/> Submit Report
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN VIEW: THE LOG
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800 uppercase">Instructor Reports Inbox</h2>
      </div>
      <div className="grid gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-rose-50 text-rose-500 p-3 rounded-xl"><AlertTriangle size={20}/></div>
              <div>
                <p className="font-bold text-slate-800 text-sm italic">"Mouse in PC-12 is not responding"</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Submitted by Instructor Danoy • Lab 1</p>
              </div>
            </div>
            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase">Mark Resolved</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;