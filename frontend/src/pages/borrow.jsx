// frontend/src/pages/borrow.jsx
import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Monitor,
  Calendar,
  MessageSquare,
  ArrowLeftRight,
  BookOpen,
  History,
  RefreshCw,
  Filter,
  ChevronRight,
  AlertCircle,
  Printer,
  MousePointer2,
  Key,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  borrowed: "bg-amber-50 text-amber-700",
  returned: "bg-emerald-50 text-emerald-700",
  overdue: "bg-red-50 text-red-600",
  cancelled: "bg-slate-100 text-slate-500",
};

const STATUS_LABELS = {
  borrowed: "Borrowed",
  returned: "Returned",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export default function BorrowTransactions({ userRole, currentUser }) {
  const [transactions, setTransactions] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [peripherals, setPeripherals] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [instructorView, setInstructorView] = useState("current");
  const [loading, setLoading] = useState(true);
  const [newBorrow, setNewBorrow] = useState({
    item_type: "equipment",
    item_id: "",
    quantity: 1,
    expected_return_date: "",
    remarks: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, equipmentRes, peripheralsRes] = await Promise.all(
        [
          axiosInstance.get("/transactions"),
          axiosInstance.get("/inventory"),
          axiosInstance.get("/peripherals"),
        ],
      );
      setTransactions(transactionsRes.data || []);
      setEquipment(equipmentRes.data || []);
      setPeripherals(peripheralsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserId = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        return JSON.parse(userData).user_id;
      } catch (e) {}
    }
    return currentUser?.user_id;
  };

  // FILTER BY INSTRUCTOR ID - THIS IS THE KEY FIX
  let filteredTransactions = transactions;
  if (userRole === "instructor") {
    const userId = getCurrentUserId();
    const userTransactions = transactions.filter(
      (t) => t.instructor_id === userId,
    );
    if (instructorView === "current") {
      filteredTransactions = userTransactions.filter(
        (t) => t.transaction_status === "borrowed",
      );
    } else {
      filteredTransactions = userTransactions.filter(
        (t) => t.transaction_status !== "borrowed",
      );
    }
  }

  const filtered = filteredTransactions.filter((t) => {
    const transactionId = t.transaction_id ? String(t.transaction_id) : "";
    const itemName = t.item_name || "";
    const borrower = t.borrower_name || "";
    const matchSearch =
      transactionId.toLowerCase().includes(search.toLowerCase()) ||
      itemName.toLowerCase().includes(search.toLowerCase()) ||
      borrower.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || t.transaction_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats =
    userRole === "admin"
      ? {
          borrowedCount: transactions.filter(
            (t) => t.transaction_status === "borrowed",
          ).length,
          returnedCount: transactions.filter(
            (t) => t.transaction_status === "returned",
          ).length,
          overdueCount: transactions.filter(
            (t) => t.transaction_status === "overdue",
          ).length,
          total: transactions.length,
        }
      : {
          currentBorrowed: transactions.filter(
            (t) =>
              t.instructor_id === getCurrentUserId() &&
              t.transaction_status === "borrowed",
          ).length,
          totalHistory: transactions.filter(
            (t) =>
              t.instructor_id === getCurrentUserId() &&
              t.transaction_status !== "borrowed",
          ).length,
        };

  const handleReturnItem = async (transaction) => {
    if (window.confirm(`Mark "${transaction.item_name}" as returned?`)) {
      try {
        await axiosInstance.put(
          `/update/borrow_transactions/${transaction.transaction_id}`,
          {
            data: {
              status: "returned",
              actual_return_date: new Date().toISOString(),
            },
          },
        );
        toast.success("Item marked as returned");
        fetchData();
      } catch (error) {
        console.error("Error returning item:", error);
        toast.error("Failed to return item");
      }
    }
  };

  const handleSubmitBorrow = async () => {
    if (!newBorrow.item_id || !newBorrow.expected_return_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const borrowData = {
        borrower_name:
          currentUser?.username || localStorage.getItem("userName"),
        quantity: parseInt(newBorrow.quantity),
        expected_return_date: newBorrow.expected_return_date,
        remarks: newBorrow.remarks || "",
      };

      if (newBorrow.item_type === "equipment") {
        borrowData.equipment_id = parseInt(newBorrow.item_id);
      } else {
        borrowData.peripheral_id = parseInt(newBorrow.item_id);
      }

      await axiosInstance.post("/create/borrow_transactions", {
        data: borrowData,
      });
      toast.success("Borrow request submitted");
      setIsFormOpen(false);
      setNewBorrow({
        item_type: "equipment",
        item_id: "",
        quantity: 1,
        expected_return_date: "",
        remarks: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error submitting borrow:", error);
      toast.error("Failed to submit borrow request");
    }
  };

  const getAvailableEquipment = () => {
    const borrowedEquipmentIds = transactions
      .filter((t) => t.transaction_status === "borrowed" && t.equipment_id)
      .map((t) => t.equipment_id);
    return equipment.filter(
      (e) => !borrowedEquipmentIds.includes(e.equipment_id),
    );
  };

  const getAvailablePeripherals = () => {
    return peripherals.filter((p) => p.working_count > 0);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "borrowed":
        return <Clock size={14} />;
      case "returned":
        return <CheckCircle size={14} />;
      case "overdue":
        return <AlertCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {userRole === "admin" ? "Borrow & Return" : "My Borrowings"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {userRole === "admin"
              ? `${stats.borrowedCount} active borrowings • ${stats.overdueCount} overdue`
              : `${stats.currentBorrowed} active borrowings`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="borrowed">Borrowed</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
          {userRole === "instructor" && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Borrow Item
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {userRole === "admin" ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Borrowed
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.borrowedCount}
              </p>
              <p className="text-xs text-slate-400">Active borrowings</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Returned
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.returnedCount}
              </p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Overdue
              </p>
              <p className="text-2xl font-bold text-red-600">
                {stats.overdueCount}
              </p>
              <p className="text-xs text-slate-400">Past due date</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <ClipboardList size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Total
              </p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-400">All transactions</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <BookOpen size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Current Borrowed
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.currentBorrowed}
              </p>
              <p className="text-xs text-slate-400">Items in your possession</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <History size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Borrow History
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalHistory}
              </p>
              <p className="text-xs text-slate-400">Completed transactions</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructor View Tabs */}
      {userRole === "instructor" && (
        <div className="flex gap-2 border-b border-slate-100">
          <button
            onClick={() => setInstructorView("current")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              instructorView === "current"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              Current Borrowings
            </div>
          </button>
          <button
            onClick={() => setInstructorView("history")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              instructorView === "history"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <History size={16} />
              Borrow History
            </div>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Transaction ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Item
                </th>
                {userRole === "admin" && (
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Borrower
                  </th>
                )}
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Qty
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Borrow Date
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Expected Return
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={userRole === "admin" ? 8 : 7}
                    className="text-center py-12 text-slate-400 text-sm"
                  >
                    No borrow transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((transaction) => (
                  <tr
                    key={transaction.transaction_id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                      TR-{transaction.transaction_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          {transaction.equipment_id ? (
                            <Monitor size={15} className="text-blue-500" />
                          ) : (
                            <MousePointer2
                              size={15}
                              className="text-blue-500"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {transaction.item_name}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            {transaction.asset_tag || "Peripheral"}
                          </p>
                        </div>
                      </div>
                    </td>
                    {userRole === "admin" && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <User size={12} className="text-slate-500" />
                          </div>
                          <span className="text-sm text-slate-600">
                            {transaction.borrower_name}
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {transaction.borrow_date
                        ? new Date(transaction.borrow_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {transaction.expected_return_date
                        ? new Date(
                            transaction.expected_return_date,
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[transaction.transaction_status]}`}
                      >
                        {getStatusIcon(transaction.transaction_status)}
                        {STATUS_LABELS[transaction.transaction_status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {userRole === "instructor" &&
                          transaction.transaction_status === "borrowed" && (
                            <button
                              onClick={() => handleReturnItem(transaction)}
                              className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                              title="Mark as Returned"
                            >
                              <CheckCircle size={16} />
                            </button>
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

      {/* View Transaction Modal */}
      {isViewModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Transaction Details
                </h2>
                <p className="text-sm text-slate-500 font-mono">
                  TR-{selectedTransaction.transaction_id}
                </p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition"
              >
                <XCircle size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Item
                  </label>
                  <p className="text-base font-semibold text-slate-900 mt-1">
                    {selectedTransaction.item_name}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Quantity
                  </label>
                  <p className="text-base font-semibold text-slate-900 mt-1">
                    {selectedTransaction.quantity}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Borrower
                  </label>
                  <p className="text-sm text-slate-700 mt-1">
                    {selectedTransaction.borrower_name}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[selectedTransaction.transaction_status]}`}
                    >
                      {getStatusIcon(selectedTransaction.transaction_status)}
                      {STATUS_LABELS[selectedTransaction.transaction_status]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Borrow Date
                  </label>
                  <p className="text-sm text-slate-700 mt-1">
                    {new Date(selectedTransaction.borrow_date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Expected Return Date
                  </label>
                  <p className="text-sm text-slate-700 mt-1">
                    {new Date(
                      selectedTransaction.expected_return_date,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedTransaction.actual_return_date && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Actual Return Date
                  </label>
                  <p className="text-sm text-slate-700 mt-1">
                    {new Date(
                      selectedTransaction.actual_return_date,
                    ).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Remarks
                </label>
                <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-3 rounded-lg">
                  {selectedTransaction.remarks || "No remarks provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Borrow Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Borrow Item</h2>
              <p className="text-sm text-slate-500">
                Fill out the form to borrow equipment
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Item Type *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="equipment"
                      checked={newBorrow.item_type === "equipment"}
                      onChange={(e) =>
                        setNewBorrow({
                          ...newBorrow,
                          item_type: e.target.value,
                          item_id: "",
                        })
                      }
                      className="w-4 h-4 text-slate-900"
                    />
                    <span className="text-sm text-slate-700">Equipment</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="peripheral"
                      checked={newBorrow.item_type === "peripheral"}
                      onChange={(e) =>
                        setNewBorrow({
                          ...newBorrow,
                          item_type: e.target.value,
                          item_id: "",
                        })
                      }
                      className="w-4 h-4 text-slate-900"
                    />
                    <span className="text-sm text-slate-700">Peripheral</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Select{" "}
                  {newBorrow.item_type === "equipment"
                    ? "Equipment"
                    : "Peripheral"}{" "}
                  *
                </label>
                <select
                  value={newBorrow.item_id}
                  onChange={(e) =>
                    setNewBorrow({ ...newBorrow, item_id: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                >
                  <option value="">Select an item</option>
                  {(newBorrow.item_type === "equipment"
                    ? getAvailableEquipment()
                    : getAvailablePeripherals()
                  ).map((item) => (
                    <option
                      key={item.equipment_id || item.peripheral_id}
                      value={item.equipment_id || item.peripheral_id}
                    >
                      {item.item_name} (
                      {item.asset_tag || `Available: ${item.working_count}`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  max={newBorrow.item_type === "equipment" ? 1 : 10}
                  value={newBorrow.quantity}
                  onChange={(e) =>
                    setNewBorrow({ ...newBorrow, quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                />
                {newBorrow.item_type === "equipment" && (
                  <p className="text-xs text-slate-400 mt-1">
                    Equipment can only be borrowed one at a time
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Expected Return Date *
                </label>
                <input
                  type="datetime-local"
                  value={newBorrow.expected_return_date}
                  onChange={(e) =>
                    setNewBorrow({
                      ...newBorrow,
                      expected_return_date: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Standard borrowing period is 7 days
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Remarks
                </label>
                <textarea
                  value={newBorrow.remarks}
                  onChange={(e) =>
                    setNewBorrow({ ...newBorrow, remarks: e.target.value })
                  }
                  rows={3}
                  placeholder="Purpose of borrowing, special instructions, etc."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBorrow}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition"
              >
                Submit Borrow Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
