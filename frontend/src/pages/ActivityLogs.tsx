import React from 'react';
import { History, ShieldCheck, Database, UserPlus, AlertCircle } from 'lucide-react';

const ActivityLogs: React.FC = () => {
  const logs = [
    { id: 1, user: 'Raylle', action: 'Added New Equipment', details: 'Dell OptiPlex (CCS-PC-104)', time: '2 mins ago', icon: <Database size={14}/>, color: 'bg-emerald-50 text-emerald-600' },
    { id: 2, user: 'Danoy', action: 'Filed Damage Report', details: 'Mouse Failure in Lab 2', time: '45 mins ago', icon: <AlertCircle size={14}/>, color: 'bg-rose-50 text-rose-600' },
    { id: 3, user: 'Raylle', action: 'Updated User Role', details: 'Changed Alolino to Admin', time: '2 hours ago', icon: <UserPlus size={14}/>, color: 'bg-indigo-50 text-indigo-600' },
    { id: 4, user: 'Raylle', action: 'System Login', details: 'Successful login from IP 192.168.1.1', time: '4 hours ago', icon: <ShieldCheck size={14}/>, color: 'bg-slate-50 text-slate-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">System Activity Logs</h2>
        <p className="text-xs font-bold text-slate-400">Audit trail of all administrative and instructor actions</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
              <div className={`p-3 rounded-xl shrink-0 ${log.color}`}>
                {log.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-black text-slate-800">{log.action}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{log.time}</span>
                </div>
                <p className="text-xs font-bold text-slate-500">
                  User <span className="text-indigo-600 underline underline-offset-4 decoration-2">{log.user}</span>: {log.details}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
          <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
            Load Older Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;