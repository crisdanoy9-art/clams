import React, { useState } from "react";
import {
  AlertTriangle,
  Search,
  Plus,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Monitor,
  Calendar,
  MessageSquare,
  Eye,
  Send,
  Filter,
  FileText,
  History,
  List,
} from "lucide-react";

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

// Mock data for damage reports
const MOCK_DAMAGE_REPORTS = [
  {
    id: 1,
    report_id: "DR-001",
    subject: "Broken Monitor Screen",
    description:
      "The monitor in CCS Lab 1 station 5 has a cracked screen. Display shows lines and flickering.",
    equipment_id: 1,
    equipment_name: "Desktop Computer",
    equipment_asset_tag: "A-001",
    instructor_id: "user-001",
    instructor_name: "John Doe",
    instructor_email: "john.doe@university.edu",
    status: "open",
    admin_remarks: null,
    created_at: "2026-05-08 09:30:00",
    resolved_at: null,
  },
  {
    id: 2,
    report_id: "DR-002",
    subject: "Keyboard Not Responding",
    description:
      "The keyboard at station 3 has multiple keys that are not responding. Some keys are stuck.",
    equipment_id: null,
    equipment_name: "Mechanical Keyboard",
    equipment_asset_tag: "P-001",
    instructor_id: "user-002",
    instructor_name: "Jane Smith",
    instructor_email: "jane.smith@university.edu",
    status: "in_progress",
    admin_remarks: "Replacement keyboard ordered. Will be delivered tomorrow.",
    created_at: "2026-05-07 14:15:00",
    resolved_at: null,
  },
  {
    id: 3,
    report_id: "DR-003",
    subject: "Projector Not Turning On",
    description:
      "The projector in CCS Lab 2 won't power on. Checked power cable and outlet, both working.",
    equipment_id: 3,
    equipment_name: "Projector",
    equipment_asset_tag: "A-003",
    instructor_id: "user-003",
    instructor_name: "Mike Johnson",
    instructor_email: "mike.johnson@university.edu",
    status: "resolved",
    admin_remarks: "Bulb replaced. Projector working normally now.",
    created_at: "2026-05-05 10:00:00",
    resolved_at: "2026-05-06 15:30:00",
  },
  {
    id: 4,
    report_id: "DR-004",
    subject: "Mouse Double Clicking Issue",
    description:
      "The mouse is registering double clicks when single clicking. Very difficult to use.",
    equipment_id: null,
    equipment_name: "Wireless Mouse",
    equipment_asset_tag: "P-002",
    instructor_id: "user-001",
    instructor_name: "John Doe",
    instructor_email: "john.doe@university.edu",
    status: "rejected",
    admin_remarks:
      "Issue not reproducible after testing. Please provide more details or video evidence.",
    created_at: "2026-05-06 11:20:00",
    resolved_at: "2026-05-07 09:00:00",
  },
  {
    id: 5,
    report_id: "DR-005",
    subject: "Printer Paper Jam",
    description:
      "The printer in Network Lab has a persistent paper jam. Cleared it twice but keeps jamming.",
    equipment_id: 6,
    equipment_name: "Laser Printer",
    equipment_asset_tag: "P-006",
    instructor_id: "user-004",
    instructor_name: "Sarah Wilson",
    instructor_email: "sarah.wilson@university.edu",
    status: "open",
    admin_remarks: null,
    created_at: "2026-05-08 13:45:00",
    resolved_at: null,
  },
  {
    id: 6,
    report_id: "DR-006",
    subject: "Computer Slow Performance",
    description:
      "Computer at station 8 is extremely slow. Takes 10+ minutes to boot up.",
    equipment_id: 2,
    equipment_name: "Desktop Computer",
    equipment_asset_tag: "A-002",
    instructor_id: "user-002",
    instructor_name: "Jane Smith",
    instructor_email: "jane.smith@university.edu",
    status: "in_progress",
    admin_remarks: "Running diagnostics. Will update once complete.",
    created_at: "2026-05-07 08:30:00",
    resolved_at: null,
  },
];

// Mock equipment list for the report form
const MOCK_EQUIPMENT = [
  { id: 1, name: "Desktop Computer", asset_tag: "A-001", lab: "CCS Lab 1" },
  { id: 2, name: "Desktop Computer", asset_tag: "A-002", lab: "CCS Lab 1" },
  { id: 3, name: "Projector", asset_tag: "A-003", lab: "CCS Lab 2" },
  { id: 4, name: "Laptop", asset_tag: "A-004", lab: "Research Lab" },
  { id: 5, name: "UPS", asset_tag: "A-005", lab: "CCS Lab 3" },
  { id: 6, name: "Switch", asset_tag: "A-006", lab: "Network Lab" },
];

