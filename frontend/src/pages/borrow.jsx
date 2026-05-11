import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useRefresh } from "../contexts/RefreshContext";

const STATUS_STYLES = {
  borrowed: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  returned: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS = { borrowed: "Borrowed", returned: "Returned", overdue: "Overdue" };

export default function BorrowTransactions({ userRole, currentUser, onRefresh }) {
  const { triggerRefresh } = useRefresh();
  const [transactions, setTransactions] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [peripherals, setPeripherals] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newBorrow, setNewBorrow] = useState({
    item_type: "equipment",
    item_id: "",
    quantity: 1,
    expected_return_date: "",
    remarks: "",
  });
  const [maxAvailable, setMaxAvailable] = useState(0);
  const [quantityError, setQuantityError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, equipmentRes, peripheralsRes] = await Promise.all([
        axiosInstance.get("/transactions"),
        axiosInstance.get("/inventory"),
        axiosInstance.get("/peripherals"),
      ]);
      setTransactions(transactionsRes.data || []);
      setEquipment(equipmentRes.data || []);
      setPeripherals(peripheralsRes.data || []);
      triggerRefresh();
      onRefresh();
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

  let filteredTransactions = transactions;
  if (userRole === "instructor") {
    const userId = getCurrentUserId();
    filteredTransactions = transactions.filter((t) => t.instructor_id === userId);
  }

  const filtered = filteredTransactions.filter((t) => {
    const transactionId = t.transaction_id ? String(t.transaction_id) : "";
    const itemName = t.item_name || "";
    const borrower = t.borrower_name || "";
    const pcName = t.pc_name || "";
    const matchSearch =
      transactionId.toLowerCase().includes(search.toLowerCase()) ||
      itemName.toLowerCase().includes(search.toLowerCase()) ||
      borrower.toLowerCase().includes(search.toLowerCase()) ||
      pcName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.transaction_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats =
    userRole === "admin"
      ? {
          borrowedCount: transactions.filter((t) => t.transaction_status === "borrowed").length,
          returnedCount: transactions.filter((t) => t.transaction_status === "returned").length,
          overdueCount: transactions.filter((t) => t.transaction_status === "overdue").length,
          total: transactions.length,
        }
      : {
          currentBorrowed: transactions.filter(
            (t) =>
              t.instructor_id === getCurrentUserId() && t.transaction_status === "borrowed"
          ).length,
          totalHistory: transactions.filter(
            (t) =>
              t.instructor_id === getCurrentUserId() && t.transaction_status !== "borrowed"
          ).length,
        };

  const handleReturnItem = async (transaction) => {
    if (window.confirm(`Mark "${transaction.item_name}" as returned?`)) {
      try {
        await axiosInstance.put(`/update/borrow_transactions/${transaction.transaction_id}`, {
          data: {
            status: "returned",
            actual_return_date: new Date().toISOString(),
          },
        });
        toast.success("Item marked as returned");
        fetchData();
      } catch (error) {
        console.error("Error returning item:", error);
        toast.error("Failed to return item");
      }
    }
  };

  const handleSubmitBorrow = async () => {
    // Prevent multiple submissions
    if (submitting) return;
    
    // Validate form
    if (!newBorrow.item_id) {
      toast.error("Please select an item to borrow");
      return;
    }
    if (!newBorrow.expected_return_date) {
      toast.error("Please select an expected return date");
      return;
    }
    if (quantityError) {
      toast.error(quantityError);
      return;
    }

    setSubmitting(true);

    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const borrowerName = userData.username || currentUser?.username || "Unknown User";
      const instructorId = userData.user_id || currentUser?.user_id;

      if (!instructorId) {
        toast.error("User not authenticated");
        setSubmitting(false);
        return;
      }

      const borrowData = {
        instructor_id: instructorId,
        borrower_name: borrowerName,
        quantity: parseInt(newBorrow.quantity),
        expected_return_date: newBorrow.expected_return_date,
        remarks: newBorrow.remarks || "",
      };

      if (newBorrow.item_type === "equipment") {
        borrowData.equipment_id = parseInt(newBorrow.item_id);
      } else {
        borrowData.peripheral_id = parseInt(newBorrow.item_id);
      }

      console.log("Submitting:", borrowData);

      const response = await axiosInstance.post("/create/borrow_transactions", { 
        data: borrowData 
      });
      
      console.log("Response:", response.data);
      toast.success("Borrow request submitted successfully!");
      
      // Reset form and close modal
      setIsFormOpen(false);
      setNewBorrow({
        item_type: "equipment",
        item_id: "",
        quantity: 1,
        expected_return_date: "",
        remarks: "",
      });
      setQuantityError("");
      
      // Refresh data
      await fetchData();
      
    } catch (error) {
      console.error("Error submitting borrow:", error);
      const errorMsg = error.response?.data?.error || error.response?.data?.msg || "Failed to submit borrow request";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const getAvailableEquipment = () => {
    const borrowedEquipmentIds = transactions
      .filter((t) => t.transaction_status === "borrowed" && t.equipment_id)
      .map((t) => t.equipment_id);
    return equipment.filter((e) => !borrowedEquipmentIds.includes(e.equipment_id));
  };

  const getAvailablePeripherals = () => {
    return peripherals.filter((p) => p.working_count > 0);
  };

  const handleItemChange = (itemId) => {
    setNewBorrow({ ...newBorrow, item_id: itemId, quantity: 1 });
    setQuantityError("");
    if (newBorrow.item_type === "peripheral" && itemId) {
      const selected = peripherals.find((p) => p.peripheral_id === parseInt(itemId));
      if (selected) {
        setMaxAvailable(selected.working_count);
      } else {
        setMaxAvailable(0);
      }
    } else {
      setMaxAvailable(1);
    }
  };

  const handleQuantityChange = (value) => {
    const qty = parseInt(value) || 0;
    setNewBorrow({ ...newBorrow, quantity: qty });
    if (newBorrow.item_type === "peripheral") {
      if (qty > maxAvailable) {
        setQuantityError(`Only ${maxAvailable} unit(s) available`);
      } else if (qty < 1) {
        setQuantityError("Quantity must be at least 1");
      } else {
        setQuantityError("");
      }
    } else {
      if (qty !== 1) {
        setQuantityError("Equipment can only be borrowed one at a time");
      } else {
        setQuantityError("");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "borrowed": return <Clock size={14} />;
      case "returned": return <CheckCircle size={14} />;
      case "overdue": return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return !quantityError && newBorrow.item_id && newBorrow.expected_return_date;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {userRole === "admin" ? "Borrow & Return" : "My Borrowings"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {userRole === "admin"
              ? `${stats.borrowedCount} active borrowings • ${stats.overdueCount} overdue`
              : `${stats.currentBorrowed} active borrowings`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white w-56 transition"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer dark:text-white transition"
          >
            <option value="all">All Status</option>
            <option value="borrowed">Borrowed</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition transform hover:scale-105"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-slate-500 dark:text-slate-400" />
          </button>
          {userRole === "instructor" && (
            <button
              onClick={() => {
                setIsFormOpen(true);
                setNewBorrow({
                  item_type: "equipment",
                  item_id: "",
                  quantity: 1,
                  expected_return_date: "",
                  remarks: "",
                });
                setQuantityError("");
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 transition transform hover:scale-105"
            >
              <Plus size={16} /> Borrow Item
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {userRole === "admin" ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Borrowed</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.borrowedCount}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Active borrowings</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Returned</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.returnedCount}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Completed</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Overdue</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdueCount}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Past due date</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <ClipboardList size={20} className="text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">All transactions</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Current Borrowed</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.currentBorrowed}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Items in your possession</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <RefreshCw size={20} className="text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Borrow History</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalHistory}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Completed transactions</p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Item</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Borrower</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Qty</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Borrow Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((transaction) => (
                <tr key={transaction.transaction_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">TR-{transaction.transaction_id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800 dark:text-white">{transaction.item_name}</p>
                    <p className="text-xs text-slate-400 font-mono">{transaction.pc_name || "Peripheral"}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{transaction.borrower_name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{transaction.quantity}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                    {transaction.borrow_date ? new Date(transaction.borrow_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[transaction.transaction_status]}`}>
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
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Eye size={16} className="text-slate-500 dark:text-slate-400" />
                      </button>
                      {userRole === "instructor" && transaction.transaction_status === "borrowed" && (
                        <button
                          onClick={() => handleReturnItem(transaction)}
                          className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition"
                          title="Mark as Returned"
                        >
                          <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Transaction Modal */}
      {isViewModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transaction Details</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">TR-{selectedTransaction.transaction_id}</p>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <XCircle size={20} className="text-slate-400 dark:text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Item</label>
                  <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">{selectedTransaction.item_name}</p>
                  <p className="text-sm text-slate-500 font-mono">{selectedTransaction.pc_name || "Peripheral"}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Quantity</label>
                  <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">{selectedTransaction.quantity}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Borrower</label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{selectedTransaction.borrower_name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[selectedTransaction.transaction_status]}`}>
                      {getStatusIcon(selectedTransaction.transaction_status)}
                      {STATUS_LABELS[selectedTransaction.transaction_status]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Borrow Date</label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{new Date(selectedTransaction.borrow_date).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Expected Return</label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{new Date(selectedTransaction.expected_return_date).toLocaleString()}</p>
                </div>
              </div>
              {selectedTransaction.actual_return_date && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Actual Return Date</label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{new Date(selectedTransaction.actual_return_date).toLocaleString()}</p>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Remarks</label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">{selectedTransaction.remarks || "No remarks provided"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Borrow Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Borrow Item</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Fill out the form to borrow equipment</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Item Type *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="equipment" checked={newBorrow.item_type === "equipment"} onChange={(e) => { setNewBorrow({ ...newBorrow, item_type: e.target.value, item_id: "", quantity: 1 }); setQuantityError(""); }} className="w-4 h-4 text-slate-900" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Equipment</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="peripheral" checked={newBorrow.item_type === "peripheral"} onChange={(e) => { setNewBorrow({ ...newBorrow, item_type: e.target.value, item_id: "", quantity: 1 }); setQuantityError(""); }} className="w-4 h-4 text-slate-900" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Peripheral</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Select Item *</label>
                <select value={newBorrow.item_id} onChange={(e) => handleItemChange(e.target.value)} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white">
                  <option value="">Select an item</option>
                  {(newBorrow.item_type === "equipment" ? getAvailableEquipment() : getAvailablePeripherals()).map((item) => (
                    <option key={item.equipment_id || item.peripheral_id} value={item.equipment_id || item.peripheral_id}>
                      {item.item_name} ({item.pc_name || `Available: ${item.working_count}`})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Quantity *</label>
                <input type="number" min="1" max={newBorrow.item_type === "equipment" ? 1 : maxAvailable} value={newBorrow.quantity} onChange={(e) => handleQuantityChange(e.target.value)} className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white ${quantityError ? "border-red-500" : "border-slate-200 dark:border-slate-700"}`} />
                {quantityError && <p className="text-xs text-red-500 mt-1">{quantityError}</p>}
                {newBorrow.item_type === "equipment" && <p className="text-xs text-slate-400 mt-1">Equipment can only be borrowed one at a time</p>}
                {newBorrow.item_type === "peripheral" && maxAvailable > 0 && !quantityError && <p className="text-xs text-slate-400 mt-1">Available: {maxAvailable} units</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Expected Return Date *</label>
                <input type="datetime-local" value={newBorrow.expected_return_date} onChange={(e) => setNewBorrow({ ...newBorrow, expected_return_date: e.target.value })} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white" />
                <p className="text-xs text-slate-400 mt-1">Select when the item should be returned</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Remarks</label>
                <textarea value={newBorrow.remarks} onChange={(e) => setNewBorrow({ ...newBorrow, remarks: e.target.value })} rows={3} placeholder="Purpose of borrowing, special instructions, etc." className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white resize-none" />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitBorrow} 
                disabled={!isFormValid() || submitting}
                className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition flex items-center gap-2 ${
                  isFormValid() && !submitting
                    ? "bg-slate-900 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 cursor-pointer"
                    : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed opacity-50"
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Borrow Request"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}