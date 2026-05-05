import React from "react";
import {
  Activity,
  LogIn,
  Trash2,
  PenLine,
  PackagePlus,
  UserPlus,
  AlertCircle,
  History,
  Database,
} from "lucide-react";
import { useTableData } from "../lib/hooks/useTableData";

const getIconAndColor = (action: string, table: string) => {
  const a = action.toLowerCase();
  const t = (table || "").toLowerCase();

  if (a.includes("login"))
    return { icon: <LogIn size={16} />, color: "bg-green-50 text-green-500" };
  if (a.includes("delete") || a.includes("removed"))
    return { icon: <Trash2 size={16} />, color: "bg-rose-50 text-rose-500" };
  if (a.includes("update") || a.includes("edit"))
    return { icon: <PenLine size={16} />, color: "bg-amber-50 text-amber-500" };
  if (a.includes("insert") || a.includes("add") || a.includes("create"))
    return {
      icon: <PackagePlus size={16} />,
      color: "bg-indigo-50 text-indigo-500",
    };
  if (t.includes("user"))
    return {
      icon: <UserPlus size={16} />,
      color: "bg-purple-50 text-purple-500",
    };
  if (t.includes("damage"))
    return {
      icon: <AlertCircle size={16} />,
      color: "bg-rose-50 text-rose-500",
    };
  if (t.includes("borrow"))
    return { icon: <History size={16} />, color: "bg-blue-50 text-blue-500" };

  return { icon: <Database size={16} />, color: "bg-slate-100 text-slate-500" };
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ActivityLogs: React.FC = () => {
  const {
    data: logsData,
    isLoading,
    isError,
    error,
  } = useTableData("activity_logs", { refetchInterval: 3000 });

  console.log("logsData:", logsData);
  console.log("isLoading:", isLoading);
  console.log("isError:", isError);
  console.log("error:", error);
  const logs: any[] = logsData ?? [];

  const sorted = [...logs].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

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
          {sorted.length === 0 ? (
            <div className="p-12 text-center">
              <Activity size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">
                No activity logs available.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Actions will appear here as users interact with the system.
              </p>
            </div>
          ) : (
            sorted.map((log) => {
              const { icon, color } = getIconAndColor(
                log.action,
                log.table_affected ?? "",
              );
              return (
                <div
                  key={log.log_id}
                  className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className={`p-3 rounded-md shrink-0 ${color}`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-black text-slate-800 uppercase">
                        {log.action}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {formatTime(log.created_at)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500">
                      <span className="text-indigo-600 underline underline-offset-4 decoration-2">
                        {log.user_id ?? "System"}
                      </span>
                      {log.table_affected && (
                        <>
                          {" "}
                          — table:{" "}
                          <span className="text-slate-700">
                            {log.table_affected}
                          </span>
                        </>
                      )}
                      {log.record_id && (
                        <>
                          {" "}
                          · record{" "}
                          <span className="text-slate-700">
                            #{log.record_id}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {sorted.length > 0 && (
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
