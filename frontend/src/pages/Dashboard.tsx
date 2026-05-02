import React from "react";
import {
  Monitor,
  Plus,
  Wrench,
  PackageCheck,
  HandHelping,
  CircleDot,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface DashboardProps {
  userRole: "admin" | "instructor";
}

const DashboardProp: React.FC<DashboardProps> = ({}) => {
  // All stats are zero – ready to be replaced with real data from props/API
  const totalPcs = 0;
  const availableUnits = 0;
  const borrowedItems = 0;
  const damageReports = 0;

  const availablePercent = totalPcs === 0 ? 0 : (availableUnits / totalPcs) * 100;
  const borrowedPercent = totalPcs === 0 ? 0 : (borrowedItems / totalPcs) * 100;
  const damagePercent = totalPcs === 0 ? 0 : (damageReports / totalPcs) * 100;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-700">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="TOTAL PCs"
            value={totalPcs.toString()}
            subtitle="Across all labs"
            icon={<Monitor className="text-indigo-500" strokeWidth={1.8} />}
            progressColor="bg-indigo-500"
            progressWidth={100}
            bgColor="bg-white"
            iconBg="bg-indigo-50"
          />
          <StatCard
            title="AVAILABLE UNITS"
            value={availableUnits.toString()}
            subtitle="Ready for use"
            icon={
              <CheckCircle className="text-emerald-500" strokeWidth={1.8} />
            }
            progressColor="bg-emerald-500"
            progressWidth={availablePercent}
            bgColor="bg-white"
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="BORROWED ITEMS"
            value={borrowedItems.toString()}
            subtitle="Active transactions"
            icon={<HandHelping className="text-amber-500" strokeWidth={1.8} />}
            progressColor="bg-amber-400"
            progressWidth={borrowedPercent}
            bgColor="bg-white"
            iconBg="bg-amber-50"
          />
          <StatCard
            title="DAMAGE REPORTS"
            value={damageReports.toString()}
            subtitle="Pending resolution"
            icon={<AlertTriangle className="text-rose-500" strokeWidth={1.8} />}
            progressColor="bg-rose-400"
            progressWidth={damagePercent}
            bgColor="bg-white"
            iconBg="bg-rose-50"
            isWarning
          />
        </div>

        {/* Laboratory Overview - empty state */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Laboratory Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="col-span-full text-center py-12 bg-white rounded-md border border-slate-200">
              <Monitor size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">No laboratories added yet.</p>
            </div>
          </div>
        </div>

        {/* Recent Activity - empty state */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Recent Activity
          </h3>
          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-8 text-center">
            <Clock size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">No recent activity to show.</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-6 mt-4 text-center text-xs text-slate-400">
          <p>
            © 2026 CLAMS - Computer Laboratory Asset Management System. All
            rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

/* Updated StatCard with dynamic progress width */
const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  progressColor: string;
  progressWidth: number;
  bgColor: string;
  iconBg: string;
  isWarning?: boolean;
}> = ({
  title,
  value,
  subtitle,
  icon,
  progressColor,
  progressWidth,
  bgColor,
  iconBg,
  isWarning,
}) => (
  <div
    className={`p-5 rounded-md border border-slate-200 ${bgColor} ${isWarning ? "shadow-sm" : ""}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[11px] font-bold text-slate-500 tracking-wider">
          {title}
        </p>
        <h4 className="text-3xl font-bold text-slate-800 mt-1">{value}</h4>
      </div>
      <div className={`p-2 rounded-md ${iconBg}`}>{icon}</div>
    </div>
    <p className="text-xs text-slate-400 mb-3">{subtitle}</p>
    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
      <div
        className={`${progressColor} h-full rounded-full`}
        style={{ width: `${progressWidth}%` }}
      />
    </div>
  </div>
);

export default DashboardProp;