const MOCK_PERIPHERALS = [
  { id: 1, name: "Mechanical Keyboard", asset_tag: "P-001", lab: "CCS Lab 1" },
  { id: 2, name: "Wireless Mouse", asset_tag: "P-002", lab: "CCS Lab 1" },
  { id: 3, name: "Document Camera", asset_tag: "P-003", lab: "CCS Lab 2" },
  { id: 4, name: "Headset", asset_tag: "P-004", lab: "Research Lab" },
  { id: 5, name: "Microphone", asset_tag: "P-005", lab: "CCS Lab 3" },
  { id: 6, name: "Laser Printer", asset_tag: "P-006", lab: "Network Lab" },
];

export default function DamageReports({ userRole }) {
  const [damageReports, setDamageReports] = useState(MOCK_DAMAGE_REPORTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [adminRemark, setAdminRemark] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // For instructor view
  const [instructorView, setInstructorView] = useState("my_reports"); // "my_reports" or "resolved"

  // For new report form
  const [newReport, setNewReport] = useState({
    equipment_type: "equipment",
    equipment_id: "",
    subject: "",
    description: "",
  });

  // Get current user (mock - in real app, this would come from auth context)
  const currentUser = {
    id: "user-001",
    name: "John Doe",
    email: "john.doe@university.edu",
    role: userRole,
  };

  // Filter reports based on user role
  let filteredReports = damageReports;

  if (userRole === "instructor") {
    if (instructorView === "my_reports") {
      filteredReports = damageReports.filter(
        (r) => r.instructor_id === currentUser.id,
      );
    } else if (instructorView === "resolved") {
      filteredReports = damageReports.filter(
        (r) => r.instructor_id === currentUser.id && r.status === "resolved",
      );
    }
  }

  // Apply search and status filters
  const filtered = filteredReports.filter((report) => {
    const matchSearch =
      report.subject.toLowerCase().includes(search.toLowerCase()) ||
      report.report_id.toLowerCase().includes(search.toLowerCase()) ||
      report.equipment_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || report.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Calculate statistics based on user role
  let stats = {};
  if (userRole === "admin") {
    const openReports = damageReports.filter((r) => r.status === "open").length;
    const inProgressReports = damageReports.filter(
      (r) => r.status === "in_progress",
    ).length;
    const resolvedReports = damageReports.filter(
      (r) => r.status === "resolved",
    ).length;
    stats = {
      openReports,
      inProgressReports,
      resolvedReports,
      total: damageReports.length,
    };
  } else {
    const myReports = damageReports.filter(
      (r) => r.instructor_id === currentUser.id,
    );
    const myOpenReports = myReports.filter(
      (r) => r.status === "open" || r.status === "in_progress",
    ).length;
    const myResolvedReports = myReports.filter(
      (r) => r.status === "resolved",
    ).length;
    stats = { myReports: myReports.length, myOpenReports, myResolvedReports };
  }

  const handleUpdateReport = () => {
    if (selectedReport && adminRemark) {
      setDamageReports((prev) =>
        prev.map((report) =>
          report.id === selectedReport.id
            ? {
                ...report,
                status: newStatus || report.status,
                admin_remarks: adminRemark,
                resolved_at:
                  newStatus === "resolved"
                    ? new Date().toISOString().slice(0, 19).replace("T", " ")
                    : report.resolved_at,
              }
            : report,
        ),
      );
      setIsViewModalOpen(false);
      setSelectedReport(null);
      setAdminRemark("");
      setNewStatus("");
    }
  };

  const handleSubmitReport = () => {
    if (
      !newReport.subject ||
      !newReport.description ||
      !newReport.equipment_id
    ) {
      alert("Please fill in all fields");
      return;
    }

    const selectedEquipment =
      newReport.equipment_type === "equipment"
        ? MOCK_EQUIPMENT.find((e) => e.id === parseInt(newReport.equipment_id))
        : MOCK_PERIPHERALS.find(
            (p) => p.id === parseInt(newReport.equipment_id),
          );

    const newReportObj = {
      id: damageReports.length + 1,
      report_id: `DR-${String(damageReports.length + 1).padStart(3, "0")}`,
      subject: newReport.subject,
      description: newReport.description,
      equipment_id: parseInt(newReport.equipment_id),
      equipment_name: selectedEquipment?.name,
      equipment_asset_tag: selectedEquipment?.asset_tag,
      instructor_id: currentUser.id,
      instructor_name: currentUser.name,
      instructor_email: currentUser.email,
      status: "open",
      admin_remarks: null,
      created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      resolved_at: null,
    };

    setDamageReports((prev) => [...prev, newReportObj]);
    setIsFormOpen(false);
    setNewReport({
      equipment_type: "equipment",
      equipment_id: "",
      subject: "",
      description: "",
    });
  };

  const openViewModal = (report) => {
    setSelectedReport(report);
    setAdminRemark(report.admin_remarks || "");
    setNewStatus(report.status);
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
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition cursor-pointer"
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
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              New Report
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {userRole === "admin" ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Open
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.openReports}
              </p>
              <p className="text-xs text-slate-400">Awaiting action</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                In Progress
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.inProgressReports}
              </p>
              <p className="text-xs text-slate-400">Being addressed</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Resolved
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.resolvedReports}
              </p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <FileText size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Total
              </p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-400">All reports</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <FileText size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                My Reports
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.myReports}
              </p>
              <p className="text-xs text-slate-400">Total submitted</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Pending
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.myOpenReports}
              </p>
              <p className="text-xs text-slate-400">Awaiting resolution</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Resolved
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.myResolvedReports}
              </p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructor View Tabs */}
      {userRole === "instructor" && (
        <div className="flex gap-2 border-b border-slate-100">
          <button
            onClick={() => setInstructorView("my_reports")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              instructorView === "my_reports"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <List size={16} />
              My Reports
            </div>
          </button>
          <button
            onClick={() => setInstructorView("resolved")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              instructorView === "resolved"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              Resolved Reports
            </div>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Report ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Subject
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Equipment
                </th>
                {userRole === "admin" && (
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Reported By
                  </th>
                )}
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
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
                    className="text-center py-12 text-slate-400 text-sm"
                  >
                    No damage reports found.
                  </td>
                </tr>
              ) : (
                filtered.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                      {report.report_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <AlertTriangle size={15} className="text-red-500" />
                        </div>
                        <span className="font-medium text-slate-800">
                          {report.subject}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {report.equipment_name}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          {report.equipment_asset_tag}
                        </p>
                      </div>
                    </td>
                    {userRole === "admin" && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <User size={12} className="text-slate-500" />
                          </div>
                          <span className="text-sm text-slate-600">
                            {report.instructor_name}
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[report.status]}`}
                      >
                        {getStatusIcon(report.status)}
                        {STATUS_LABELS[report.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {report.created_at.split(" ")[0]}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openViewModal(report)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Damage Report
                </h2>
                <p className="text-sm text-slate-500 font-mono">
                  {selectedReport.report_id}
                </p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition"
              >
                <XCircle size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Report Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Subject
                  </label>
                  <p className="text-base font-semibold text-slate-900 mt-1">
                    {selectedReport.subject}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Description
                  </label>
                  <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-3 rounded-lg">
                    {selectedReport.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Equipment
                    </label>
                    <p className="text-sm text-slate-700 mt-1 font-medium">
                      {selectedReport.equipment_name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      {selectedReport.equipment_asset_tag}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Reported By
                    </label>
                    <p className="text-sm text-slate-700 mt-1">
                      {selectedReport.instructor_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {selectedReport.instructor_email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Created At
                    </label>
                    <p className="text-sm text-slate-700 mt-1">
                      {selectedReport.created_at}
                    </p>
                  </div>
                  {selectedReport.resolved_at && (
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Resolved At
                      </label>
                      <p className="text-sm text-slate-700 mt-1">
                        {selectedReport.resolved_at}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Section */}
              {userRole === "admin" && (
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Admin Actions
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Update Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Admin Remarks
                    </label>
                    <textarea
                      value={adminRemark}
                      onChange={(e) => setAdminRemark(e.target.value)}
                      rows={4}
                      placeholder="Add your remarks here..."
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition resize-none"
                    />
                  </div>

                  <button
                    onClick={handleUpdateReport}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    <Send size={16} />
                    Update Report
                  </button>
                </div>
              )}

              {/* Admin Remarks Display (for instructors) */}
              {userRole !== "admin" && selectedReport.admin_remarks && (
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">
                    Admin Remarks
                  </h3>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-600">
                      {selectedReport.admin_remarks}
                    </p>
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
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">
                Report Damage
              </h2>
              <p className="text-sm text-slate-500">
                Submit a new damage report
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Equipment Type
                </label>
                <select
                  value={newReport.equipment_type}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      equipment_type: e.target.value,
                      equipment_id: "",
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                >
                  <option value="equipment">Equipment</option>
                  <option value="peripheral">Peripheral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  {newReport.equipment_type === "equipment"
                    ? "Equipment"
                    : "Peripheral"}
                </label>
                <select
                  value={newReport.equipment_id}
                  onChange={(e) =>
                    setNewReport({ ...newReport, equipment_id: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                >
                  <option value="">
                    Select{" "}
                    {newReport.equipment_type === "equipment"
                      ? "equipment"
                      : "peripheral"}
                  </option>
                  {(newReport.equipment_type === "equipment"
                    ? MOCK_EQUIPMENT
                    : MOCK_PERIPHERALS
                  ).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.asset_tag}) - {item.lab}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={newReport.subject}
                  onChange={(e) =>
                    setNewReport({ ...newReport, subject: e.target.value })
                  }
                  placeholder="Brief description of the issue"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Description
                </label>
                <textarea
                  value={newReport.description}
                  onChange={(e) =>
                    setNewReport({ ...newReport, description: e.target.value })
                  }
                  rows={4}
                  placeholder="Provide detailed information about the damage..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition"
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
