import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Eye, Clock, CheckCircle, AlertTriangle, Monitor, UserPlus, Edit, Trash2, LogIn, LogOut, ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useRefresh } from "../contexts/RefreshContext";

export default function NotificationBell({ userRole, onNavigate }) {
  const [activities, setActivities] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dropdownRef = useRef(null);
  const { refreshTrigger, triggerRefresh } = useRefresh();

  useEffect(() => {
    fetchUnreadCount();
    if (isOpen) {
      fetchRecentActivities();
    }
  }, [refreshTrigger, currentPage, isOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await axiosInstance.get("/activities/unread-count");
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/activities/recent?limit=10&page=${currentPage}`);
      setActivities(response.data.activities || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/activities/mark-read");
      await fetchUnreadCount();
      await fetchRecentActivities();
      triggerRefresh();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleBellClick = () => {
    if (!isOpen) {
      // When opening, mark all as read
      if (unreadCount > 0) {
        markAllAsRead();
      }
      setCurrentPage(1);
      fetchRecentActivities();
    }
    setIsOpen(!isOpen);
  };

  const getActivityIcon = (action, table, bulkCount) => {
    const iconProps = { size: 14 };
    if (action === "BULK_CREATE") {
      return <Monitor {...iconProps} className="text-purple-500" />;
    }
    if (action === "BULK_DELETE") {
      return <Trash2 {...iconProps} className="text-red-500" />;
    }
    switch (action) {
      case "CREATE": 
        if (table === "equipment") return <Monitor {...iconProps} className="text-blue-500" />;
        if (table === "users") return <UserPlus {...iconProps} className="text-green-500" />;
        return <CheckCircle {...iconProps} className="text-emerald-500" />;
      case "UPDATE": return <Edit {...iconProps} className="text-amber-500" />;
      case "DELETE": return <Trash2 {...iconProps} className="text-red-500" />;
      case "LOGIN": return <LogIn {...iconProps} className="text-green-500" />;
      case "LOGOUT": return <LogOut {...iconProps} className="text-slate-500" />;
      case "BORROW": return <ClipboardList {...iconProps} className="text-blue-500" />;
      case "RETURN": return <CheckCircle {...iconProps} className="text-emerald-500" />;
      case "REPORT": return <AlertTriangle {...iconProps} className="text-red-500" />;
      default: return <Bell {...iconProps} className="text-slate-500" />;
    }
  };

  const getActivityColor = (action) => {
    if (action === "BULK_CREATE") return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    if (action === "BULK_DELETE") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    switch (action) {
      case "CREATE": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "UPDATE": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "DELETE": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "LOGIN": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "BORROW": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "RETURN": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "REPORT": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  const getActivityMessage = (activity) => {
    const userName = activity.first_name ? `${activity.first_name} ${activity.last_name}` : activity.username || "System";
    
    if (activity.action === "BULK_CREATE") {
      return `${userName} created ${activity.bulk_count} ${activity.table_affected}`;
    }
    if (activity.action === "BULK_DELETE") {
      return `${userName} deleted ${activity.bulk_count} ${activity.table_affected}`;
    }
    
    switch (activity.action) {
      case "CREATE":
        return `${userName} created a new ${activity.table_affected?.replace(/_/g, " ")}`;
      case "UPDATE":
        return `${userName} updated a ${activity.table_affected?.replace(/_/g, " ")}`;
      case "DELETE":
        return `${userName} deleted a ${activity.table_affected?.replace(/_/g, " ")}`;
      case "LOGIN":
        return `${userName} logged into the system`;
      case "BORROW":
        return `${userName} borrowed equipment`;
      case "RETURN":
        return `${userName} returned equipment`;
      case "REPORT":
        return `${userName} filed a damage report`;
      default:
        return `${userName} performed ${activity.action}`;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
      >
        <Bell size={20} className="text-slate-600 dark:text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Activities</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline transition"
              >
                <CheckCheck size={14} />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && activities.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activities</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.log_id}
                  className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer group ${
                    !activity.is_read ? "bg-blue-50/30 dark:bg-blue-950/20" : ""
                  }`}
                  onClick={() => {
                    // Navigate to relevant page
                    if (activity.table_affected === "damage_reports") onNavigate("reports");
                    else if (activity.table_affected === "equipment") onNavigate("equipment");
                    else if (activity.table_affected === "borrow_transactions") onNavigate("borrow");
                    else if (activity.table_affected === "users") onNavigate("users");
                    else if (activity.table_affected === "laboratories") onNavigate("laboratories");
                    else onNavigate("logs");
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${getActivityColor(activity.action)}`}>
                      {getActivityIcon(activity.action, activity.table_affected, activity.bulk_count)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                        {getActivityMessage(activity)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-400">{formatTime(activity.created_at)}</span>
                        {activity.bulk_count > 1 && (
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                            {activity.bulk_count} items
                          </span>
                        )}
                      </div>
                    </div>
                    <Eye size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-all duration-200"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-all duration-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                onNavigate("logs");
                setIsOpen(false);
              }}
              className="w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline transition"
            >
              View all activity logs →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-top-2 {
          from { 
            opacity: 0;
            transform: translateY(-8px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation-duration: 200ms;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .slide-in-from-top-2 {
          animation-name: slide-in-from-top-2;
        }
      `}</style>
    </div>
  );
}