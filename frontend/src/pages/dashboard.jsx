// frontend/src/pages/dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  Monitor,
  MousePointer2,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  UserPlus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const getActivityIcon = (action) => {
  switch (action) {
    case "CREATE":
      return <UserPlus size={15} />;
    case "UPDATE":
      return <Edit size={15} />;
    case "DELETE":
      return <Trash2 size={15} />;
    case "LOGIN":
      return <LogIn size={15} />;
    case "LOGOUT":
      return <LogOut size={15} />;
    case "BORROW":
      return <ClipboardList size={15} />;
    case "RETURN":
      return <CheckCircle2 size={15} />;
    case "REPORT":
      return <AlertTriangle size={15} />;
    default:
      return <TrendingUp size={15} />;
  }
};

const getActivityColor = (action) => {
  switch (action) {
    case "CREATE":
      return "text-emerald-500";
    case "UPDATE":
      return "text-blue-500";
    case "DELETE":
      return "text-red-500";
    case "LOGIN":
      return "text-green-500";
    case "LOGOUT":
      return "text-slate-500";
    case "BORROW":
      return "text-amber-500";
    case "RETURN":
      return "text-emerald-500";
    case "REPORT":
      return "text-red-500";
    default:
      return "text-indigo-500";
  }
};

const formatRelativeTime = (dateStr) => {
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

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-start gap-4">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-0.5 leading-none">
        {value}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
    </div>
  </div>
);

const QuickCard = ({ icon, label, desc, onClick, color }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl border border-slate-100 p-5 text-left hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
  >
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}
    >
      {icon}
    </div>
    <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
      {label}
    </p>
    <p className="text-xs text-slate-400 mt-1">{desc}</p>
  </button>
);

export default function Dashboard({ userRole, currentUser, onNavigate }) {
  const [stats, setStats] = useState({
    labs: 0,
    equipment: 0,
    peripherals: 0,
    activeBorrows: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Always fetch these – they are public or work for both roles
      const [inventoryRes, transactionsRes, peripheralsRes] = await Promise.all(
        [
          axiosInstance.get("/inventory"),
          axiosInstance.get("/transactions"),
          axiosInstance.get("/peripherals"),
        ],
      );

      const inventory = inventoryRes.data || [];
      const transactions = transactionsRes.data || [];
      const peripherals = peripheralsRes.data || [];

      // Stats
      const uniqueLabs = [
        ...new Set(inventory.map((item) => item.lab_name).filter(Boolean)),
      ];
      const activeBorrows = transactions.filter(
        (t) => t.transaction_status === "borrowed",
      ).length;
      const totalEquipment = inventory.length;
      const totalPeripherals = peripherals.reduce(
        (sum, p) => sum + (p.working_count + p.damaged_count),
        0,
      );

      setStats({
        labs: uniqueLabs.length,
        equipment: totalEquipment,
        peripherals: totalPeripherals,
        activeBorrows,
      });

      // Asset status from equipment
      const equipmentStatus = inventory.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
      const total = Object.values(equipmentStatus).reduce((a, b) => a + b, 0);
      setAssetStatus([
        {
          label: "Working",
          count: equipmentStatus.working || 0,
          total,
          color: "bg-emerald-500",
        },
        {
          label: "For Repair",
          count: equipmentStatus.for_repair || 0,
          total,
          color: "bg-amber-400",
        },
        {
          label: "Retired",
          count: equipmentStatus.retired || 0,
          total,
          color: "bg-slate-300",
        },
        {
          label: "Lost",
          count: equipmentStatus.lost || 0,
          total,
          color: "bg-red-400",
        },
      ]);

      // Only fetch activity logs if user is admin (they are protected)
      if (userRole === "admin") {
        try {
          const logsRes = await axiosInstance.get("/activity-logs?limit=10");
          const logs = logsRes.data || [];
          const recent = logs.slice(0, 5).map((log) => ({
            icon: getActivityIcon(log.action),
            text: `${log.action} on ${log.table_affected} ${log.record_id ? `(ID: ${log.record_id})` : ""}`,
            time: formatRelativeTime(log.created_at),
            color: getActivityColor(log.action),
          }));
          setRecentActivity(recent);
        } catch (err) {
          console.warn("Could not fetch activity logs:", err);
          setRecentActivity([]);
        }
      } else {
        // For instructors, you could show their own transactions or leave empty
        setRecentActivity([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back,{" "}
          {currentUser?.first_name || currentUser?.username || "User"}!
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here's an overview of the CCS laboratory assets.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<FlaskConical size={22} className="text-indigo-600" />}
          color="bg-indigo-50"
          label="Laboratories"
          value={stats.labs}
          sub="All operational"
        />
        <StatCard
          icon={<Monitor size={22} className="text-blue-600" />}
          color="bg-blue-50"
          label="Equipment"
          value={stats.equipment}
          sub="Assets tracked"
        />
        <StatCard
          icon={<MousePointer2 size={22} className="text-violet-600" />}
          color="bg-violet-50"
          label="Peripherals"
          value={stats.peripherals}
          sub="Total units"
        />
        <StatCard
          icon={<ClipboardList size={22} className="text-emerald-600" />}
          color="bg-emerald-50"
          label="Active Borrows"
          value={stats.activeBorrows}
          sub="Current loans"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-800">
              Recent Activity
            </h2>
            <span className="text-xs text-slate-400">Latest actions</span>
          </div>
          <ul className="divide-y divide-slate-50">
            {recentActivity.length === 0 ? (
              <li className="py-4 text-center text-slate-400">
                No recent activity
              </li>
            ) : (
              recentActivity.map((item, i) => (
                <li key={i} className="flex items-start gap-3 py-3.5">
                  <span className={`mt-0.5 shrink-0 ${item.color}`}>
                    {item.icon}
                  </span>
                  <p className="text-sm text-slate-600 flex-1">{item.text}</p>
                  <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">
                    {item.time}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-5">
            Asset Status
          </h2>
          <div className="flex flex-col gap-3">
            {assetStatus.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{s.label}</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {s.count}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: `${(s.count / s.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-slate-50">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-xl px-4 py-3">
              <Clock size={16} />
              <p className="text-sm font-medium">Real‑time asset tracking</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-800 mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickCard
            icon={<FlaskConical size={20} className="text-indigo-600" />}
            color="bg-indigo-50"
            label="Laboratories"
            desc="View all labs"
            onClick={() => onNavigate("laboratories")}
          />
          <QuickCard
            icon={<Monitor size={20} className="text-blue-600" />}
            color="bg-blue-50"
            label="Equipment"
            desc="Manage assets"
            onClick={() => onNavigate("equipment")}
          />
          <QuickCard
            icon={<MousePointer2 size={20} className="text-violet-600" />}
            color="bg-violet-50"
            label="Peripherals"
            desc="Track peripherals"
            onClick={() => onNavigate("peripherals")}
          />
          <QuickCard
            icon={<ClipboardList size={20} className="text-emerald-600" />}
            color="bg-emerald-50"
            label="Borrow & Return"
            desc="Manage transactions"
            onClick={() => onNavigate("borrow")}
          />
        </div>
      </div>
    </div>
  );
}
