import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  AlertCircle,
  Trash2,
  Loader2,
  Eye,
  Monitor,
  Cpu,
  Hash,
  Tag,
  Box,
  ChevronDown,
  ChevronUp,
  Save,
  XCircle,
} from "lucide-react";
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

type SpecItem = {
  id: string;
  label: string;
  value: string;
  status: "ok" | "broken";
};

// Maps spec keys to readable labels
const SPEC_LABELS: Record<string, string> = {
  cpu: "Processor (CPU)",
  ram: "Memory (RAM)",
  storage: "Primary Boot Drive",
  monitor: "Primary Monitor",
  keyboard: "Keyboard",
  mouse: "Mouse",
};

// Pick an icon per spec key
const getSpecIcon = (key: string) => {
  switch (key) {
    case "cpu":
      return Cpu;
    case "ram":
      return Box;
    case "storage":
      return Hash;
    case "monitor":
      return Monitor;
    default:
      return Tag;
  }
};

/**
 * Parse the JSONB specs column which can be in two formats:
 *   Legacy:  { "cpu": "Intel Core i7", "ram": "16GB DDR4" }
 *   New:     { "cpu": { "value": "Intel Core i7", "status": "ok" }, ... }
 *
 * Always normalises to SpecItem[].
 */
const parseSpecs = (raw: any): SpecItem[] => {
  if (!raw) return [];

  let parsed: Record<string, any> = {};
  try {
    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return [];
  }

  return Object.entries(parsed).map(([key, val]) => {
    // New nested format
    if (val && typeof val === "object" && "value" in val) {
      return {
        id: key,
        label: SPEC_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1),
        value: String(val.value),
        status: val.status === "broken" ? "broken" : "ok",
      };
    }
    // Legacy flat format
    return {
      id: key,
      label: SPEC_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1),
      value: String(val),
      status: "ok",
    };
  });
};

/**
 * Convert SpecItem[] back to the nested JSONB structure ready to persist.
 */
