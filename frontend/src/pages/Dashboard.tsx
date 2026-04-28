import React from 'react';
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
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  // Calculate realistic progress percentages
  const totalPcs = 86;
  const availableUnits = 74;
  const borrowedItems = 8;
  const damageReports = 4;

  const availablePercent = (availableUnits / totalPcs) * 100;
  const borrowedPercent = (borrowedItems / totalPcs) * 100;
  const damagePercent = (damageReports / totalPcs) * 100;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-700">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-xs text-slate-500 mt-1">CLAMS / Admin / Dashboard</p>
          </div>
          
   
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="TOTAL PCs" 
            value={totalPcs.toString()} 
            subtitle="Across all 3 labs" 
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
            icon={<CheckCircle className="text-emerald-500" strokeWidth={1.8} />} 
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

        {/* Laboratory Overview - full width */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Laboratory Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <LabCard name="Lab 1" room="Room 101" pcs={30} avail={28} issues={2} />
            <LabCard name="Lab 2" room="Room 102" pcs={28} avail={24} issues={4} />
            <LabCard name="Lab 3" room="Room 103" pcs={28} avail={22} issues={6} />
          </div>
        </div>

        {/* Recent Activity - below labs, full width */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Activity</h3>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
            <ActivityItem 
              icon={<HandHelping className="w-4 h-4 text-indigo-500" />}
              text="Keyboard borrowed from Lab 1 by J. Santos"
              time="Today 13:42 PM"
            />
            <ActivityItem 
              icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
              text="Damage report filed - Monitor #14, lab 3"
              time="Today 10:15 PM"
            />
            <ActivityItem 
              icon={<Monitor className="w-4 h-4 text-slate-500" />}
              text="Equipment record updated - Dell OptiPlex, Lab 1"
              time="Yesterday 02:39 PM"
            />
            <ActivityItem 
              icon={<Users className="w-4 h-4 text-emerald-500" />}
              text="New instructor account created"
              time="Yesterday 02:39 PM"
            />
            <ActivityItem 
              icon={<PackageCheck className="w-4 h-4 text-amber-500" />}
              text="Headset returned - Lab 1 transaction #TXN-041"
              time="Apr 26 04:10 PM"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-6 mt-4 text-center text-xs text-slate-400">
          <p>© 2024 CLAMS - Computer Laboratory Asset Management System. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

/* Updated StatCard with dynamic progress width */
const StatCard: React.FC<{ 
  title: string, 
  value: string, 
  subtitle: string, 
  icon: React.ReactNode, 
  progressColor: string,
  progressWidth: number,
  bgColor: string,
  iconBg: string,
  isWarning?: boolean 
}> = ({ title, value, subtitle, icon, progressColor, progressWidth, bgColor, iconBg, isWarning }) => (
  <div className={`p-5 rounded-xl border border-slate-200 ${bgColor} ${isWarning ? 'shadow-sm' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[11px] font-bold text-slate-500 tracking-wider">{title}</p>
        <h4 className="text-3xl font-bold text-slate-800 mt-1">{value}</h4>
      </div>
      <div className={`p-2 rounded-xl ${iconBg}`}>
        {icon}
      </div>
    </div>
    <p className="text-xs text-slate-400 mb-3">{subtitle}</p>
    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
      <div className={`${progressColor} h-full rounded-full`} style={{ width: `${progressWidth}%` }} />
    </div>
  </div>
);

/* LabCard with modern subtle styling */
const LabCard: React.FC<{ name: string, room: string, pcs: number, avail: number, issues: number }> = ({ name, room, pcs, avail, issues }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h4 className="font-bold text-slate-800">{name}</h4>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{room}</p>
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100">
        <CircleDot className="text-emerald-500 w-2.5 h-2.5 fill-emerald-500" />
        <span className="text-[10px] font-bold text-emerald-600 uppercase">Online</span>
      </div>
    </div>
    <div className="flex justify-between text-center border-t border-slate-100 pt-4">
      <div>
        <p className="text-xl font-bold text-slate-800">{pcs}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">PCS</p>
      </div>
      <div>
        <p className="text-xl font-bold text-emerald-600">{avail}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Available</p>
      </div>
      <div>
        <p className="text-xl font-bold text-rose-500">{issues}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Issues</p>
      </div>
    </div>
  </div>
);

/* ActivityItem with colored icons and cleaner layout */
const ActivityItem: React.FC<{ icon: React.ReactNode, text: string, time: string }> = ({ icon, text, time }) => (
  <div className="flex gap-3 group">
    <div className="mt-0.5">
      {icon}
    </div>
    <div className="flex-1 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <p className="text-sm font-medium text-slate-700 leading-snug">{text}</p>
      <div className="flex items-center gap-1 mt-1">
        <Clock size={10} className="text-slate-400" />
        <p className="text-[11px] text-slate-400">{time}</p>
      </div>
    </div>
  </div>
);

export default DashboardContent;