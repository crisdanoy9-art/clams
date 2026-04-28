import React from 'react';
import { CircleDot } from 'lucide-react';

const labs = [
  { id: 1, name: 'Lab 1', room: 'Room 101', pcs: 30, avail: 28, issues: 2 },
  { id: 2, name: 'Lab 2', room: 'Room 102', pcs: 28, avail: 24, issues: 4 },
  { id: 3, name: 'Lab 3', room: 'Room 103', pcs: 28, avail: 22, issues: 6 },
];

const Laboratoriesincludes: React.FC = () => {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Laboratories</h2>
        <p className="text-xs text-slate-500 mt-0.5">CLAMS / Admin / Laboratories</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {labs.map((lab) => (
          <div
            key={lab.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{lab.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{lab.room}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                <CircleDot className="text-emerald-500 w-2 h-2 fill-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Online</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-4">
              <div>
                <p className="text-2xl font-bold text-slate-800">{lab.pcs}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PCS</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{lab.avail}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AVAILABLE</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-500">{lab.issues}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ISSUES</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Laboratoriesincludes;