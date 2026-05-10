import React, { useState, useEffect } from "react";
import { AlertTriangle, Search, Plus, CheckCircle, Clock, XCircle, User, Eye, Send, RefreshCw } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useRefresh } from "../contexts/RefreshContext";

const STATUS_STYLES = {
  open: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS = { open: "Open", in_progress: "In Progress", resolved: "Resolved", rejected: "Rejected" };

export default function DamageReports({ userRole, currentUser, onRefresh }) {
  const { triggerRefresh } = useRefresh();
  const [reports, setReports] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [adminRemark, setAdminRemark] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [newReport, setNewReport] = useState({ equipment_id: "", subject: "", description: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsRes, equipmentRes] = await Promise.all([
        axiosInstance.get("/reports"),
        axiosInstance.get("/inventory"),
      ]);
      setReports(reportsRes.data || []);
      setEquipment(equipmentRes.data || []);
      triggerRefresh();
      onRefresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCurrentUserId = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        return JSON.parse(userData).user_id;
      } catch (e) {}
    }
    return currentUser?.user_id;
  };

  let filteredReports = reports;
  if (userRole === "instructor") {
    const userId = getCurrentUserId();
    filteredReports = reports.filter((r) => r.instructor_id === userId);
  }

  const filtered = filteredReports.filter((r) => {
    const searchTerm = search.toLowerCase();
    return (
      r.subject?.toLowerCase().includes(searchTerm) ||
      r.report_id?.toString().includes(searchTerm) ||
      r.equipment_name?.toLowerCase().includes(searchTerm) ||
      r.pc_name?.toLowerCase().includes(searchTerm) ||
      r.reporter_name?.toLowerCase().includes(searchTerm)
    );
  });

  const stats =
    userRole === "admin"
      ? {
          openReports: reports.filter((r) => r.report_status === "open").length,
          inProgressReports: reports.filter((r) => r.report_status === "in_progress").length,
          resolvedReports: reports.filter((r) => r.report_status === "resolved").length,
          total: reports.length,
        }
      : {
          myReports: reports.filter((r) => r.instructor_id === getCurrentUserId()).length,
          myOpenReports: reports.filter((r) => r.instructor_id === getCurrentUserId() && (r.report_status === "open" || r.report_status === "in_progress")).length,
          myResolvedReports: reports.filter((r) => r.instructor_id === getCurrentUserId() && r.report_status === "resolved").length,
        };

  const handleUpdateReport = async () => {
    if (selectedReport) {
      try {
        await axiosInstance.put(`/update/damage_reports/${selectedReport.report_id}`, {
          data: {
            status: newStatus,
            admin_remarks: adminRemark,
            resolved_at: newStatus === "resolved" ? new Date().toISOString() : null,
          },
        });
        toast.success("Report updated successfully");
        setIsViewModalOpen(false);
        fetchData();
      } catch (error) {
        toast.error("Failed to update report");
      }
    }
  };

  const handleSubmitReport = async () => {
    if (!newReport.subject || !newReport.description || !newReport.equipment_id) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await axiosInstance.post("/create/damage_reports", {
        data: {
          equipment_id: parseInt(newReport.equipment_id),
          subject: newReport.subject,
          description: newReport.description,
          status: "open",
        },
      });
      toast.success("Damage report submitted successfully");
      setIsFormOpen(false);
      setNewReport({ equipment_id: "", subject: "", description: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to submit report");
    }
  };

  const openViewModal = (report) => {
    setSelectedReport(report);
    setAdminRemark(report.admin_remarks || "");
    setNewStatus(report.report_status);
    setIsViewModalOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open": return <Clock size={14} />;
      case "in_progress": return <AlertTriangle size={14} />;
      case "resolved": return <CheckCircle size={14} />;
      case "rejected": return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {userRole === "admin" ? "Damage Reports" : "My Reports"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {userRole === "admin"
              ? `${stats.total} total reports • ${stats.openReports} open`
              : `${stats.myReports} total reports • ${stats.myOpenReports} pending`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white w-56 transition"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer dark:text-white transition"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition transform hover:scale-105"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-slate-500 dark:text-slate-400" />
          </button>
          {userRole === "instructor" && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 transition transform hover:scale-105"
            >
              <Plus size={16} /> New Report
            </button>
          )}
        </div>
      </div>

      {userRole === "admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center"><AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" /></div>
            <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Open</p><p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.openReports}</p></div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"><Clock size={20} className="text-blue-600 dark:text-blue-400" /></div>
            <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">In Progress</p><p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgressReports}</p></div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center"><CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" /></div>
            <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Resolved</p><p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.resolvedReports}</p></div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><AlertTriangle size={20} className="text-slate-600 dark:text-slate-400" /></div>
            <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Total</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p></div>
          </div>
        </div>
      )}

      {userRole === "instructor" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><AlertTriangle size={20} className="text-slate-600 dark:text-slate-400" /></div>
            <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">My Reports</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.myReports}</p></div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center"><Clock size={20} className="text-amber-600 dark:text-amber-400" /></div>
            <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Pending</p><p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.myOpenReports}</p></div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center"><CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" /></div>
            <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Resolved</p><p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.myResolvedReports}</p></div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Subject</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Equipment / PC</th>
                {userRole === "admin" && <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Reported By</th>}
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Created</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((report) => (
                <tr key={report.report_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">DR-{report.report_id}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center"><AlertTriangle size={15} className="text-red-500" /></div><span className="font-medium text-slate-800 dark:text-white">{report.subject}</span></div></td>
                  <td className="px-6 py-4"><p className="font-medium text-slate-800 dark:text-white">{report.equipment_name}</p><p className="text-xs text-slate-400 font-mono">{report.pc_name}</p></td>
                  {userRole === "admin" && (<td className="px-6 py-4"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><User size={12} className="text-slate-500" /></div><span className="text-sm text-slate-600 dark:text-slate-400">{report.reporter_name}</span></div></td>)}
                  <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[report.report_status]}`}>{getStatusIcon(report.report_status)}{STATUS_LABELS[report.report_status]}</span></td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">{new Date(report.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4"><button onClick={() => openViewModal(report)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"><Eye size={16} className="text-slate-500 dark:text-slate-400" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isViewModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-5 flex justify-between">
              <div><h2 className="text-lg font-semibold text-slate-900 dark:text-white">Damage Report</h2><p className="text-sm text-slate-500 dark:text-slate-400 font-mono">DR-{selectedReport.report_id}</p></div>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"><XCircle size={20} className="text-slate-400 dark:text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Subject</label><p className="text-base font-semibold text-slate-900 dark:text-white mt-1">{selectedReport.subject}</p></div>
              <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Description</label><p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">{selectedReport.description}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Equipment / PC</label><p className="text-sm mt-1 font-medium text-slate-900 dark:text-white">{selectedReport.equipment_name}</p><p className="text-xs text-slate-400 font-mono">{selectedReport.pc_name}</p></div>
                <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Reported By</label><p className="text-sm mt-1 text-slate-700 dark:text-slate-300">{selectedReport.reporter_name}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Created At</label><p className="text-sm mt-1 text-slate-700 dark:text-slate-300">{new Date(selectedReport.created_at).toLocaleString()}</p></div>
                {selectedReport.resolved_at && (<div><label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Resolved At</label><p className="text-sm mt-1 text-slate-700 dark:text-slate-300">{new Date(selectedReport.resolved_at).toLocaleString()}</p></div>)}
              </div>
              {userRole === "admin" && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Admin Actions</h3>
                  <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Update Status</label><select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"><option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="rejected">Rejected</option></select></div>
                  <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Admin Remarks</label><textarea value={adminRemark} onChange={(e) => setAdminRemark(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" /></div>
                  <button onClick={handleUpdateReport} className="w-full py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 dark:hover:bg-slate-600 transition"><Send size={16} /> Update Report</button>
                </div>
              )}
              {userRole !== "admin" && selectedReport.admin_remarks && (<div className="border-t border-slate-200 dark:border-slate-700 pt-4"><h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Admin Remarks</h3><div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg"><p className="text-sm text-slate-700 dark:text-slate-300">{selectedReport.admin_remarks}</p></div></div>)}
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700"><h2 className="text-lg font-semibold text-slate-900 dark:text-white">Report Damage</h2></div>
            <div className="p-6 space-y-4">
              <select value={newReport.equipment_id} onChange={(e) => setNewReport({ ...newReport, equipment_id: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"><option value="">Select Equipment</option>{equipment.map((item) => (<option key={item.equipment_id} value={item.equipment_id}>{item.item_name} ({item.pc_name})</option>))}</select>
              <input type="text" placeholder="Subject" value={newReport.subject} onChange={(e) => setNewReport({ ...newReport, subject: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
              <textarea placeholder="Description" rows={4} value={newReport.description} onChange={(e) => setNewReport({ ...newReport, description: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
            </div>
            <div className="px-6 py-5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
              <button onClick={handleSubmitReport} className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition">Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}