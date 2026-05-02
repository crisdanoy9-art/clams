import React from "react";
import {
  History,
  ShieldCheck,
  Database,
  UserPlus,
  AlertCircle,
  Activity,
} from "lucide-react";

const ActivityLogs: React.FC = () => {
  // Start with an empty array – no example logs
  const logs: {
    id: number;
    user: string;
    action: string;
    details: string;
    time: string;
    icon: React.ReactNode;
    color: string;
  }[] = [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
          System Activity Logs
        </h2>
        <p className="text-xs font-bold text-slate-400">
          Audit trail of all administrative and instructor actions
        </p>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {logs.length === 0 ? (
            <div className="p-12 text-center">
              <Activity size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">No activity logs available.</p>
              <p className="text-xs text-slate-400 mt-1">
                Actions will appear here as users interact with the system.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className={`p-3 rounded-md shrink-0 ${log.color}`}>
                  {log.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-black text-slate-800">
                      {log.action}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {log.time}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    User{" "}
                    <span className="text-indigo-600 underline underline-offset-4 decoration-2">
                      {log.user}
                    </span>
                    : {log.details}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {logs.length > 0 && (
          <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
              Load Older Activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;