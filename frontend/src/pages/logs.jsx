import { useState } from "react";
import {
  History,
  Search,
  User,
  Shield,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Mock data (same as before)
const MOCK_ACTIVITY_LOGS = [
  {
    id: 1,
    user_id: "admin-001",
    user_name: "Admin User",
    user_role: "admin",
    action: "CREATE",
    action_type: "equipment",
    table_affected: "equipment",
    details: "Added new equipment: Dell Monitor (A-107) to CCS Lab 1",
    status: "success",
    ip_address: "192.168.1.100",
    created_at: "2026-05-09 11:30:00",
  },
  {
    id: 2,
    user_id: "admin-001",
    user_name: "Admin User",
    user_role: "admin",
    action: "UPDATE",
    action_type: "equipment",
    table_affected: "equipment",
    details:
      "Updated equipment status: Projector (A-003) from 'for_repair' to 'working'",
    status: "success",
    ip_address: "192.168.1.100",
    created_at: "2026-05-09 10:15:00",
  },
  {
    id: 3,
    user_id: "admin-001",
    user_name: "Admin User",
    user_role: "admin",
    action: "DELETE",
    action_type: "equipment",
    table_affected: "equipment",
    details: "Removed retired equipment: Old Printer (A-099) from inventory",
    status: "success",
    ip_address: "192.168.1.100",
    created_at: "2026-05-08 16:20:00",
  },
  {
    id: 4,
    user_id: "user-001",
    user_name: "John Doe",
    user_role: "instructor",
    action: "BORROW",
    action_type: "borrow",
    table_affected: "borrow_transactions",
    details:
      "Borrowed Desktop Computer (A-001) from CCS Lab 1. Expected return: 2026-05-16",
    status: "success",
    ip_address: "192.168.1.50",
    created_at: "2026-05-09 09:30:00",
  },
  {
    id: 5,
    user_id: "user-002",
    user_name: "Jane Smith",
    user_role: "instructor",
    action: "RETURN",
    action_type: "borrow",
    table_affected: "borrow_transactions",
    details: "Returned Projector (A-003) to CCS Lab 2. Returned on time.",
    status: "success",
    ip_address: "192.168.1.51",
    created_at: "2026-05-09 08:45:00",
  },
  {
    id: 6,
    user_id: "user-001",
    user_name: "John Doe",
    user_role: "instructor",
    action: "REPORT",
    action_type: "damage",
    table_affected: "damage_reports",
    details: "Submitted damage report: Broken Monitor Screen in CCS Lab 1",
    status: "success",
    ip_address: "192.168.1.50",
    created_at: "2026-05-08 11:00:00",
  },
  {
    id: 7,
    user_id: "admin-001",
    user_name: "Admin User",
    user_role: "admin",
    action: "LOGIN",
    action_type: "auth",
    table_affected: "sessions",
    details: "Admin logged in from Safari on MacOS",
    status: "success",
    ip_address: "192.168.1.100",
    created_at: "2026-05-09 07:30:00",
  },
];

const ACTION_STYLES = {
  CREATE: "bg-emerald-50 text-emerald-700",
  UPDATE: "bg-blue-50 text-blue-700",
  DELETE: "bg-red-50 text-red-600",
  BORROW: "bg-amber-50 text-amber-700",
  RETURN: "bg-emerald-50 text-emerald-700",
  REPORT: "bg-red-50 text-red-600",
  LOGIN: "bg-green-50 text-green-700",
};

export default function ActivityLogs({ userRole }) {
  const [logs] = useState(MOCK_ACTIVITY_LOGS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Simple search only (no filters)
  const filteredLogs = logs.filter(
    (log) =>
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.user_name.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()),
  );

  const totalLogs = filteredLogs.length;
  const totalPages = Math.ceil(totalLogs / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalLogs} total records
          </p>
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Timestamp
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  User
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Action
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Details
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-slate-400 text-sm"
                  >
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap font-mono">
                      {log.created_at}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                          {log.user_role === "admin" ? (
                            <Shield size={12} className="text-slate-600" />
                          ) : (
                            <User size={12} className="text-slate-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {log.user_name}
                          </p>
                          <p className="text-xs text-slate-400 capitalize">
                            {log.user_role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${ACTION_STYLES[log.action] || "bg-slate-100 text-slate-600"}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 max-w-md truncate">
                        {log.details}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-slate-400 font-mono">
                        {log.ip_address}
                      </code>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalLogs)} of {totalLogs}{" "}
              entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
