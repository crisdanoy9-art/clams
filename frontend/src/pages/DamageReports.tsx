import React, { useState, useMemo } from "react";
import {
  Clock,
  Wrench,
  CheckCircle2,
  Plus,
  Calendar,
  ChevronDown,
  Computer,
  AlertCircle,
} from "lucide-react";
import { AddModal } from "../components/reusableModal";
import { useQueryClient } from "@tanstack/react-query";
import { useTableData } from "../lib/hooks/useTableData";

type DateFilter = "weekly" | "monthly" | "yearly";

const DamageReports: React.FC = () => {
  const [showModal, setModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("monthly");
  const queryClient = useQueryClient();

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");

  const { data: reportsData } = useTableData("damage_reports", {
    refetchInterval: 3000,
  });
  const { data: equipmentData } = useTableData("equipment");
  const { data: usersData } = useTableData("users");
  const { data: labData } = useTableData("laboratories");

  const allReports: any[] = reportsData ?? [];

  const roleFilteredReports = useMemo(() => {
    if (role === "instructor") {
      return allReports.filter((r) => r.instructor_id === userId);
    }
    return allReports;
  }, [allReports, role, userId]);

  const filteredReports = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    return roleFilteredReports.filter((report) => {
      const reportDate = new Date(report.created_at);
      switch (dateFilter) {
        case "weekly":
          return reportDate >= oneWeekAgo;
        case "monthly":
          return (
            reportDate.getMonth() === currentMonth &&
            reportDate.getFullYear() === currentYear
          );
        case "yearly":
          return reportDate.getFullYear() === currentYear;
        default:
          return true;
      }
    });
  }, [roleFilteredReports, dateFilter]);

  const sortedReports = useMemo(() => {
    return [...filteredReports].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [filteredReports]);

  const stats = useMemo(() => {
    const uniqueItems = new Set(filteredReports.map((r) => r.equipment_id));
    const damagedItems = new Set(
      filteredReports
        .filter((r) => (r.status ?? "pending") !== "resolved")
        .map((r) => r.equipment_id),
    );
    return { totalPCs: uniqueItems.size, damagedPCs: damagedItems.size };
  }, [filteredReports]);

  const getFilterLabel = () => {
    switch (dateFilter) {
      case "weekly":
        return "Last 7 Days";
      case "monthly":
        return "This Month";
      case "yearly":
        return "This Year";
      default:
        return "";
    }
  };

  const getCountForPeriod = (filter: DateFilter) => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);
    return roleFilteredReports.filter((r) => {
      const d = new Date(r.created_at);
      if (filter === "weekly") return d >= oneWeekAgo;
      if (filter === "monthly")
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      if (filter === "yearly") return d.getFullYear() === now.getFullYear();
      return false;
    }).length;
  };

  const getEquipmentName = (id: number) =>
    equipmentData?.find((e: any) => e.equipment_id === id)?.item_name ??
    `#${id}`;

  const getInstructorName = (id: string) => {
    if (!id) return "Unknown";
    const user = usersData?.find((u: any) => u.user_id === id);
    return user ? `${user.first_name} ${user.last_name}` : id;
  };

  const getLabName = (id: number) =>
    labData?.find((l: any) => l.lab_id === id)?.lab_name ?? `Lab #${id}`;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "in_progress":
        return {
          bg: "bg-amber-50 text-amber-500 border-amber-100",
          icon: <Wrench size={24} />,
          iconBg: "bg-amber-50 text-amber-500",
        };
      case "resolved":
        return {
          bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
          icon: <CheckCircle2 size={24} />,
          iconBg: "bg-emerald-50 text-emerald-500",
        };
      default: // pending or null
        return {
          bg: "bg-rose-50 text-rose-500 border-rose-100",
          icon: <Clock size={24} />,
          iconBg: "bg-rose-50 text-rose-500",
        };
    }
  };

  const equipmentOptions =
    equipmentData?.map((e: any) => ({
      value: String(e.equipment_id),
      label: e.item_name,
    })) ?? [];

  const labOptions =
    labData?.map((l: any) => ({
      value: String(l.lab_id),
      label: l.lab_name,
    })) ?? [];

  const ReportFields = [
    {
      name: "lab_id",
      label: "Laboratory",
      type: "select" as const,
      placeholder: "Select laboratory",
      options: labOptions,
    },
    {
      name: "equipment_id",
      label: "Equipment",
      type: "select" as const,
      placeholder: "Select damaged equipment",
      options: equipmentOptions,
    },
    {
      name: "subject",
      label: "Subject",
      type: "text" as const,
      placeholder: "e.g., Broken Monitor Screen",
    },
    {
      name: "description",
      label: "Description",
      type: "text" as const,
      placeholder: "Describe how it happened...",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            Damage Reports
          </h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mt-2 italic">
            Monitor PC health & report equipment issues
          </p>
        </div>
        {role === "instructor" && (
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Plus size={16} /> New Report
          </button>
        )}
      </header>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="appearance-none bg-white border border-slate-200 rounded-md pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="weekly">
                Weekly ({getCountForPeriod("weekly")})
              </option>
              <option value="monthly">
                Monthly ({getCountForPeriod("monthly")})
              </option>
              <option value="yearly">
                Yearly ({getCountForPeriod("yearly")})
              </option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-wider">
            <Calendar size={12} />
            <span>Showing: {getFilterLabel()}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-md border border-slate-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Computer size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total PCs (Unique)
            </p>
            <p className="text-3xl font-black text-slate-800 tracking-tighter">
              {stats.totalPCs}
            </p>
            <p className="text-[9px] text-slate-400 mt-1">
              in {getFilterLabel().toLowerCase()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-md border border-slate-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Damaged PCs (Unresolved)
            </p>
            <p className="text-3xl font-black text-slate-800 tracking-tighter">
              {stats.damagedPCs}
            </p>
            <p className="text-[9px] text-slate-400 mt-1">
              Pending / In Progress
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
            All Laboratory Incident Logs • {getFilterLabel()}
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {sortedReports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                <Calendar size={28} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                No reports found for {getFilterLabel().toLowerCase()}
              </p>
              {role === "instructor" && (
                <button
                  onClick={() => setModal(true)}
                  className="mt-4 text-indigo-600 text-[9px] font-black uppercase tracking-widest hover:underline"
                >
                  + Create a new report
                </button>
              )}
            </div>
          ) : (
            sortedReports.map((report) => {
              const status = report.status ?? "pending";
              const { bg, icon, iconBg } = getStatusStyle(status);
              return (
                <div
                  key={report.report_id}
                  className="p-8 hover:bg-slate-50/50 transition-colors group flex items-center justify-between"
                >
                  <div className="flex items-center gap-8">
                    <div
                      className={`w-14 h-14 rounded-md flex items-center justify-center transition-transform group-hover:scale-110 ${iconBg}`}
                    >
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                          RPT-{report.report_id}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-md"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {new Date(report.created_at).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-800 tracking-tight">
                        {report.subject ??
                          getEquipmentName(report.equipment_id)}
                      </h4>
                      <p className="text-xs text-slate-500 italic mt-1 font-medium max-w-xl">
                        "{report.description}"
                      </p>
                      {role === "admin" && (
                        <p className="text-[10px] text-slate-400 mt-1 font-bold">
                          Reported by:{" "}
                          <span className="text-indigo-500">
                            {getInstructorName(report.instructor_id)}
                          </span>{" "}
                          · {getLabName(report.lab_id)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-4">
                    <span
                      className={`text-[9px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${bg}`}
                    >
                      {status.replace("_", " ")}
                    </span>
                    {report.admin_remarks && (
                      <p className="text-[9px] text-slate-400 max-w-[200px] text-right italic">
                        "{report.admin_remarks}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showModal && role === "instructor" && (
        <AddModal
          fields={ReportFields}
          table="damage_reports"
          onClose={() => setModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["damage_reports"] });
            setModal(false);
          }}
        />
      )}
    </div>
  );
};

export default DamageReports;
