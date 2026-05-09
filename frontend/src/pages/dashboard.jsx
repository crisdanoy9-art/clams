import React from "react";
import {
  FlaskConical,
  Monitor,
  MousePointer2,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";

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

const recentActivity = [
  {
    icon: <CheckCircle2 size={15} />,
    text: "Monitor #A-042 marked as working",
    time: "2 min ago",
    color: "text-emerald-500",
  },
  {
    icon: <AlertTriangle size={15} />,
    text: "Damage report filed for Keyboard #B-011",
    time: "14 min ago",
    color: "text-amber-500",
  },
  {
    icon: <ClipboardList size={15} />,
    text: "Juan dela Cruz borrowed Projector #C-007",
    time: "1 hr ago",
    color: "text-blue-500",
  },
  {
    icon: <CheckCircle2 size={15} />,
    text: "Laptop #A-019 returned successfully",
    time: "3 hr ago",
    color: "text-emerald-500",
  },
  {
    icon: <TrendingUp size={15} />,
    text: "Lab 3 inventory updated",
    time: "Yesterday",
    color: "text-indigo-500",
  },
];

export default function Dashboard({ userRole, onNavigate }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div>
        <p className="text-sm text-slate-500 mt-1">
          Here's an overview of the CCS laboratory assets.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<FlaskConical size={22} className="text-indigo-600" />}
          color="bg-indigo-50"
          label="Laboratories"
          value="6"
          sub="All operational"
        />
        <StatCard
          icon={<Monitor size={22} className="text-blue-600" />}
          color="bg-blue-50"
          label="Equipment"
          value="184"
          sub="12 for repair"
        />
        <StatCard
          icon={<MousePointer2 size={22} className="text-violet-600" />}
          color="bg-violet-50"
          label="Peripherals"
          value="430"
          sub="18 damaged"
        />
        <StatCard
          icon={<ClipboardList size={22} className="text-emerald-600" />}
          color="bg-emerald-50"
          label="Active Borrows"
          value="23"
          sub="5 overdue"
        />
      </div>

      {/* Main content row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-800">
              Recent Activity
            </h2>
            <span className="text-xs text-slate-400">Today</span>
          </div>
          <ul className="divide-y divide-slate-50">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-start gap-3 py-3.5">
                <span className={`mt-0.5 shrink-0 ${item.color}`}>
                  {item.icon}
                </span>
                <p className="text-sm text-slate-600 flex-1">{item.text}</p>
                <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Status snapshot */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-5">
            Asset Status
          </h2>
          <div className="flex flex-col gap-3">
            {[
              {
                label: "Working",
                count: 172,
                total: 184,
                color: "bg-emerald-500",
              },
              {
                label: "For Repair",
                count: 12,
                total: 184,
                color: "bg-amber-400",
              },
              { label: "Retired", count: 8, total: 184, color: "bg-slate-300" },
              { label: "Lost", count: 2, total: 184, color: "bg-red-400" },
            ].map((s) => (
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
              <p className="text-sm font-medium">5 borrows overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick nav */}
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
