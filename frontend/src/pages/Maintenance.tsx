import React from 'react';
import { Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Maintenance: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Maintenance Logs</h2>
        <p className="text-xs text-slate-500 mt-1">CLAMS / Admin / Maintenance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-rose-500 rounded-lg text-white"><AlertTriangle /></div>
          <div><p className="text-xs text-rose-600 font-bold uppercase">Pending Repairs</p><p className="text-2xl font-bold text-rose-900">12</p></div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500 rounded-lg text-white"><Clock /></div>
          <div><p className="text-xs text-amber-600 font-bold uppercase">In Progress</p><p className="text-2xl font-bold text-amber-900">05</p></div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500 rounded-lg text-white"><CheckCircle /></div>
          <div><p className="text-xs text-emerald-600 font-bold uppercase">Resolved (Monthly)</p><p className="text-2xl font-bold text-emerald-900">48</p></div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-bold text-slate-800 mb-4">Recent Maintenance Tickets</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-indigo-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-500"><Wrench size={20}/></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Keyboard Replacement - PC #0{i}</p>
                  <p className="text-xs text-slate-500">Reported by: Staff Raylle • 2 hours ago</p>
                </div>
              </div>
              <button className="text-xs font-bold text-indigo-600 hover:underline">View Ticket</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;