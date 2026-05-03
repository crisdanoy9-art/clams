import { useState, useEffect, useRef } from "react";
import { CheckCircle, AlertCircle, Trash2, Loader2 } from "lucide-react";
import { updateData, addData } from "../../lib/api/Methods";
import { useTableData } from "../../lib/hooks/useTableData";

type Props = {
  selectedPC: any;
  onClose: () => void;
  isEditSidebar: boolean;
  onStatusChange?: (id: number, status: string) => void;
  onDeletePC?: (id: number) => void;
  isDeletingPC?: number | null;
  onSaveNote?: (id: number, note: string) => void;
};

export const LabSideBar = ({
  selectedPC,
  onClose,
  isEditSidebar,
  onStatusChange,
  onDeletePC,
  isDeletingPC,
  onSaveNote,
}: Props) => {
  const [tempNote, setTempNote] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "available" | "unavailable"
  >("available");
  const [isProcessing, setIsProcessing] = useState(false);
  const timeoutRef = useRef<any>(null);
  const { data: reports, isLoading, isError } = useTableData("damage_reports");
  useEffect(() => {
    if (selectedPC) {
      setTempNote(selectedPC.referenceNote || "");
      setSelectedStatus(
        selectedPC.status === "available" ? "available" : "unavailable",
      );
    }
  }, [selectedPC?.equipment_id]); // only reset when switching to a different PC

  if (!selectedPC) return null;

  const getInstructorId = () => {
    return (
      localStorage.getItem("user_id") || "f51f9f9e-775f-43e6-965c-0a1e7f8837da"
    );
  };

  // Fire instantly on click so the monitor recolors immediately
  const handleStatusClick = (status: "available" | "unavailable") => {
    setSelectedStatus(status);
    onStatusChange?.(selectedPC.equipment_id, status); // 👈 instant update to parent
  };

  const handleSaveChanges = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      await updateData("equipment", selectedPC.equipment_id, {
        status: selectedStatus,
      });

      if (
        selectedStatus === "unavailable" &&
        tempNote &&
        tempNote.trim() !== ""
      ) {
        await addData("damage_reports", {
          equipment_id: selectedPC.equipment_id,
          lab_id: selectedPC.lab_id,
          instructor_id: getInstructorId(),
          subject: `Issue with ${selectedPC.asset_tag || `PC-${selectedPC.equipment_id}`}`,
          description: tempNote,
          status: "pending",
        });
      }

      if (tempNote !== (selectedPC.referenceNote || "")) {
        await updateData("equipment", selectedPC.equipment_id, {
          referenceNote: tempNote,
        });
      }

      onSaveNote?.(selectedPC.equipment_id, tempNote);
      onClose(); // close after save is fully done
    } catch (error) {
      console.error("Error:", error);
    } finally {
      timeoutRef.current = setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  const handleDelete = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await updateData("equipment", selectedPC.equipment_id, {
        is_deleted: true,
      });
      onDeletePC?.(selectedPC.equipment_id);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  const report = reports.find(
    (k: any) => k.equipment_id === selectedPC.equipment_id,
  );
  return (
    <div className="w-96 border-l border-zinc-200 bg-slate-50/50 p-10 flex flex-col overflow-y-auto h-full">
      <div className="flex-1">
        <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">
          {isEditSidebar
            ? `Modify ${selectedPC.asset_tag || "Unit"}`
            : `${selectedPC.asset_tag || "Unit"} Details`}
        </h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">
          {isEditSidebar
            ? "Select operational status"
            : "Current status & issue report"}
        </p>

        {isEditSidebar ? (
          <>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleStatusClick("available")} // 👈 changed
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-6 rounded-md border-2 transition-all duration-200 ${
                  selectedStatus === "available"
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                    : "bg-white border-zinc-200 text-slate-400 hover:border-emerald-200"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <CheckCircle size={20} />
                  <span className="font-black uppercase tracking-widest text-[11px]">
                    Available
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full border ${selectedStatus === "available" ? "bg-white border-white" : "bg-transparent border-slate-200"}`}
                />
              </button>

              <button
                type="button"
                onClick={() => handleStatusClick("unavailable")} // 👈 changed
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-6 rounded-md border-2 transition-all duration-200 ${
                  selectedStatus === "unavailable"
                    ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100"
                    : "bg-white border-zinc-200 text-slate-400 hover:border-rose-200"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <AlertCircle size={20} />
                  <span className="font-black uppercase tracking-widest text-[11px]">
                    Issue Reported
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full border ${selectedStatus === "unavailable" ? "bg-white border-white" : "bg-transparent border-slate-200"}`}
                />
              </button>
            </div>

            {selectedStatus === "unavailable" && (
              <div className="mt-8 space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Issue Description
                </label>
                <textarea
                  rows={4}
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  disabled={isProcessing}
                  className="w-full border border-zinc-300 rounded-md px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none bg-white disabled:opacity-50"
                  placeholder="e.g. Broken screen, won't boot..."
                />
              </div>
            )}

            <button
              onClick={handleSaveChanges}
              disabled={isProcessing}
              className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 size={16} className="animate-spin mx-auto" />
              ) : (
                "Save Changes"
              )}
            </button>
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-md border border-zinc-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Current Status
                </span>
                <div
                  className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                    selectedPC.status === "available"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {selectedPC.status === "available"
                    ? "Available"
                    : "Issue Reported"}
                </div>
              </div>
              {selectedPC.status !== "available" ? (
                <div className="border-t border-zinc-100 pt-4 mt-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                    Issue Description
                  </span>
                  <div className="bg-slate-50 p-4 rounded-md border border-zinc-200">
                    <p className="text-sm font-medium text-slate-700 italic">
                      <p>{report?.description || "No description provided."}</p>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-center py-6">
                  <CheckCircle
                    size={32}
                    className="mx-auto text-emerald-500 mb-2"
                  />
                  <p className="text-xs text-slate-500">
                    This unit is operational.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-200 mt-auto space-y-4">
        {isEditSidebar && (
          <button
            onClick={handleDelete}
            disabled={isDeletingPC === selectedPC.equipment_id || isProcessing}
            className="w-full flex items-center justify-center gap-2 p-4 bg-rose-50 text-rose-600 rounded-md border border-rose-100 hover:bg-rose-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest group disabled:opacity-50"
          >
            {isDeletingPC === selectedPC.equipment_id || isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} className="group-hover:animate-bounce" />
            )}
            Remove PC from Lab
          </button>
        )}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="w-full py-4 bg-slate-800 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-slate-900 transition-all shadow-md disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
