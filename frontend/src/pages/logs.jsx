import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, User, Shield, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const ACTION_STYLES = {
  CREATE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  UPDATE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  BORROW: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  RETURN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  REPORT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  LOGIN: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  LOGOUT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  BULK_CREATE: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  BULK_DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ActivityLogs({ onRefresh }) {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const fetchLogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/activity-logs?limit=50&page=${page}`);
      
      if (isMounted.current) {
        // Ensure logs is always an array
        const logsData = response.data?.logs || [];
        setLogs(Array.isArray(logsData) ? logsData : []);
        setPagination({
          currentPage: response.data?.pagination?.currentPage || 1,
          totalPages: response.data?.pagination?.totalPages || 1,
          totalItems: response.data?.pagination?.totalItems || 0,
          itemsPerPage: response.data?.pagination?.itemsPerPage || 50
        });
      }
      if (onRefresh && typeof onRefresh === 'function') onRefresh();
    } catch (error) {
      console.error("Error fetching logs:", error);
      if (isMounted.current) {
        toast.error("Failed to load activity logs");
        setLogs([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [onRefresh]);

  useEffect(() => {
    isMounted.current = true;
    fetchLogs(1);
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Filter logs - ensure logs is an array before filtering
  const filteredLogs = Array.isArray(logs) ? logs.filter((log) => {
    if (!log) return false;
    const searchTerm = search.toLowerCase();
    return (
      (log.action?.toLowerCase() || "").includes(searchTerm) ||
      (log.username?.toLowerCase() || "").includes(searchTerm) ||
      (log.table_affected?.toLowerCase() || "").includes(searchTerm) ||
      (log.first_name?.toLowerCase() || "").includes(searchTerm) ||
      (log.last_name?.toLowerCase() || "").includes(searchTerm)
    );
  }) : [];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchLogs(newPage);
    }
  };

  const handleManualRefresh = () => {
    fetchLogs(pagination.currentPage);
  };

  const getDisplayName = (log) => {
    if (log.first_name && log.last_name) {
      return `${log.first_name} ${log.last_name}`;
    }
    if (log.username) return log.username;
    return "System";
  };

  const getActionStyle = (action) => {
    if (action === "BULK_CREATE") return ACTION_STYLES.BULK_CREATE;
    if (action === "BULK_DELETE") return ACTION_STYLES.BULK_DELETE;
    return ACTION_STYLES[action] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Activity Logs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {pagination.totalItems} total records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              placeholder="Search by action, user, or table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white w-64 transition"
            />
          </div>
          <button
            onClick={handleManualRefresh}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition transform hover:scale-105"
            title="Refresh Logs"
          >
            <RefreshCw size={18} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Shield size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Total Logs</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{pagination.totalItems}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">System events</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <User size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Unique Users</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{new Set(Array.isArray(logs) ? logs.map(l => l.user_id) : []).size}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Active participants</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <RefreshCw size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Today's Logs</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {Array.isArray(logs) ? logs.filter(l => {
                if (!l.created_at) return false;
                const today = new Date().toDateString();
                return new Date(l.created_at).toDateString() === today;
              }).length : 0}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Last 24 hours</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Shield size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Admin Actions</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{Array.isArray(logs) ? logs.filter(l => l.user_role === "admin").length : 0}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">By administrators</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Timestamp</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">User</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Action</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Table</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                    {search ? "No matching activity logs found." : "No activity logs available."}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr
                    key={log.log_id || index}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          {log.user_role === "admin" ? (
                            <Shield size={12} className="text-slate-600 dark:text-slate-400" />
                          ) : (
                            <User size={12} className="text-slate-500 dark:text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {getDisplayName(log)}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                            {log.user_role || "user"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${getActionStyle(log.action)}`}
                      >
                        {log.action || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono capitalize">
                        {log.table_affected?.replace(/_/g, " ") || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {log.bulk_count > 1 ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="font-semibold">{log.bulk_count}</span> items
                            {log.bulk_details && <span className="text-slate-400">({log.bulk_details})</span>}
                          </span>
                        ) : (
                          <span>ID: {log.record_id !== null && log.record_id !== undefined ? log.record_id : "-"}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total entries)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} className="text-slate-600 dark:text-slate-400" />
            </button>
            <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}