const buildSpecsPayload = (
  items: SpecItem[],
): Record<string, { value: string; status: "ok" | "broken" }> => {
  return Object.fromEntries(
    items.map((item) => [item.id, { value: item.value, status: item.status }]),
  );
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
    "available" | "unavailable" | "broken"
  >("available");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [expandedSpecId, setExpandedSpecId] = useState<string | null>(null);
  const [savingSpecId, setSavingSpecId] = useState<string | null>(null);
  const timeoutRef = useRef<any>(null);
  const { data: reports } = useTableData("damage_reports");
  const [specItems, setSpecItems] = useState<SpecItem[]>([]);

  useEffect(() => {
    if (selectedPC) {
      setTempNote(selectedPC.referenceNote || "");

      // Support all three status values
      const status = selectedPC.status;
      if (
        status === "available" ||
        status === "unavailable" ||
        status === "broken"
      ) {
        setSelectedStatus(status);
      } else {
        setSelectedStatus("available");
      }

      setShowSpecs(false);
      setExpandedSpecId(null);
      setSpecItems(parseSpecs(selectedPC.specs));
    }
  }, [selectedPC?.equipment_id]);

  if (!selectedPC) return null;

  const getInstructorId = () => {
    return (
      localStorage.getItem("user_id") || "f51f9f9e-775f-43e6-965c-0a1e7f8837da"
    );
  };

  const handleStatusClick = (
    status: "available" | "unavailable" | "broken",
  ) => {
    setSelectedStatus(status);
    onStatusChange?.(selectedPC.equipment_id, status);
  };

  const handleSaveChanges = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await updateData("equipment", selectedPC.equipment_id, {
        status: selectedStatus,
      });
      if (
        (selectedStatus === "unavailable" || selectedStatus === "broken") &&
        tempNote?.trim()
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
      onSaveNote?.(selectedPC.equipment_id, tempNote);
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      timeoutRef.current = setTimeout(() => setIsProcessing(false), 500);
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

  /**
   * Save a single spec's status to the DB.
   * Merges the updated spec item into the full specs payload and persists.
   * If any spec is broken → also sets equipment status to "broken".
   */
  const handleSaveSpec = async (specId: string) => {
    setSavingSpecId(specId);
    try {
      const updatedSpecs = buildSpecsPayload(specItems);
      const anyBroken = specItems.some((s) => s.status === "broken");
      const newEquipmentStatus = anyBroken ? "broken" : "available";

      await updateData("equipment", selectedPC.equipment_id, {
        specs: updatedSpecs,
        status: newEquipmentStatus,
      });

      // Reflect status change back to parent list if needed
      onStatusChange?.(selectedPC.equipment_id, newEquipmentStatus);
    } catch (error) {
      console.error("Error saving spec:", error);
    } finally {
      setSavingSpecId(null);
    }
  };

  const report = reports?.find(
    (k: any) => k.equipment_id === selectedPC.equipment_id,
  );

  const toggleExpand = (id: string) => {
    setExpandedSpecId(expandedSpecId === id ? null : id);
  };

  const updateSpecStatus = (id: string, newStatus: "ok" | "broken") => {
    setSpecItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  // ── Status display helpers ──────────────────────────────────────────────────
  const statusConfig = {
    available: {
      label: "Available",
      badgeClass: "bg-emerald-50 text-emerald-600",
      icon: <CheckCircle size={32} className="mx-auto text-emerald-500 mb-2" />,
      message: "This unit is operational.",
    },
    unavailable: {
      label: "Issue Reported",
      badgeClass: "bg-rose-50 text-rose-600",
      icon: <AlertCircle size={32} className="mx-auto text-rose-400 mb-2" />,
      message: null,
    },
    broken: {
      label: "Broken",
      badgeClass: "bg-red-100 text-red-700",
      icon: <XCircle size={32} className="mx-auto text-red-600 mb-2" />,
      message: null,
    },
  };

  const currentStatusCfg =
    statusConfig[selectedPC.status as keyof typeof statusConfig] ??
    statusConfig.available;

  return (
    <div className="w-96 border-l border-zinc-200 bg-slate-50/50 p-10 flex flex-col overflow-y-auto h-full">
      <div className="flex-1">
        <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">
          {isEditSidebar
            ? `Modify ${selectedPC.asset_tag || "Unit"}`
            : `${selectedPC.asset_tag || "Unit"} Details`}
        </h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
          {isEditSidebar
            ? "Select operational status"
            : "Current status & issue report"}
        </p>

        {isEditSidebar ? (
          // ── EDIT MODE ────────────────────────────────────────────────────────
          <>
            <div className="space-y-4">
              {/* Available */}
              <button
                type="button"
                onClick={() => handleStatusClick("available")}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-6 rounded-md border-2 transition-all ${
                  selectedStatus === "available"
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-white border-zinc-200 text-slate-400 hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <CheckCircle size={20} />
                  <span className="font-black uppercase text-[11px]">
                    Available
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full border ${selectedStatus === "available" ? "bg-white" : ""}`}
                />
              </button>

              {/* Unavailable / Issue */}
              <button
                type="button"
                onClick={() => handleStatusClick("unavailable")}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-6 rounded-md border-2 transition-all ${
                  selectedStatus === "unavailable"
                    ? "bg-rose-500 border-rose-500 text-white"
                    : "bg-white border-zinc-200 text-slate-400 hover:border-rose-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <AlertCircle size={20} />
                  <span className="font-black uppercase text-[11px]">
                    Issue Reported
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full border ${selectedStatus === "unavailable" ? "bg-white" : ""}`}
                />
              </button>

              {/* Broken */}
              <button
                type="button"
                onClick={() => handleStatusClick("broken")}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-6 rounded-md border-2 transition-all ${
                  selectedStatus === "broken"
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white border-zinc-200 text-slate-400 hover:border-red-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <XCircle size={20} />
                  <span className="font-black uppercase text-[11px]">
                    Broken
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full border ${selectedStatus === "broken" ? "bg-white" : ""}`}
                />
              </button>
            </div>

            {(selectedStatus === "unavailable" ||
              selectedStatus === "broken") && (
              <div className="mt-8 space-y-3">
                <label className="block text-[10px] font-black text-slate-500">
                  Issue Description
                </label>
                <textarea
                  rows={4}
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  className="w-full border border-zinc-300 rounded-md p-3 text-sm focus:ring-rose-500"
                  placeholder="e.g. Broken screen, won't boot..."
                />
              </div>
            )}

            <button
              onClick={handleSaveChanges}
              disabled={isProcessing}
              className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700"
            >
              {isProcessing ? (
                <Loader2 size={16} className="animate-spin mx-auto" />
              ) : (
                "Save Changes"
              )}
            </button>
          </>
        ) : (
          // ── DETAILS VIEW ─────────────────────────────────────────────────────
          <div className="space-y-4">
            {/* Status card */}
            <div className="bg-white rounded-md border border-zinc-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Current Status
                </span>
                <div
                  className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${currentStatusCfg.badgeClass}`}
                >
                  {currentStatusCfg.label}
                </div>
              </div>

              {selectedPC.status !== "available" ? (
                <div className="border-t border-zinc-100 pt-4 mt-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                    Issue Description
                  </span>
                  <div className="bg-slate-50 p-4 rounded-md border border-zinc-200">
                    <p className="text-sm font-medium text-slate-700 italic">
                      {report?.description || "No description provided."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-center py-4">
                  {currentStatusCfg.icon}
                  <p className="text-xs text-slate-500">
                    {currentStatusCfg.message}
                  </p>
                </div>
              )}
            </div>

            {/* Unit info */}
            <div className="bg-white rounded-md border border-zinc-200 p-5 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Unit Info
              </p>

              {[
                { label: "Brand", value: selectedPC.brand, icon: Monitor },
                { label: "Model", value: selectedPC.model, icon: Cpu },
                {
                  label: "Serial No.",
                  value: selectedPC.serial_number,
                  icon: Hash,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {value || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Specs from JSONB */}
            <div className="bg-white rounded-md border border-zinc-200 p-5">
              <button
                onClick={() => setShowSpecs(!showSpecs)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 rounded-md transition-all text-[10px] font-black uppercase tracking-wider text-slate-700"
              >
                <Eye size={14} />
                {showSpecs ? "Hide Specifications" : "View Specifications"}
              </button>

              {showSpecs && (
                <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4">
                  {specItems.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">
                      No specs recorded.
                    </p>
                  ) : (
                    specItems.map((item) => {
                      const Icon = getSpecIcon(item.id);
                      const isExpanded = expandedSpecId === item.id;
                      const isSaving = savingSpecId === item.id;

                      return (
                        <div
                          key={item.id}
                          className="border border-zinc-200 rounded-md overflow-hidden"
                        >
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Icon
                                size={14}
                                className="text-indigo-500 flex-shrink-0"
                              />
                              <div className="text-left">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                  {item.label}
                                </p>
                                <p className="font-bold text-slate-700 text-sm">
                                  {item.value}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                  item.status === "ok"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-rose-100 text-rose-700"
                                }`}
                              >
                                {item.status === "ok" ? "OK" : "Broken"}
                              </span>
                              {isExpanded ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="border-t border-zinc-100 p-3 bg-slate-50/30 space-y-2">
                              <p className="text-[8px] font-black text-slate-500">
                                Change status
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    updateSpecStatus(item.id, "ok")
                                  }
                                  className={`flex-1 py-1.5 rounded-md text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1 ${
                                    item.status === "ok"
                                      ? "bg-emerald-500 text-white"
                                      : "bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50"
                                  }`}
                                >
                                  <CheckCircle size={10} /> OK
                                </button>
                                <button
                                  onClick={() =>
                                    updateSpecStatus(item.id, "broken")
                                  }
                                  className={`flex-1 py-1.5 rounded-md text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1 ${
                                    item.status === "broken"
                                      ? "bg-rose-500 text-white"
                                      : "bg-white border border-slate-200 text-slate-600 hover:bg-rose-50"
                                  }`}
                                >
                                  <AlertCircle size={10} /> Broken
                                </button>
                              </div>
                              <button
                                onClick={() => handleSaveSpec(item.id)}
                                disabled={isSaving}
                                className="mt-1 w-full py-1 bg-indigo-600 text-white rounded-md text-[8px] font-black uppercase tracking-wider hover:bg-indigo-700 flex items-center justify-center gap-1 disabled:opacity-60"
                              >
                                {isSaving ? (
                                  <Loader2 size={10} className="animate-spin" />
                                ) : (
                                  <>
                                    <Save size={10} /> Save
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
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
            className="w-full flex items-center justify-center gap-2 p-4 bg-rose-50 text-rose-600 rounded-md border border-rose-100 hover:bg-rose-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
          >
            {isDeletingPC === selectedPC.equipment_id || isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            Remove PC from Lab
          </button>
        )}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="w-full py-4 bg-slate-800 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-slate-900 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
