import React, { useState } from 'react';
import { CircleDot, X, Monitor, Info } from 'lucide-react';

// Mock Data for Labs
const labs = [
  { id: 1, name: 'Lab 1', room: 'Room 101', pcs: 30, avail: 28, issues: 2 },
  { id: 2, name: 'Lab 2', room: 'Room 102', pcs: 28, avail: 24, issues: 4 },
  { id: 3, name: 'Lab 3', room: 'Room 103', pcs: 20, avail: 15, issues: 5 },
];

// Mock Data for individual PCs within a lab
const generatePCs = (count: number, issues: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    status: i < count - issues ? 'available' : 'unavailable',
  }));
};

const Laboratories: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState<typeof labs[0] | null>(null);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Laboratories</h2>
        <p className="text-xs text-slate-500 mt-0.5">CLAMS / Admin / Laboratories</p>
      </div>

      {/* Lab Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {labs.map((lab) => (
          <div
            key={lab.id}
            onClick={() => setSelectedLab(lab)}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{lab.name}</h4>
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
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{lab.avail}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">READY</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-500">{lab.issues}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ISSUES</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL SECTION --- */}
      {selectedLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedLab.name} - Unit Status</h3>
                <p className="text-sm text-slate-500">Inventory breakdown for {selectedLab.room}</p>
              </div>
              <button 
                onClick={() => setSelectedLab(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable PC Grid) */}
            <div className="p-8 overflow-y-auto bg-white">
              {/* Legend */}
              <div className="flex gap-6 mb-8 p-3 bg-slate-50 rounded-lg w-fit">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-slate-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-slate-600">Unavailable / Issue</span>
                </div>
              </div>

              {/* PC Icons Organized Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {generatePCs(selectedLab.pcs, selectedLab.issues).map((pc) => (
                  <div 
                    key={pc.id} 
                    className="flex flex-col items-center gap-1 group cursor-help"
                    title={`PC Unit #${pc.id} - ${pc.status.toUpperCase()}`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      pc.status === 'available' 
                      ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' 
                      : 'bg-rose-50 text-rose-500 border border-rose-100'
                    }`}>
                      <Monitor size={24} strokeWidth={pc.status === 'available' ? 2 : 1.5} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">PC-{pc.id.toString().padStart(2, '0')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedLab(null)}
                className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-all"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2">
                <Info size={16} /> View Lab Logs
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Laboratories;