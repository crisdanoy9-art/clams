import React, { useState } from "react";
import {
  Monitor,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Wrench,
} from "lucide-react";
import { useTableData } from "../lib/hooks/useTableData";

interface DashboardProps {
  userRole: "admin" | "instructor";
}

const DashboardProp: React.FC<DashboardProps> = () => {
  const { data: labData } = useTableData("laboratories");
  const { data: equipmentData } = useTableData("equipment");

  // State to track the specific ID of the expanded lab
  const [expandedLabId, setExpandedLabId] = useState<number | string | null>(
    null,
  );

  const activeEquipment =
    equipmentData?.filter((e: any) => !e.is_deleted) ?? [];

  const totalPcs = activeEquipment.length;
  const availableUnits = activeEquipment.filter(
    (e: any) => e.status === "available",
  ).length;
  const issueUnits = activeEquipment.filter(
    (e: any) => e.status === "unavailable",
  ).length;

  const availablePercent =
    totalPcs === 0 ? 0 : (availableUnits / totalPcs) * 100;
  const issuePercent = totalPcs === 0 ? 0 : (issueUnits / totalPcs) * 100;

  const getLabEquipment = (labId: number | string) =>
    activeEquipment.filter((e: any) => e.lab_id === labId);

  const toggleExpand = (labId: number | string) => {
    // If clicking the one already open, close it. Otherwise, open the new one.
    setExpandedLabId((prevId) => (prevId === labId ? null : labId));
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-700">
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">
            CLAMS / Computer Laboratory Asset Management System
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="TOTAL PCs"
            value={totalPcs.toString()}
            subtitle="Across all labs"
            icon={<Monitor className="text-indigo-500" strokeWidth={1.8} />}
            progressColor="bg-indigo-500"
            progressWidth={100}
            bgColor="bg-white"
            iconBg="bg-indigo-50"
          />
          <StatCard
            title="AVAILABLE UNITS"
            value={availableUnits.toString()}
            subtitle="Ready for use"
            icon={
              <CheckCircle className="text-emerald-500" strokeWidth={1.8} />
            }
            progressColor="bg-emerald-500"
            progressWidth={availablePercent}
            bgColor="bg-white"
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="UNITS WITH ISSUES"
            value={issueUnits.toString()}
            subtitle="Unavailable / damaged"
            icon={<Wrench className="text-rose-500" strokeWidth={1.8} />}
            progressColor="bg-rose-400"
            progressWidth={issuePercent}
            bgColor="bg-white"
            iconBg="bg-rose-50"
            isWarning
          />
        </div>

        {/* Laboratory Overview */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Laboratory Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {labData && labData.length > 0 ? (
              labData.map((lab: any) => {
                const thisLabEquipment = getLabEquipment(lab.lab_id);
                const totalCount = thisLabEquipment.length;
                const availCount = thisLabEquipment.filter(
                  (e: any) => e.status === "available",
                ).length;
                const issueCount = thisLabEquipment.filter(
                  (e: any) => e.status === "unavailable",
                ).length;

                // Strict check to ensure only the specific ID triggers expansion
                const isExpanded = expandedLabId === lab.lab_id;

                return (
                  <div
                    key={lab.lab_id}
                    className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit"
                  >
                    {/* Header - Click to expand/collapse */}
                    <div
                      className="p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between"
                      onClick={() => toggleExpand(lab.lab_id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {lab.lab_name?.charAt(0).toUpperCase() || "L"}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-700">
                            {lab.lab_name}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            {lab.room_number || "No room"} ·{" "}
                            {lab.building || "No building"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-indigo-100 px-2 py-1 rounded-full text-indigo-700">
                          {totalCount} total
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={18} className="text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Stats Summary - Always visible */}
                    <div className="px-4 pb-3 grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-emerald-50 rounded-md p-2">
                        <p className="text-emerald-600 font-bold">
                          {availCount}
                        </p>
                        <p className="text-[10px] text-slate-500">Available</p>
                      </div>
                      <div className="bg-rose-50 rounded-md p-2">
                        <p className="text-rose-600 font-bold">{issueCount}</p>
                        <p className="text-[10px] text-slate-500">Issues</p>
                      </div>
                    </div>

                    {/* Expanded Content - Assets list only shows when THIS lab is expanded */}
                    {isExpanded && (
                      <div className="border-t border-zinc-200 bg-slate-50/50 p-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 px-1">
                          Assets in this lab
                        </p>
                        {thisLabEquipment.length === 0 ? (
                          <p className="text-[10px] text-slate-400 text-center py-4">
                            No equipment registered
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {thisLabEquipment.map((e: any) => (
                              <div
                                key={e.equipment_id}
                                className="bg-white rounded-md p-2 flex items-center justify-between shadow-sm border border-zinc-200"
                              >
                                <div>
                                  <p className="text-xs font-semibold text-slate-700">
                                    {e.item_name} · {e.brand} {e.model}
                                  </p>
                                  <p className="text-[10px] text-slate-500">
                                    {e.asset_tag}
                                  </p>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                    e.status === "available"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-rose-100 text-rose-700"
                                  }`}
                                >
                                  {e.status === "available"
                                    ? "Available"
                                    : "Issue"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-md border border-slate-200">
                <Monitor size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">
                  No laboratories added yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Recent Activity
          </h3>
          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-8 text-center">
            <Clock size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">
              No recent activity to show.
            </p>
          </div>
        </div>

        <footer className="border-t border-slate-200 pt-6 mt-4 text-center text-xs text-slate-400">
          <p>
            © 2026 CLAMS - Computer Laboratory Asset Management System. All
            rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  progressColor: string;
  progressWidth: number;
  bgColor: string;
  iconBg: string;
  isWarning?: boolean;
}> = ({
  title,
  value,
  subtitle,
  icon,
  progressColor,
  progressWidth,
  bgColor,
  iconBg,
  isWarning,
}) => (
  <div
    className={`p-5 rounded-md border border-slate-200 ${bgColor} ${
      isWarning ? "shadow-sm" : ""
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[11px] font-bold text-slate-500 tracking-wider">
          {title}
        </p>
        <h4 className="text-3xl font-bold text-slate-800 mt-1">{value}</h4>
      </div>
      <div className={`p-2 rounded-md ${iconBg}`}>{icon}</div>
    </div>
    <p className="text-xs text-slate-400 mb-3">{subtitle}</p>
    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
      <div
        className={`${progressColor} h-full rounded-full`}
        style={{ width: `${progressWidth}%` }}
      />
    </div>
  </div>
);

export default DashboardProp;

