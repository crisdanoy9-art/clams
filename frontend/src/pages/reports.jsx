// frontend/src/pages/reports.jsx
import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Search,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Eye,
  Send,
  FileText,
  List,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  open: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  resolved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-600",
};
const STATUS_LABELS = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

export default function DamageReports({ userRole, currentUser }) {
  const [reports, setReports] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [adminRemark, setAdminRemark] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [instructorView, setInstructorView] = useState("my_reports");
  const [loading, setLoading] = useState(true);
  const [newReport, setNewReport] = useState({
    equipment_id: "",
    subject: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsRes, equipmentRes] = await Promise.all([
        axiosInstance.get("/reports"),
        axiosInstance.get("/inventory"),
      ]);
      setReports(reportsRes.data || []);
      setEquipment(equipmentRes.data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

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
    if (instructorView === "my_reports") {
      filteredReports = reports.filter((r) => r.instructor_id === userId);
    } else if (instructorView === "resolved") {
      filteredReports = reports.filter(
        (r) => r.instructor_id === userId && r.report_status === "resolved",
      );
    }
  }

  const filtered = filteredReports.filter(
    (r) =>
      r.subject?.toLowerCase().includes(search.toLowerCase()) ||
      r.report_id?.toString().includes(search) ||
      r.equipment_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const stats =
    userRole === "admin"
      ? {
          openReports: reports.filter((r) => r.report_status === "open").length,
          inProgressReports: reports.filter(
            (r) => r.report_status === "in_progress",
          ).length,
          resolvedReports: reports.filter((r) => r.report_status === "resolved")
            .length,
          total: reports.length,
        }
      : {
          myReports: reports.filter(
            (r) => r.instructor_id === getCurrentUserId(),
          ).length,
          myOpenReports: reports.filter(
            (r) =>
              r.instructor_id === getCurrentUserId() &&
              (r.report_status === "open" || r.report_status === "in_progress"),
          ).length,
          myResolvedReports: reports.filter(
            (r) =>
              r.instructor_id === getCurrentUserId() &&
              r.report_status === "resolved",
          ).length,
        };

  const handleUpdateReport = async () => {
    if (selectedReport) {
      try {
        await axiosInstance.put(
          `/update/damage_reports/${selectedReport.report_id}`,
          {
            data: {
              status: newStatus,
              admin_remarks: adminRemark,
              resolved_at:
                newStatus === "resolved" ? new Date().toISOString() : null,
            },
          },
        );
        toast.success("Report updated successfully");
        setIsViewModalOpen(false);
        fetchData();
      } catch (error) {
        toast.error("Failed to update report");
      }
    }
  };

  const handleSubmitReport = async () => {
    if (
      !newReport.subject ||
      !newReport.description ||
      !newReport.equipment_id
    ) {
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
      case "open":
        return <Clock size={14} />;
      case "in_progress":
        return <AlertTriangle size={14} />;
      case "resolved":
        return <CheckCircle size={14} />;
      case "rejected":
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {userRole === "admin" ? "Damage Reports" : "My Reports"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {userRole === "admin"
              ? `${stats.total} total reports • ${stats.openReports} open`
              : `${stats.myReports} total reports • ${stats.myOpenReports} pending`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          {userRole === "instructor" && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700"
            >
              <Plus size={16} /> New Report
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards for Admin */}
      {userRole === "admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                Open
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.openReports}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                In Progress
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.inProgressReports}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                Resolved
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.resolvedReports}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <FileText size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                Total
              </p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards for Instructor */}
      {userRole === "instructor" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <FileText size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                My Reports
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.myReports}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                Pending
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.myOpenReports}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                Resolved
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.myResolvedReports}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructor View Tabs */}
      {userRole === "instructor" && (
        <div className="flex gap-2 border-b border-slate-100">
          <button
            onClick={() => setInstructorView("my_reports")}
            className={`px-4 py-2 text-sm font-medium ${
              instructorView === "my_reports"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <List size={16} /> My Reports
            </div>
          </button>
          <button
            onClick={() => setInstructorView("resolved")}
            className={`px-4 py-2 text-sm font-medium ${
              instructorView === "resolved"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={16} /> Resolved Reports
            </div>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Report ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Subject
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Equipment
                </th>
                {userRole === "admin" && (
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                    Reported By
                  </th>
                )}
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  Created
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={userRole === "admin" ? 7 : 6}
                    className="text-center py-12 text-slate-400"
                  >
                    No damage reports found.
                  </td>
                </tr>
              ) : (
                filtered.map((report) => (
                  <tr key={report.report_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                      DR-{report.report_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                          <AlertTriangle size={15} className="text-red-500" />
                        </div>
                        <span className="font-medium">{report.subject}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{report.equipment_name}</p>
                      <p className="text-xs text-slate-400 font-mono">
                        {report.asset_tag}
                      </p>
                    </td>
                    {userRole === "admin" && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <User size={12} className="text-slate-500" />
                          </div>
                          <span>{report.reporter_name}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[report.report_status]}`}
                      >
                        {getStatusIcon(report.report_status)}
                        {STATUS_LABELS[report.report_status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openViewModal(report)}
                        className="p-2 rounded-lg hover:bg-slate-100"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View/Update Modal */}
      {isViewModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex justify-between">
              <div>
                <h2 className="text-lg font-semibold">Damage Report</h2>
                <p className="text-sm text-slate-500 font-mono">
                  DR-{selectedReport.report_id}
                </p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <XCircle size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">
                  Subject
                </label>
                <p className="text-base font-semibold mt-1">
                  {selectedReport.subject}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">
                  Description
                </label>
                <p className="text-sm bg-slate-50 p-3 rounded-lg">
                  {selectedReport.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">
                    Equipment
                  </label>
                  <p className="text-sm mt-1 font-medium">
                    {selectedReport.equipment_name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedReport.asset_tag}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">
                    Reported By
                  </label>
                  <p className="text-sm mt-1">{selectedReport.reporter_name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semistrong text-slate-400 uppercase">
                    Created At
                  </label>
                  <p className="text-sm mt-1">
                    {new Date(selectedReport.created_at).toLocaleString()}
                  </p>
                </div>
                {selectedReport.resolved_at && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">
                      Resolved At
                    </label>
                    <p className="text-sm mt-1">
                      {new Date(selectedReport.resolved_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Admin Section */}
              {userRole === "admin" && (
                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-semibold">Admin Actions</h3>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">
                      Update Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-xl"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">
                      Admin Remarks
                    </label>
                    <textarea
                      value={adminRemark}
                      onChange={(e) => setAdminRemark(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border rounded-xl"
                    />
                  </div>
                  <button
                    onClick={handleUpdateReport}
                    className="w-full py-2 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Update Report
                  </button>
                </div>
              )}

              {/* Admin Remarks for Instructor */}
              {userRole !== "admin" && selectedReport.admin_remarks && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold mb-2">Admin Remarks</h3>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm">{selectedReport.admin_remarks}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Report Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="px-6 py-5 border-b">
              <h2 className="text-lg font-semibold">Report Damage</h2>
            </div>
            <div className="p-6 space-y-4">
              <select
                value={newReport.equipment_id}
                onChange={(e) =>
                  setNewReport({ ...newReport, equipment_id: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border rounded-xl"
              >
                <option value="">Select Equipment</option>
                {equipment.map((item) => (
                  <option key={item.equipment_id} value={item.equipment_id}>
                    {item.item_name} ({item.asset_tag})
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Subject"
                value={newReport.subject}
                onChange={(e) =>
                  setNewReport({ ...newReport, subject: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border rounded-xl"
              />
              <textarea
                placeholder="Description"
                rows={4}
                value={newReport.description}
                onChange={(e) =>
                  setNewReport({ ...newReport, description: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border rounded-xl"
              />
            </div>
            <div className="px-6 py-5 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
