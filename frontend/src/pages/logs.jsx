// frontend/src/pages/logs.jsx
import React, { useState, useEffect } from "react";
import { Search, User, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const ACTION_STYLES = {
  CREATE: "bg-emerald-50 text-emerald-700",
  UPDATE: "bg-blue-50 text-blue-700",
  DELETE: "bg-red-50 text-red-600",
  BORROW: "bg-amber-50 text-amber-700",
  RETURN: "bg-emerald-50 text-emerald-700",
  REPORT: "bg-red-50 text-red-600",
  LOGIN: "bg-green-50 text-green-700",
};

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/activity-logs");
      setLogs(response.data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (l) =>
      (l.action?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (l.username?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (l.table_affected?.toLowerCase() || "").includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
          <p className="text-sm text-slate-500 mt-1">
            {logs.length} total records
          </p>
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by action, user, or table..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 w-64"
          />
        </div>
      </div>

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
                  Table
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Record ID
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
                    key={log.log_id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap font-mono">
                      {new Date(log.created_at).toLocaleString()}
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
                            {log.username || log.first_name || "System"}
                          </p>
                          <p className="text-xs text-slate-400 capitalize">
                            {log.user_role || "user"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                          ACTION_STYLES[log.action] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 font-mono">
                        {log.table_affected}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 font-mono">
                        {log.record_id}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{" "}
            {filteredLogs.length} entries
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
