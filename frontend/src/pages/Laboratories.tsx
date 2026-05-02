import React, { useState, useEffect } from "react";
import {
  X,
  Monitor,
  AlertCircle,
  CheckCircle,
  FileText,
  Plus,
  Trash2,
  Power,
  Eye,
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
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [newLabName, setNewLabName] = useState("");
  const [newLabRoom, setNewLabRoom] = useState("");
  const [newLabPCs, setNewLabPCs] = useState(20);
  const [tempNote, setTempNote] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const isAdmin = userRole === "admin";

  // Auto‑hide notification after 2 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Reset temporary note when selected PC changes
  useEffect(() => {
    if (selectedPCId && currentSelectedPC) {
      setTempNote(currentSelectedPC.referenceNote || "");
    }
  }, [selectedPCId, editingPCs]);

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
      prev.map((pc) =>
        pc.id === pcId
          ? {
              ...pc,
              status: newStatus,
              referenceNote: newStatus === "available" ? undefined : pc.referenceNote,
            }
          : pc
      )
    );
  };

  const handleNoteSave = (pcId: number) => {
    setEditingPCs((prev) =>
      prev.map((pc) =>
        pc.id === pcId ? { ...pc, referenceNote: tempNote || undefined } : pc
      )
    );
    setNotification({ message: "Issue description saved", type: "success" });
  };

  const handleNoteCancel = () => {
    if (selectedPCId && currentSelectedPC) {
      setTempNote(currentSelectedPC.referenceNote || "");
      setNotification({ message: "Changes discarded", type: "info" });
    }
  };

  const handleDeletePC = (pcId: number) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete PC-${pcId.toString().padStart(2, "0")}? This will remove it from the lab inventory.`
    );
    if (confirmDelete) {
      setEditingPCs((prev) => prev.filter((pc) => pc.id !== pcId));
      setSidebarOpen(false);
      setSelectedPCId(null);
      setNotification({ message: "PC removed", type: "info" });
    }
  };

  const handleAddPC = () => {
    const nextId = Math.max(...editingPCs.map((pc) => pc.id), 0) + 1;
    const newPC: PC = {
      id: nextId,
      status: "available",
    };
    setEditingPCs((prev) => [...prev, newPC]);
    setNotification({ message: `Added ${getPCName(nextId)}`, type: "success" });
  };

  const handleSaveChanges = () => {
    if (!selectedLab) return;
    const available = editingPCs.filter(
      (pc) => pc.status === "available"
    ).length;
    const issues = editingPCs.filter(
      (pc) => pc.status === "unavailable"
    ).length;

    const updatedLab = {
      ...selectedLab,
      pcs: editingPCs.length,
      avail: available,
      issues: issues,
      pcsData: editingPCs,
    };
    setLabsData((prev) =>
      prev.map((lab) => (lab.id === selectedLab.id ? updatedLab : lab))
    );
    setSelectedLab(updatedLab);
    setEditMode(false);
    setSidebarOpen(false);
    setNotification({ message: "Infrastructure changes saved", type: "success" });
  };

  const handleAddLab = () => {
    if (!newLabName.trim() || !newLabRoom.trim() || newLabPCs < 1) {
      alert("Please fill all fields with valid values.");
      return;
    }

    const newId = Math.max(...labsData.map((lab) => lab.id), 0) + 1;
    const pcsData: PC[] = Array.from({ length: newLabPCs }, (_, i) => ({
      id: i + 1,
      status: "available",
    }));

    const newLab: Lab = {
      id: newId,
      name: newLabName.trim(),
      room: newLabRoom.trim(),
      pcs: newLabPCs,
      avail: newLabPCs,
      issues: 0,
      pcsData,
    };

    setLabsData((prev) => [...prev, newLab]);
    setShowAddLabModal(false);
    setNewLabName("");
    setNewLabRoom("");
    setNewLabPCs(20);
    setNotification({ message: `Laboratory "${newLab.name}" created`, type: "success" });
  };

  const getPCName = (id: number) => `PC-${id.toString().padStart(2, "0")}`;

  const currentSelectedPC = editingPCs.find((pc) => pc.id === selectedPCId);

  // Determine if sidebar should be in edit mode (admin + editMode)
  const isEditSidebar = isAdmin && editMode;

  return (
    <div className="p-8 animate-in fade-in duration-500">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-8 z-[60] animate-in slide-in-from-top-2 fade-in duration-300">
          <div
            className={`px-4 py-3 rounded-md shadow-lg text-xs font-bold uppercase tracking-wider ${
              notification.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-slate-700 text-white"
            }`}
          >
            {notification.message}
          </div>
        </div>
      )}

      {/* Header Section */}
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            Laboratory Management
          </h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mt-1 italic">
            Dapitan Main Campus System
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddLabModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md"
          >
            <Plus size={16} />
            Add Laboratory
          </button>
        )}
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

      {/* Add Laboratory Modal */}
      {showAddLabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowAddLabModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-md shadow-2xl p-8 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Add New Laboratory
              </h3>
              <button
                onClick={() => setShowAddLabModal(false)}
                className="p-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  Lab Name
                </label>
                <input
                  type="text"
                  value={newLabName}
                  onChange={(e) => setNewLabName(e.target.value)}
                  className="w-full border border-zinc-300 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Lab 4"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  Room
                </label>
                <input
                  type="text"
                  value={newLabRoom}
                  onChange={(e) => setNewLabRoom(e.target.value)}
                  className="w-full border border-zinc-300 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., CCS - Room 104"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  Total PCs
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newLabPCs}
                  onChange={(e) => setNewLabPCs(parseInt(e.target.value) || 1)}
                  className="w-full border border-zinc-300 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleAddLab}
                className="w-full py-3 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md"
              >
                Create Laboratory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Modal (existing lab detail) --- */}
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
                    <>
                      <button
                        onClick={() => setEditMode(!editMode)}
                        className={`px-6 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                          editMode
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {editMode ? "Exit Setup" : "Manage Units"}
                      </button>
                      {editMode && (
                        <button
                          onClick={handleAddPC}
                          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md"
                        >
                          <Plus size={14} />
                          Add PC
                        </button>
                      )}
                    </>
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
                        setSelectedPCId(pc.id);
                        setSidebarOpen(true);
                      }}
                      className={`flex flex-col items-center gap-3 transition-all cursor-pointer ${
                        selectedPCId === pc.id
                          ? "scale-110"
                          : "hover:scale-105"
                      }`}
                    >
                      <div
                        className={`p-5 rounded-md shadow-sm relative transition-all border-2 ${
                          pc.status === "available"
                            ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                            : "bg-rose-50 text-rose-500 border-rose-100"
                        } ${
                          selectedPCId === pc.id
                            ? "ring-4 ring-indigo-100 border-indigo-400"
                            : ""
                        }`}
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
                      {/* REMOVED: "Issue noted" badge */}
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

            {/* Sidebar – different content based on edit permission */}
            {sidebarOpen && selectedPCId && currentSelectedPC && (
              <div className="w-96 border-l border-zinc-200 bg-slate-50/50 p-10 flex flex-col animate-in slide-in-from-right duration-500">
                <div className="flex-1">
                  <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">
                    {isEditSidebar ? `Modify ${getPCName(selectedPCId)}` : `${getPCName(selectedPCId)} Details`}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">
                    {isEditSidebar ? "Select operational status" : "Current status & issue report"}
                  </p>

                  {isEditSidebar ? (
                    // --- EDIT MODE UI (admin only) ---
                    <>
                      <div className="space-y-4">
                        {/* Status: Available */}
                        <button
                          onClick={() =>
                            handleStatusChange(selectedPCId, "available")
                          }
                          className={`w-full flex items-center justify-between p-6 rounded-md border-2 transition-all ${
                            currentSelectedPC.status === "available"
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
                            className={`w-3 h-3 rounded-md ${
                              currentSelectedPC.status === "available"
                                ? "bg-white"
                                : "bg-emerald-500"
                            }`}
                          ></div>
                        </button>

                        {/* Status: Issue Reported */}
                        <button
                          onClick={() =>
                            handleStatusChange(selectedPCId, "unavailable")
                          }
                          className={`w-full flex items-center justify-between p-6 rounded-md border-2 transition-all ${
                            currentSelectedPC.status === "unavailable"
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
                            className={`w-3 h-3 rounded-md ${
                              currentSelectedPC.status === "unavailable"
                                ? "bg-white"
                                : "bg-rose-500"
                            }`}
                          ></div>
                        </button>
                      </div>

                      {/* Editable Issue Description (only when status is unavailable) */}
                      {currentSelectedPC.status === "unavailable" && (
                        <div className="mt-8 space-y-3">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            Issue Description / Reference Note
                          </label>
                          <textarea
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            rows={4}
                            className="w-full border border-zinc-300 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                            placeholder="Describe the issue (e.g., 'Faulty RAM', 'No display', 'Network error')..."
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleNoteSave(selectedPCId)}
                              className="flex-1 py-2 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all"
                            >
                              OK
                            </button>
                            <button
                              onClick={handleNoteCancel}
                              className="flex-1 py-2 bg-slate-200 text-slate-700 rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-slate-300 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // --- VIEW MODE UI (instructors or admin not in editMode) ---
                    <div className="space-y-6">
                      <div className="bg-white rounded-md border border-zinc-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            Current Status
                          </span>
                          <div
                            className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                              currentSelectedPC.status === "available"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-rose-50 text-rose-600"
                            }`}
                          >
                            {currentSelectedPC.status === "available"
                              ? "Available"
                              : "Issue Reported"}
                          </div>
                        </div>

                        {currentSelectedPC.status === "unavailable" && (
                          <>
                            <div className="border-t border-zinc-100 pt-4 mt-2">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                                Issue Description
                              </span>
                              <div className="bg-slate-50 p-4 rounded-md border border-zinc-200">
                                <p className="text-sm font-medium text-slate-700">
                                  {currentSelectedPC.referenceNote || "No description provided."}
                                </p>
                              </div>
                            </div>
                          </>
                        )}

                        {currentSelectedPC.status === "available" && (
                          <div className="mt-4 text-center py-6">
                            <CheckCircle size={32} className="mx-auto text-emerald-500 mb-2" />
                            <p className="text-xs text-slate-500">This PC is operational and ready for use.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Delete button only appears in edit mode (admin) */}
                {isEditSidebar && (
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
                )}

                {/* Close button for all modes */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="mt-6 w-full py-3 bg-slate-200 text-slate-700 rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-slate-300 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Initial Sample Data (with some example notes)
const generateInitialPCs = (count: number, issueIndices: number[]): PC[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    status: issueIndices.includes(i + 1) ? "unavailable" : "available",
    referenceNote: issueIndices.includes(i + 1)
      ? "Sample issue – needs hardware check"
      : undefined,
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