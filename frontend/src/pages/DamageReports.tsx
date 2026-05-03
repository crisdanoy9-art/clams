import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  Clock,
  Wrench,
  CheckCircle2,
  Plus,
  X,
  Monitor,
  MessageSquare,
  Calendar,
  ChevronDown,
  Computer,
  AlertCircle,
} from "lucide-react";
import { AddModal } from "../components/reusableModal";
import { ReportFields } from "../lib/validations/reports";
import { useQueryClient } from "@tanstack/react-query";

interface DamageReport {
  id: string;
  item: string;
  reportedBy: string;
  description: string;
  date: string; // YYYY-MM-DD
  status: "Pending" | "Under Repair" | "Resolved";
}

type DateFilter = "weekly" | "monthly" | "yearly";

const DamageReports: React.FC = () => {
  const [showModal, setModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("monthly");
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [formData, setFormData] = useState({ item: "", description: "" });
  const queryClient = useQueryClient();

  // Get filtered reports based on date filter
  const getFilteredReports = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    return reports.filter((report) => {
      const reportDate = new Date(report.date);
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
  }, [reports, dateFilter]);

  // Sort filtered reports by date (newest first)
  const sortedFilteredReports = useMemo(() => {
    return [...getFilteredReports].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [getFilteredReports]);

  // Stats based on filtered reports
  const stats = useMemo(() => {
    // Unique items (PCs/peripherals) in filtered reports
    const uniqueItems = new Set(getFilteredReports.map((r) => r.item));
    const totalPCs = uniqueItems.size;

    // Unique items with unresolved status (Pending or Under Repair)
    const damagedItems = new Set(
      getFilteredReports
        .filter((r) => r.status !== "Resolved")
        .map((r) => r.item),
    );
    const damagedPCs = damagedItems.size;

    return { totalPCs, damagedPCs };
  }, [getFilteredReports]);

  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: DamageReport = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      item: formData.item,
      reportedBy: "Staff Instructor",
      description: formData.description,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };
    setReports([newReport, ...reports]);
    setModal(false);
    setFormData({ item: "", description: "" });
  };

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
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    return reports.filter((report) => {
      const reportDate = new Date(report.date);
      if (filter === "weekly") return reportDate >= oneWeekAgo;
      if (filter === "monthly")
        return (
          reportDate.getMonth() === currentMonth &&
          reportDate.getFullYear() === currentYear
        );
      if (filter === "yearly") return reportDate.getFullYear() === currentYear;
      return false;
    }).length;
  };

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
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus size={16} /> New Report
        </button>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="appearance-none bg-white border border-slate-200 rounded-md pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
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

      {/* Stats Cards: Total PCs & Damaged PCs */}
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
              Pending / Under Repair
            </p>
          </div>
        </div>
      </div>

      {/* Main Table / List */}
      <div className="bg-white rounded-md border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
            All Laboratory Incident Logs • {getFilterLabel()}
          </h3>
        </div>

        <div className="divide-y divide-slate-50">
          {sortedFilteredReports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                <Calendar size={28} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                No reports found for {getFilterLabel().toLowerCase()}
              </p>
              <button
                onClick={() => setModal(true)}
                className="mt-4 text-indigo-600 text-[9px] font-black uppercase tracking-widest hover:underline"
              >
                + Create a new report
              </button>
            </div>
          ) : (
            sortedFilteredReports.map((report) => (
              <div
                key={report.id}
                className="p-8 hover:bg-slate-50/50 transition-colors group flex items-center justify-between"
              >
                <div className="flex items-center gap-8">
                  <div
                    className={`w-14 h-14 rounded-md flex items-center justify-center transition-transform group-hover:scale-110 ${
                      report.status === "Pending"
                        ? "bg-rose-50 text-rose-500"
                        : report.status === "Under Repair"
                          ? "bg-amber-50 text-amber-500"
                          : "bg-emerald-50 text-emerald-500"
                    }`}
                  >
                    {report.status === "Pending" ? (
                      <Clock size={24} />
                    ) : report.status === "Under Repair" ? (
                      <Wrench size={24} />
                    ) : (
                      <CheckCircle2 size={24} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        {report.id}
                      </span>
                      <span className="w-1 h-1 bg-slate-200 rounded-md"></span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {formatDisplayDate(report.date)}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 tracking-tight">
                      {report.item}
                    </h4>
                    <p className="text-xs text-slate-500 italic mt-1 font-medium max-w-xl">
                      "{report.description}"
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-4">
                  <span
                    className={`text-[9px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${
                      report.status === "Pending"
                        ? "border-rose-100 bg-rose-50 text-rose-500"
                        : report.status === "Under Repair"
                          ? "border-amber-100 bg-amber-50 text-amber-500"
                          : "border-emerald-100 bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Modal */}
      {/* {showModal && ( */}
      {/*   <div className="fixed inset-0 z-[100] flex items-center justify-center p-6"> */}
      {/*     <div */}
      {/*       className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" */}
      {/*       onClick={() => setModal(false)} */}
      {/*     ></div> */}
      {/*     <div className="relative bg-white w-full max-w-lg rounded-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"> */}
      {/*       <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50"> */}
      {/*         <div className="flex items-center gap-4"> */}
      {/*           <div className="w-12 h-12 bg-rose-500 rounded-md flex items-center justify-center text-white shadow-xl shadow-rose-200"> */}
      {/*             <AlertTriangle size={20} /> */}
      {/*           </div> */}
      {/*           <div> */}
      {/*             <h3 className="text-xl font-black text-slate-900 tracking-tight"> */}
      {/*               Report Incident */}
      {/*             </h3> */}
      {/*             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest"> */}
      {/*               Damage Details */}
      {/*             </p> */}
      {/*           </div> */}
      {/*         </div> */}
      {/*         <button */}
      {/*           onClick={() => setModal(false)} */}
      {/*           className="p-2 hover:bg-white rounded-md transition-colors text-slate-300 hover:text-slate-900" */}
      {/*         > */}
      {/*           <X size={20} /> */}
      {/*         </button> */}
      {/*       </div> */}
      {/*       <form onSubmit={handleSubmit} className="p-10 space-y-8"> */}
      {/*         <div className="space-y-3"> */}
      {/*           <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"> */}
      {/*             <Monitor size={12} /> Target PC / Peripheral */}
      {/*           </label> */}
      {/*           <input */}
      {/*             required */}
      {/*             value={formData.item} */}
      {/*             onChange={(e) => */}
      {/*               setFormData({ ...formData, item: e.target.value }) */}
      {/*             } */}
      {/*             className="w-full p-5 bg-slate-50 border-none rounded-md text-xs font-bold text-slate-800 focus:ring-2 ring-indigo-500 outline-none" */}
      {/*             placeholder="e.g. PC-12 or Mouse Lab 1" */}
      {/*           /> */}
      {/*         </div> */}
      {/*         <div className="space-y-3"> */}
      {/*           <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"> */}
      {/*             <MessageSquare size={12} /> Describe the Issue */}
      {/*           </label> */}
      {/*           <textarea */}
      {/*             required */}
      {/*             rows={4} */}
      {/*             value={formData.description} */}
      {/*             onChange={(e) => */}
      {/*               setFormData({ ...formData, description: e.target.value }) */}
      {/*             } */}
      {/*             className="w-full p-5 bg-slate-50 border-none rounded-md text-xs font-bold text-slate-800 focus:ring-2 ring-indigo-500 outline-none resize-none" */}
      {/*             placeholder="What is wrong with the equipment?" */}
      {/*           /> */}
      {/*         </div> */}
      {/*         <button */}
      {/*           type="submit" */}
      {/*           className="w-full py-5 bg-slate-900 text-white rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10" */}
      {/*         > */}
      {/*           Send to Raylle Admin */}
      {/*         </button> */}
      {/*       </form> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* )} */}

      {showModal && (
        <AddModal
          fields={ReportFields}
          table="users"
          onClose={() => setModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
          }}
        />
      )}
    </div>
  );
};

export default DamageReports;
