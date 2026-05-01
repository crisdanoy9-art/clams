import React, { useState, useEffect } from "react";
import {
  CircleDot,
  X,
  Monitor,
  Info,
  Edit3,
  Save,
  AlertCircle,
  CheckCircle,
  FileText,
  Sidebar,
  Plus,
  Trash2,
  Power,
  Trash,
} from "lucide-react";

interface LaboratoriesProps {
  userRole: "admin" | "instructor";
  onNavigateToLogs: () => void;
}

type PCStatus = "available" | "unavailable";

interface PC {
  id: number;
  status: PCStatus;
  referenceNote?: string;
}

interface Lab {
  id: number;
  name: string;
  room: string;
  pcs: number;
  avail: number;
  issues: number;
  pcsData: PC[];
}

const Laboratories: React.FC<LaboratoriesProps> = ({
  userRole,
  onNavigateToLogs,
}) => {
  const [labsData, setLabsData] = useState<Lab[]>(initialLabs);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPCId, setSelectedPCId] = useState<number | null>(null);
  const [editingPCs, setEditingPCs] = useState<PC[]>([]);

  const isAdmin = userRole === "admin";

  useEffect(() => {
    if (selectedLab) {
      setEditingPCs(JSON.parse(JSON.stringify(selectedLab.pcsData)));
      setEditMode(false);
      setSidebarOpen(false);
      setSelectedPCId(null);
    }
  }, [selectedLab]);

  const handleStatusChange = (pcId: number, newStatus: PCStatus) => {
    setEditingPCs((prev) =>
      prev.map((pc) => (pc.id === pcId ? { ...pc, status: newStatus } : pc)),
    );
  };

  const handleDeletePC = (pcId: number) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete PC-${pcId.toString().padStart(2, "0")}? This will remove it from the lab inventory.`,
    );
    if (confirmDelete) {
      setEditingPCs((prev) => prev.filter((pc) => pc.id !== pcId));
      setSidebarOpen(false);
      setSelectedPCId(null);
    }
  };

  const handleSaveChanges = () => {
    if (!selectedLab) return;
    const available = editingPCs.filter(
      (pc) => pc.status === "available",
    ).length;
    const issues = editingPCs.filter(
      (pc) => pc.status === "unavailable",
    ).length;

    const updatedLab = {
      ...selectedLab,
      pcs: editingPCs.length,
      avail: available,
      issues: issues,
      pcsData: editingPCs,
    };
    setLabsData((prev) =>
      prev.map((lab) => (lab.id === selectedLab.id ? updatedLab : lab)),
    );
    setSelectedLab(updatedLab);
    setEditMode(false);
    setSidebarOpen(false);
  };

  const getPCName = (id: number) => `PC-${id.toString().padStart(2, "0")}`;

  return (
    <div className="p-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
          Laboratory Management
        </h2>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mt-1 italic">
          Dapitan Main Campus System
        </p>
      </header>

      {/* Lab Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {labsData.map((lab) => (
          <div
            key={lab.id}
            onClick={() => setSelectedLab(lab)}
            className="bg-white p-8 rounded-md border border-zinc-200 shadow-sm hover:border-indigo-100 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-black text-slate-800 text-2xl uppercase tracking-tighter">
                {lab.name}
              </h4>
              <div className="bg-emerald-50 text-emerald-500 px-3 py-1 rounded-md border border-emerald-100 text-[9px] font-black uppercase tracking-widest">
                Active
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
              {lab.room}
            </p>
            <div className="flex gap-6 border-t border-zinc-50 pt-6">
              <div>
                <p className="text-xl font-black text-slate-800">{lab.pcs}</p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Total
                </p>
              </div>
              <div>
                <p className="text-xl font-black text-emerald-500">
                  {lab.avail}
                </p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Ready
                </p>
              </div>
              <div>
                <p className="text-xl font-black text-rose-500">{lab.issues}</p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Issues
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Main Modal --- */}
      {selectedLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-none"
            onClick={() => setSelectedLab(null)}
          ></div>

          <div className="relative bg-white w-full max-w-7xl h-[85vh] rounded-md shadow-2xl flex overflow-hidden animate-[drop_0.6s_cubic-bezier(0.34,1.56,0.64,1)]">
            {/* Main PC View */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="p-10 border-b border-zinc-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                  {selectedLab.name} Infrastructure
                </h3>
                <div className="flex gap-4">
                  {isAdmin && (
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className={`px-6 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${editMode ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      {editMode ? "Exit Setup" : "Manage Units"}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedLab(null)}
                    className="p-3 bg-slate-100 rounded-md hover:bg-slate-200 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 bg-slate-50/20">
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-8">
                  {editingPCs.map((pc) => (
                    <div
                      key={pc.id}
                      onClick={() => {
                        if (isAdmin) {
                          setSelectedPCId(pc.id);
                          setSidebarOpen(true);
                        }
                      }}
                      className={`flex flex-col items-center gap-3 transition-all cursor-pointer ${selectedPCId === pc.id ? "scale-110" : "hover:scale-105"}`}
                    >
                      <div
                        className={`p-5 rounded-md shadow-sm relative transition-all border-2 ${
                          pc.status === "available"
                            ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                            : "bg-rose-50 text-rose-500 border-rose-100"
                        } ${selectedPCId === pc.id ? "ring-4 ring-indigo-100 border-indigo-400" : ""}`}
                      >
                        <Monitor size={30} />
                        {selectedPCId === pc.id && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-white ring-4 ring-white">
                            <Power size={12} />
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        {getPCName(pc.id)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 border-t border-zinc-50 flex justify-between bg-white">
                <button
                  onClick={onNavigateToLogs}
                  className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-2 transition-transform"
                >
                  <FileText size={16} /> View Maintenance Logs
                </button>
                {editMode && (
                  <button
                    onClick={handleSaveChanges}
                    className="px-10 py-4 bg-slate-900 text-white rounded-md text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95"
                  >
                    Save Infrastructure Changes
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar Control Panel */}
            {sidebarOpen && selectedPCId && (
              <div className="w-96 border-l border-zinc-200 bg-slate-50/50 p-10 flex flex-col animate-in slide-in-from-right duration-500">
                <div className="flex-1">
                  <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">
                    Modify {getPCName(selectedPCId)}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">
                    Select operational status
                  </p>

                  <div className="space-y-4">
                    {/* Status: Green */}
                    <button
                      onClick={() =>
                        handleStatusChange(selectedPCId, "available")
                      }
                      className={`w-full flex items-center justify-between p-6 rounded-md border-2 transition-all ${
                        editingPCs.find((pc) => pc.id === selectedPCId)
                          ?.status === "available"
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                          : "bg-white border-zinc-200 text-slate-400 hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <CheckCircle size={20} />
                        <span className="font-black uppercase tracking-widest text-[11px]">
                          Available
                        </span>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-md ${editingPCs.find((pc) => pc.id === selectedPCId)?.status === "available" ? "bg-white" : "bg-emerald-500"}`}
                      ></div>
                    </button>

                    {/* Status: Red */}
                    <button
                      onClick={() =>
                        handleStatusChange(selectedPCId, "unavailable")
                      }
                      className={`w-full flex items-center justify-between p-6 rounded-md border-2 transition-all ${
                        editingPCs.find((pc) => pc.id === selectedPCId)
                          ?.status === "unavailable"
                          ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100"
                          : "bg-white border-zinc-200 text-slate-400 hover:border-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <AlertCircle size={20} />
                        <span className="font-black uppercase tracking-widest text-[11px]">
                          Issue Reported
                        </span>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-md ${editingPCs.find((pc) => pc.id === selectedPCId)?.status === "unavailable" ? "bg-white" : "bg-rose-500"}`}
                      ></div>
                    </button>
                  </div>
                </div>

                {/* Destructive Action Area */}
                <div className="pt-8 border-t border-slate-200 mt-auto">
                  <p className="text-[9px] font-black text-rose-400 uppercase mb-4 tracking-widest">
                    REMOVE PC SELECTION
                  </p>
                  <button
                    onClick={() => handleDeletePC(selectedPCId)}
                    className="w-full flex items-center justify-center gap-2 p-5 bg-rose-50 text-rose-600 rounded-md border border-rose-100 hover:bg-rose-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest group"
                  >
                    <Trash2 size={16} className="group-hover:animate-bounce" />
                    REMOVE PC
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Initial Sample Data (Stay consistent with your lab counts)
const generateInitialPCs = (count: number, issueIndices: number[]): PC[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    status: issueIndices.includes(i + 1) ? "unavailable" : "available",
  }));

const initialLabs: Lab[] = [
  {
    id: 1,
    name: "Lab 1",
    room: "CCS - Room 101",
    pcs: 30,
    avail: 28,
    issues: 2,
    pcsData: generateInitialPCs(30, [1, 2]),
  },
  {
    id: 2,
    name: "Lab 2",
    room: "CCS - Room 102",
    pcs: 28,
    avail: 24,
    issues: 4,
    pcsData: generateInitialPCs(28, [5, 10, 11, 12]),
  },
  {
    id: 3,
    name: "Lab 3",
    room: "CCS - Room 103",
    pcs: 20,
    avail: 15,
    issues: 5,
    pcsData: generateInitialPCs(20, [1, 2, 3, 4, 5]),
  },
];

export default Laboratories;
