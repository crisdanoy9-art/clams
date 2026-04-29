import React, { useState } from 'react';
import { 
  AlertTriangle, Send, Clock, Wrench, CheckCircle2, 
  User, Plus, X, Monitor, MessageSquare, MoreVertical, Check
} from 'lucide-react';

interface DamageReport {
  id: string;
  item: string;
  reportedBy: string;
  description: string;
  date: string;
  status: 'Pending' | 'Under Repair' | 'Resolved';
}

interface DamageReportsProps {
  userRole: 'admin' | 'instructor';
}

const DamageReports: React.FC<DamageReportsProps> = ({ userRole }) => {
  const isAdmin = userRole === 'admin';
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Master state for reports
  const [reports, setReports] = useState<DamageReport[]>([
    
  ]);

  const [formData, setFormData] = useState({ item: '', description: '' });

  // Instructor: Submit New Report
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: DamageReport = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      item: formData.item,
      reportedBy: isAdmin ? 'Raylle Admin' : 'Staff Instructor',
      description: formData.description,
      date: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    setReports([newReport, ...reports]);
    setIsModalOpen(false);
    setFormData({ item: '', description: '' });
  };

  // Admin: Toggle Status
  const handleUpdateStatus = (id: string, nextStatus: 'Pending' | 'Under Repair' | 'Resolved') => {
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, status: nextStatus } : report
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            {isAdmin ? 'Incident Management' : 'Damage Reports'}
          </h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mt-2 italic">
            {isAdmin ? 'Master control for asset health' : 'Report equipment issues to Raylle Admin'}
          </p>
        </div>
        
        {!isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Plus size={16} /> New Report
          </button>
        )}
      </header>

      {/* Main Table / List */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
            {isAdmin ? 'All Laboratory Incident Logs' : 'My Submission History'}
          </h3>
          {isAdmin && <span className="text-[9px] font-bold text-indigo-500 uppercase">Admin Access Active</span>}
        </div>
        
        <div className="divide-y divide-slate-50">
          {reports.map((report) => (
            <div key={report.id} className="p-8 hover:bg-slate-50/50 transition-colors group flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  report.status === 'Pending' ? 'bg-rose-50 text-rose-500' : 
                  report.status === 'Under Repair' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                }`}>
                  {report.status === 'Pending' ? <Clock size={24} /> : 
                   report.status === 'Under Repair' ? <Wrench size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{report.id}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{report.date}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-800 tracking-tight">{report.item}</h4>
                  <p className="text-xs text-slate-500 italic mt-1 font-medium max-w-xl">"{report.description}"</p>
                  
                  {isAdmin && (
                    <div className="flex items-center gap-2 mt-4 text-slate-400">
                      <User size={12} className="text-indigo-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Reporter: {report.reportedBy}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-4">
                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${
                  report.status === 'Pending' ? 'border-rose-100 bg-rose-50 text-rose-500' : 
                  report.status === 'Under Repair' ? 'border-amber-100 bg-amber-50 text-amber-500' : 'border-emerald-100 bg-emerald-50 text-emerald-600'
                }`}>
                  {report.status}
                </span>

                {/* ADMIN ONLY ACTIONS */}
                {isAdmin && report.status !== 'Resolved' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(report.id, 'Under Repair')}
                      className="p-2 hover:bg-amber-50 text-slate-300 hover:text-amber-500 rounded-xl transition-all"
                      title="Mark as Under Repair"
                    >
                      <Wrench size={16} />
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(report.id, 'Resolved')}
                      className="p-2 hover:bg-emerald-50 text-slate-300 hover:text-emerald-500 rounded-xl transition-all"
                      title="Mark as Resolved"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INSTRUCTOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-200">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Report Incident</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Damage Details</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-300 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Monitor size={12} /> Target PC / Peripheral
                </label>
                <input 
                  required
                  value={formData.item}
                  onChange={(e) => setFormData({...formData, item: e.target.value})}
                  className="w-full p-5 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 ring-indigo-500 outline-none"
                  placeholder="e.g. PC-12 or Mouse Lab 1"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <MessageSquare size={12} /> Describe the Issue
                </label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-5 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 ring-indigo-500 outline-none resize-none"
                  placeholder="What is wrong with the equipment?"
                />
              </div>

              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10">
                Send to Raylle Admin
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DamageReports;