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
  Loader2,
} from "lucide-react";
import { LaboratoryFields } from "../lib/validations/laboratories";
import { AddModal } from "../components/reusableModal";
import { useTableData } from "../lib/hooks/useTableData";
import { useQueryClient } from "@tanstack/react-query";
import { deleteData, updateData } from "../lib/api/Methods";

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

const Laboratories: React.FC<LaboratoriesProps> = ({
  userRole,
  onNavigateToLogs,
}) => {
  const { data, isLoading, isError } = useTableData("laboratories");
  const queryClient = useQueryClient();
  const isAdmin = userRole === "admin";

  const [selectedLab, setSelectedLab] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPCId, setSelectedPCId] = useState<number | null>(null);
  const [editingPCs, setEditingPCs] = useState<PC[]>([]);
  const [tempNote, setTempNote] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);
  const [isDeletingLab, setIsDeletingLab] = useState<number | null>(null);
  const [isAddingPC, setIsAddingPC] = useState(false);
  const [isDeletingPC, setIsDeletingPC] = useState<number | null>(null);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [showModal, setModal] = useState(false);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (selectedPCId && currentSelectedPC) {
      setTempNote(currentSelectedPC.referenceNote || "");
    }
  }, [selectedPCId, editingPCs]);

  useEffect(() => {
    if (selectedLab) {
      const pcs: PC[] = Array.from(
        { length: selectedLab.total_stations },
        (_, i) => ({
          id: i + 1,
          status: "available",
        }),
      );
      setEditingPCs(pcs);
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
              referenceNote:
                newStatus === "available" ? undefined : pc.referenceNote,
            }
          : pc,
      ),
    );
  };

  const handleNoteSave = (pcId: number) => {
    setEditingPCs((prev) =>
      prev.map((pc) =>
        pc.id === pcId ? { ...pc, referenceNote: tempNote || undefined } : pc,
      ),
    );
    setNotification({ message: "Issue description saved", type: "success" });
  };

  const handleNoteCancel = () => {
    if (selectedPCId && currentSelectedPC) {
      setTempNote(currentSelectedPC.referenceNote || "");
      setNotification({ message: "Changes discarded", type: "info" });
    }
  };

  const handleDeletePC = async (pcId: number) => {
    if (!window.confirm(`Delete PC-${pcId.toString().padStart(2, "0")}?`))
      return;
    setIsDeletingPC(pcId);
    await new Promise((r) => setTimeout(r, 600));
    setEditingPCs((prev) => prev.filter((pc) => pc.id !== pcId));
    setSidebarOpen(false);
    setSelectedPCId(null);
    setNotification({ message: "PC removed", type: "info" });
    setIsDeletingPC(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedLab) return;
    setIsSavingChanges(true);
    try {
      await updateData("laboratories", selectedLab.lab_id, {
        total_stations: editingPCs.length,
      });
      queryClient.invalidateQueries({ queryKey: ["laboratories"] });
      setEditMode(false);
      setSidebarOpen(false);
      setNotification({
        message: "Infrastructure changes saved",
        type: "success",
      });
    } catch {
      setNotification({ message: "Failed to save changes", type: "info" });
    } finally {
      setIsSavingChanges(false);
    }
  };

  const handleDeleteLab = async (labId: number, labName: string) => {
    if (!window.confirm(`Delete "${labName}"? This is permanent.`)) return;
    setIsDeletingLab(labId);
    try {
      await deleteData("laboratories", labId);
      queryClient.invalidateQueries({ queryKey: ["laboratories"] });
      if (selectedLab?.lab_id === labId) setSelectedLab(null);
      setNotification({ message: `"${labName}" deleted`, type: "success" });
    } catch {
      setNotification({ message: "Failed to delete", type: "info" });
    } finally {
      setIsDeletingLab(null);
    }
  };

  const getPCName = (id: number) => `PC-${id.toString().padStart(2, "0")}`;
  const currentSelectedPC = editingPCs.find((pc) => pc.id === selectedPCId);
  const isEditSidebar = isAdmin && editMode;

  return (
    <div className="p-8 animate-in fade-in duration-500">
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
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md"
          >
            <Plus size={16} /> Add Laboratory
          </button>
        )}
      </header>

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data?.map((lab: any) => (
            <div
              key={lab.lab_id}
              className="relative bg-white p-8 rounded-md border border-zinc-200 shadow-sm hover:border-indigo-100 cursor-pointer transition-all group"
            >
              <div onClick={() => setSelectedLab(lab)}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-slate-800 text-2xl uppercase tracking-tighter">
                    {lab.lab_name}
                  </h4>
                  <div className="bg-emerald-50 text-emerald-500 px-3 py-1 rounded-md border border-emerald-100 text-[9px] font-black uppercase tracking-widest">
                    Active
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                  {lab.room_number} · {lab.building}
                </p>
                <div className="flex gap-6 border-t border-zinc-50 pt-6">
                  <div>
                    <p className="text-xl font-black text-slate-800">
                      {lab.total_stations}
                    </p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Total
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-emerald-500">
                      {lab.available_stations}
                    </p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Ready
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-rose-500">
                      {lab.damaged_stations}
                    </p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Issues
                    </p>
                  </div>
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteLab(lab.lab_id, lab.lab_name);
                  }}
                  disabled={isDeletingLab === lab.lab_id}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  {isDeletingLab === lab.lab_id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              )}
            </div>
          ))}
          {data?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest">
                No laboratories yet. Click "Add Laboratory" to create one.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-none"
            onClick={() => setSelectedLab(null)}
          />
          <div className="relative bg-white w-full max-w-7xl h-[85vh] rounded-md shadow-2xl flex overflow-hidden animate-[drop_0.6s_cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="flex-1 flex flex-col min-w-0">
              <div className="p-10 border-b border-zinc-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                  {selectedLab.lab_name} Infrastructure
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
                        if (!isAddingPC && !isDeletingPC && !isSavingChanges) {
                          setSelectedPCId(pc.id);
                          setSidebarOpen(true);
                        }
                      }}
                      className={`flex flex-col items-center gap-3 transition-all cursor-pointer ${selectedPCId === pc.id ? "scale-110" : "hover:scale-105"} ${isAddingPC || isDeletingPC || isSavingChanges ? "pointer-events-none opacity-50" : ""}`}
                    >
                      <div
                        className={`p-5 rounded-md shadow-sm relative transition-all border-2 ${pc.status === "available" ? "bg-emerald-50 text-emerald-500 border-emerald-100" : "bg-rose-50 text-rose-500 border-rose-100"} ${selectedPCId === pc.id ? "ring-4 ring-indigo-100 border-indigo-400" : ""}`}
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
                    disabled={isSavingChanges}
                    className="px-10 py-4 bg-slate-900 text-white rounded-md text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-xl transition-all disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSavingChanges ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save Infrastructure Changes"
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* sidebar here */}
          </div>
        </div>
      )}

      {showModal && (
        <AddModal
          fields={LaboratoryFields}
          table="laboratories"
          onClose={() => setModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["laboratories"] });
            setModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Laboratories;
