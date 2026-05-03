import React, { useState } from "react";
import { X, Monitor, FileText, Plus, Power, Loader2 } from "lucide-react";
import { LaboratoryFields } from "../lib/validations/laboratories";
import { AddModal } from "../components/reusableModal";
import { useTableData } from "../lib/hooks/useTableData";
import { useQueryClient } from "@tanstack/react-query";
import { LabSideBar } from "./Laboratories/sideBar";

interface LaboratoriesProps {
  userRole: "admin" | "instructor";
  onNavigateToLogs: () => void;
}

const Laboratories: React.FC<LaboratoriesProps> = ({
  userRole,
  onNavigateToLogs,
}) => {
  const { data: labsData, isLoading } = useTableData("laboratories");
  const { data: equipment } = useTableData("equipment");
  const queryClient = useQueryClient();
  const isAdmin = userRole === "admin";

  const [selectedLab, setSelectedLab] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedPCId, setSelectedPCId] = useState<number | null>(null);
  const [showModal, setModal] = useState(false);
  const [sideBarOpen, setSidebarOpen] = useState(false);
  const [isDeletingPC, setIsDeletingPC] = useState<number | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<number, string>
  >({});

  const labEquipment =
    equipment?.filter(
      (e: any) => e.lab_id === selectedLab?.lab_id && !e.is_deleted,
    ) ?? [];

  const selectedPCData = equipment?.find(
    (pc: any) => pc.equipment_id === selectedPCId,
  );

  const handleStatusChange = async (id: number, status: string) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: status }));
  };

  const handleDeletePC = (id: number) => {
    setIsDeletingPC(id);
    queryClient.invalidateQueries({ queryKey: ["equipment"] });
    queryClient.invalidateQueries({ queryKey: ["laboratories"] });
    setSidebarOpen(false);
    setSelectedPCId(null);
    setEditMode(false);
    setIsDeletingPC(null);
  };

  const handleSaveNote = (id: number, note: string) => {
    queryClient.invalidateQueries({ queryKey: ["equipment"] });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedPCId(null);
    setEditMode(false);
  };

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

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {labsData?.map((lab: any) => {
          const thisLabEquipment =
            equipment?.filter(
              (e: any) => e.lab_id === lab.lab_id && !e.is_deleted,
            ) ?? [];

          const totalCount = thisLabEquipment.length;
          const availableCount = thisLabEquipment.filter(
            (e: any) => e.status === "available",
          ).length;
          const issuesCount = thisLabEquipment.filter(
            (e: any) => e.status === "unavailable",
          ).length;

          return (
            <div
              key={lab.lab_id}
              className="relative bg-white p-8 rounded-md border border-zinc-200 shadow-sm hover:border-indigo-400 cursor-pointer transition-all group"
              onClick={() => setSelectedLab(lab)}
            >
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
                    {totalCount}
                  </p>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                    Total
                  </p>
                </div>
                <div>
                  <p className="text-xl font-black text-emerald-500">
                    {availableCount}
                  </p>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                    Ready
                  </p>
                </div>
                <div>
                  <p className="text-xl font-black text-rose-500">
                    {issuesCount}
                  </p>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                    Issues
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => {
              setSelectedLab(null);
              setSidebarOpen(false);
              setSelectedPCId(null);
            }}
          />

          <div className="relative bg-white w-full max-w-7xl h-[85vh] rounded-md shadow-2xl flex overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-100">
              <div className="p-10 border-b border-zinc-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                  {selectedLab.lab_name} Infrastructure
                </h3>
                <div className="flex gap-4">
                  {selectedPCData && (
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
                  )}
                  <button
                    onClick={() => {
                      setSelectedLab(null);
                      setSidebarOpen(false);
                      setSelectedPCId(null);
                    }}
                    className="p-3 bg-slate-100 rounded-md hover:bg-slate-200 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 bg-slate-50/20">
                {labEquipment.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <div className="p-6 bg-slate-100 rounded-md">
                      <Monitor size={40} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                      No Equipment Found
                    </p>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                      This lab has no units registered yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-8">
                    {labEquipment.map((pc: any) => {
                      const effectiveStatus =
                        statusOverrides[pc.equipment_id] ?? pc.status;

                      return (
                        <div
                          key={pc.equipment_id}
                          onClick={() => {
                            if (selectedPCId === pc.equipment_id) {
                              setSelectedPCId(null);
                              setSidebarOpen(false);
                            } else {
                              setSelectedPCId(pc.equipment_id);
                              setSidebarOpen(true);
                            }
                          }}
                          className={`flex flex-col items-center gap-3 transition-all cursor-pointer ${
                            selectedPCId === pc.equipment_id
                              ? "scale-110"
                              : "hover:scale-105"
                          }`}
                        >
                          <div
                            className={`p-5 rounded-md shadow-sm relative transition-all border-2 ${
                              effectiveStatus === "available"
                                ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                                : "bg-rose-50 text-rose-500 border-rose-100"
                            } ${
                              selectedPCId === pc.equipment_id
                                ? "ring-4 ring-indigo-100 border-indigo-400"
                                : ""
                            }`}
                          >
                            <Monitor size={30} />
                            {selectedPCId === pc.equipment_id && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-white ring-4 ring-white">
                                <Power size={12} />
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter text-center leading-tight">
                            {pc.asset_tag || `PC-${pc.equipment_id}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-zinc-50 flex justify-between bg-white">
                <button
                  onClick={onNavigateToLogs}
                  className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-2 transition-transform"
                >
                  <FileText size={16} /> View Maintenance Logs
                </button>
              </div>
            </div>

            <div
              className={`relative transition-all duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)] 
                ${sideBarOpen ? "w-96 translate-x-0 opacity-100" : "w-0 translate-x-full opacity-0"}`}
            >
              <LabSideBar
                isEditSidebar={editMode}
                selectedPC={selectedPCData}
                onClose={closeSidebar}
                onStatusChange={handleStatusChange}
                onDeletePC={handleDeletePC}
                isDeletingPC={isDeletingPC}
                onSaveNote={handleSaveNote}
              />
            </div>
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
