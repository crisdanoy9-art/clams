import React, { useState } from "react";
import {
  ClipboardList,
  Plus,
  Search,
  User,
  Package,
  Calendar,
  CheckCircle,
  Clock,
  Layers,
  Users,
  Repeat,
  ArrowLeftRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { AddModal } from "../components/reusableModal";
import { borrowFields } from "../lib/validations/returns";
import { useQueryClient } from "@tanstack/react-query";
import { useTableData } from "../lib/hooks/useTableData";
import { updateData } from "../lib/api/Methods";

interface BorrowReturnProps {
  userRole: "admin" | "instructor";
}

const BorrowReturn: React.FC<BorrowReturnProps> = ({ userRole }) => {
  const queryClient = useQueryClient();
  const { data: usersData = [] } = useTableData("users");
  const { data: peripheralsData = [] } = useTableData("peripherals");
  const { data: transactionsData = [] } = useTableData("borrow_transactions");

  const [showModal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"borrowed" | "returned">("borrowed");
  const [returningId, setReturningId] = useState<number | null>(null);

  // ── A transaction is "borrowed" if remarks is 'borrowed', 'pending', or NULL
  const isBorrowed = (t: any) =>
    !t.remarks || t.remarks === "borrowed" || t.remarks === "pending";
  const isReturned = (t: any) => t.remarks === "returned";

  // ── Stats ─────────────────────────────────────────────────────────────────

  // Total inventory = sum of working_count (never changes on borrow)
  const totalInventory = peripheralsData.reduce(
    (sum: number, p: any) => sum + (Number(p.working_count) || 0),
    0,
  );

  // Active borrows = count of non-returned transactions
  const activeBorrowsList = transactionsData.filter(isBorrowed);
  const activeBorrows = activeBorrowsList.length;

  // Build qty map of currently borrowed items
  const borrowedQtyMap: Record<string, number> = {};
  activeBorrowsList.forEach((t: any) => {
    borrowedQtyMap[t.item_name] =
      (borrowedQtyMap[t.item_name] ?? 0) + (Number(t.quantity) || 1);
  });

  // Available now = working_count minus currently borrowed qty per item
  const availableNow = peripheralsData.reduce((sum: number, p: any) => {
    const borrowed = borrowedQtyMap[p.item_name] ?? 0;
    return sum + Math.max(0, (Number(p.working_count) || 0) - borrowed);
  }, 0);

  const completedReturns = transactionsData.filter(isReturned).length;

  // ── Filtering ─────────────────────────────────────────────────────────────

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOverdue = (expectedDate: string) => {
    if (!expectedDate) return false;
    const d = new Date(expectedDate);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const displayed = transactionsData
    .filter((t: any) =>
      viewMode === "borrowed" ? isBorrowed(t) : isReturned(t),
    )
    .filter((t: any) =>
      (t.borrower_name ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
    );

  // ── Mark as returned ──────────────────────────────────────────────────────

  const handleMarkReturned = async (t: any) => {
    setReturningId(t.transaction_id);
    try {
      // 1. Mark transaction as returned
      await updateData("borrow_transactions", t.transaction_id, {
        remarks: "returned",
        actual_return_date: new Date().toISOString().split("T")[0],
      });

      // 2. Add quantity back to peripheral working_count
      const peripheral = peripheralsData.find(
        (p: any) => p.item_name === t.item_name,
      );
      if (peripheral) {
        const newCount =
          (Number(peripheral.working_count) || 0) + (Number(t.quantity) || 1);
        await updateData("peripherals", peripheral.peripheral_id, {
          working_count: newCount,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["borrow_transactions"] });
      queryClient.invalidateQueries({ queryKey: ["peripherals"] });
    } catch (err) {
      console.error("Failed to mark as returned:", err);
    } finally {
      setReturningId(null);
    }
  };

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Borrow & Return
          </h2>
          <p className="text-xs font-bold text-slate-400">
            Track movement of lab accessories and equipment
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-md font-black text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
        >
          <Plus size={18} /> New Borrow Entry
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-md border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Total Inventory
              </p>
              <p className="text-3xl font-black text-slate-800 mt-1">
                {totalInventory}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Layers className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Available Now
              </p>
              <p className="text-3xl font-black text-emerald-600 mt-1">
                {availableNow}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Package className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Active Borrows
              </p>
              <p className="text-3xl font-black text-amber-600 mt-1">
                {activeBorrows}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Users className="text-amber-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Completed Returns
              </p>
              <p className="text-3xl font-black text-slate-800 mt-1">
                {completedReturns}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <Repeat className="text-slate-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-indigo-600" size={18} />
            <span className="font-black text-slate-700 text-[10px] uppercase tracking-widest">
              {viewMode === "borrowed" ? "Borrowing Records" : "Return History"}
            </span>
            <span className="ml-2 bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-1 rounded-md">
              {displayed.length}{" "}
              {viewMode === "borrowed" ? "active" : "returned"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("borrowed")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewMode === "borrowed"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <ArrowLeftRight size={12} /> Borrowing
              </button>
              <button
                onClick={() => setViewMode("returned")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewMode === "returned"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Repeat size={12} /> Returned
              </button>
            </div>

            <div className="relative w-full md:w-72">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search borrower name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-[0.15em]">
                <th className="px-8 py-5">Borrower</th>
                <th className="px-8 py-5">Item</th>
                <th className="px-8 py-5">Qty</th>
                <th className="px-8 py-5">Borrow Date</th>
                <th className="px-8 py-5">Expected Return</th>
                {viewMode === "returned" && (
                  <th className="px-8 py-5">Returned On</th>
                )}
                <th className="px-8 py-5">Status</th>
                {viewMode === "borrowed" && (
                  <th className="px-8 py-5 text-right">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="text-xs font-bold text-slate-600 divide-y divide-slate-50">
              {displayed.length === 0 ? (
                <tr>
                  <td
                    colSpan={viewMode === "borrowed" ? 7 : 7}
                    className="px-8 py-16 text-center text-slate-400 text-xs font-bold"
                  >
                    {viewMode === "borrowed"
                      ? "No active borrow records"
                      : "No return records yet"}
                  </td>
                </tr>
              ) : (
                displayed.map((t: any) => {
                  const overdue =
                    viewMode === "borrowed" &&
                    isOverdue(t.expected_return_date);
                  const isProcessing = returningId === t.transaction_id;

                  return (
                    <tr
                      key={t.transaction_id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        overdue ? "bg-red-50/40" : ""
                      }`}
                    >
                      {/* Borrower */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="text-slate-900 font-black">
                              {t.borrower_name || "—"}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              ID: {t.instructor_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Item */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <Package
                            size={14}
                            className="text-slate-300 flex-shrink-0"
                          />
                          <span>{t.item_name || "—"}</span>
                        </div>
                      </td>

                      {/* Qty */}
                      <td className="px-8 py-5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-black text-xs">
                          {t.quantity ?? 1}
                        </span>
                      </td>

                      {/* Borrow Date */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={14} />
                          {formatDate(t.borrow_date)}
                        </div>
                      </td>

                      {/* Expected Return */}
                      <td className="px-8 py-5">
                        <div
                          className={`flex items-center gap-2 ${
                            overdue ? "text-red-500" : "text-slate-400"
                          }`}
                        >
                          {overdue ? (
                            <AlertTriangle size={14} />
                          ) : (
                            <Calendar size={14} />
                          )}
                          {formatDate(t.expected_return_date)}
                          {overdue && (
                            <span className="text-[8px] font-black uppercase bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Returned On — only in returned view */}
                      {viewMode === "returned" && (
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={14} />
                            {formatDate(t.actual_return_date)}
                          </div>
                        </td>
                      )}

                      {/* Status */}
                      <td className="px-8 py-5">
                        {isReturned(t) ? (
                          <span className="px-3 py-1.5 rounded-md text-[9px] uppercase font-black bg-emerald-100 text-emerald-600 flex items-center gap-1 w-fit">
                            <CheckCircle size={10} /> Returned
                          </span>
                        ) : overdue ? (
                          <span className="px-3 py-1.5 rounded-md text-[9px] uppercase font-black bg-red-100 text-red-600 flex items-center gap-1 w-fit">
                            <AlertTriangle size={10} /> Overdue
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-md text-[9px] uppercase font-black bg-amber-100 text-amber-600 flex items-center gap-1 w-fit">
                            <Clock size={10} /> Borrowed
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      {viewMode === "borrowed" && (
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => handleMarkReturned(t)}
                            disabled={isProcessing}
                            className="flex items-center gap-2 ml-auto text-indigo-600 hover:text-white transition-colors bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-600 disabled:opacity-50 text-[10px] uppercase font-black"
                          >
                            {isProcessing ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Repeat size={14} />
                            )}
                            {isProcessing ? "Saving..." : "Mark Returned"}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory summary */}
      <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Package size={14} /> Real-time Inventory Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {peripheralsData.map((p: any) => {
            const borrowed = borrowedQtyMap[p.item_name] ?? 0;
            const available = Math.max(
              0,
              (Number(p.working_count) || 0) - borrowed,
            );
            return (
              <div
                key={p.peripheral_id}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
              >
                <div>
                  <p className="font-black text-slate-800 text-sm">
                    {p.item_name}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {p.brand}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-800">
                    {available}
                    <span className="text-xs font-bold text-slate-400">
                      /{Number(p.working_count) || 0}
                    </span>
                  </p>
                  <p className="text-[9px] font-bold text-slate-400">
                    available
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <AddModal
          fields={borrowFields(usersData, peripheralsData)}
          table="borrow_transactions"
          onClose={() => setModal(false)}
          onSuccess={async (submittedData?: any) => {
            // Deduct quantity from peripheral working_count on borrow
            if (submittedData?.item_name) {
              const peripheral = peripheralsData.find(
                (p: any) => p.item_name === submittedData.item_name,
              );
              if (peripheral) {
                const qty = Number(submittedData.quantity) || 1;
                const newCount = Math.max(
                  0,
                  (Number(peripheral.working_count) || 0) - qty,
                );
                await updateData("peripherals", peripheral.peripheral_id, {
                  working_count: newCount,
                });
              }
            }
            queryClient.invalidateQueries({
              queryKey: ["borrow_transactions"],
            });
            queryClient.invalidateQueries({ queryKey: ["peripherals"] });
            setModal(false);
          }}
        />
      )}
    </div>
  );
};

export default BorrowReturn;
